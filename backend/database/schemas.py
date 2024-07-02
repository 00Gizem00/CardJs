from pydantic import BaseModel, ConfigDict

class WordBase(BaseModel):
    word: str
    meaning: str
    usage: str

class WordCreate(WordBase):
    pass

class Word(WordBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)