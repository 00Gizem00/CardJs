import React, { useState, useEffect } from 'react';
import Flashcard from './FlashCard';

const FlashcardDeck = () => {
  const [cards, setCards] = useState([
    { id: 1, word: 'Hello', meaning: 'A greeting', usage: 'Hello, how are you?' },
    { id: 2, word: 'World', meaning: 'The earth', usage: 'The world is round.' },
    { id: 3, word: 'React', meaning: 'A JavaScript library', usage: 'We use React to build user interfaces.' },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRestarting, setIsRestarting] = useState(false);

  useEffect(() => {
    if (cards.length === 0) {
      setIsRestarting(true);
      // Kartları yeniden yükle
      setCards([
        { id: 1, word: 'Hello', meaning: 'A greeting', usage: 'Hello, how are you?' },
        { id: 2, word: 'World', meaning: 'The earth', usage: 'The world is round.' },
        { id: 3, word: 'React', meaning: 'A JavaScript library', usage: 'We use React to build user interfaces.' },
      ]);
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