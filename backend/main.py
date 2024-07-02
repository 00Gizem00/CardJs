from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db, engine
from database import models, schemas

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/words/", response_model=schemas.Word)
def create_word(word: schemas.WordCreate, db: Session = Depends(get_db)):
    db_word = models.Word(**word.dict())
    db.add(db_word)
    db.commit()
    db.refresh(db_word)
    return db_word

@app.get("/words/", response_model=List[schemas.Word])
def read_words(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    words = db.query(models.Word).offset(skip).limit(limit).all()
    return words

@app.get("/words/{word_id}", response_model=schemas.Word)
def read_word(word_id: int, db: Session = Depends(get_db)):
    db_word = db.query(models.Word).filter(models.Word.id == word_id).first()
    if db_word is None:
        raise HTTPException(status_code=404, detail="Word not found")
    return db_word

@app.put("/words/{word_id}", response_model=schemas.Word)
def update_word(word_id: int, word: schemas.WordCreate, db: Session = Depends(get_db)):
    db_word = db.query(models.Word).filter(models.Word.id == word_id).first()
    if db_word is None:
        raise HTTPException(status_code=404, detail="Word not found")
    for key, value in word.dict().items():
        setattr(db_word, key, value)
    db.commit()
    db.refresh(db_word)
    return db_word

@app.delete("/words/{word_id}", response_model=dict)
def delete_word(word_id: int, db: Session = Depends(get_db)):
    db_word = db.query(models.Word).filter(models.Word.id == word_id).first()
    if db_word is None:
        raise HTTPException(status_code=404, detail="Word not found")
    db.delete(db_word)
    db.commit()
    return {"message": "Word deleted successfully"}

@app.get("/search/", response_model=List[schemas.Word])
def search_words(query: str, db: Session = Depends(get_db)):
    words = db.query(models.Word).filter(models.Word.word.like(f"%{query}%")).all()
    return words