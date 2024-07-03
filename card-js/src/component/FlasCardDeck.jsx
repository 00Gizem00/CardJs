import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Flashcard from './FlashCard';

const API_URL = 'http://127.0.0.1:8001';

const FlashcardDeck = () => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRestarting, setIsRestarting] = useState(false);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await axios.get(`${API_URL}/words/`);
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  useEffect(() => {
    if (cards.length === 0) {
      setIsRestarting(true);
      fetchWords();
      setCurrentIndex(0);
      setIsRestarting(false);
    }
  }, [cards]);

  const handleSwipe = (direction) => {
    if (isRestarting) return;

    if (direction) {
      // Kartı çıkar
      setCards(prevCards => prevCards.filter((_, index) => index !== currentIndex));
    }

    // Eğer son karta geldiyse, indexi sıfırla
    if (currentIndex === cards.length - 1) {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="relative w-64 h-96">
      {cards.map((card, index) => (
        <Flashcard
          key={card.id}
          word={card.word}
          meaning={card.meaning}
          usage={card.usage}
          onSwipe={handleSwipe}
          isActive={index === currentIndex}
          isNext={index === (currentIndex + 1) % cards.length}
        />
      ))}
    </div>
  );
};

export default FlashcardDeck;