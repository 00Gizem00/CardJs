import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import PropTypes from 'prop-types';

const Flashcard = ({ word, meaning, usage, onSwipe, isActive, isNext }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-50, 50]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const scale = useTransform(x, [-200, -150, 0, 150, 200], [0.8, 1, 1, 1, 0.8]);
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isActive && !isNext) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [isActive, isNext]);

  // Math.abs mutlak değer döndürür. Negatif değer pozitif olur. x ve ye - yada + alsa da yönünden bağımsız kontrol sağlar. Kullanıcı hareketi 5px den az ise kartı sıfırlar.
  const handleDrag = (event, info) => {
    if (Math.abs(info.offset.x) < 5 && Math.abs(info.offset.y) < 5) {
      controls.start({ x: 0, y: 0, rotate: 0 });
    }
  };

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      controls.start({
        x: direction === 'right' ? 500 : -500,
        rotate: direction === 'right' ? 50 : -50,
        scale: 0.8,
        opacity: 0,
        transition: { duration: 0.2 },
      }).then(() => {
        setIsVisible(false);
        onSwipe(direction);
      });
    } else {
      controls.start({ x: 0, y: 0, rotate: 0, scale: 1 });
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        x: isActive ? x : 0,
        rotate: isActive ? rotate : 0,
        scale: isActive ? scale : isNext ? 0.95 : 0.9,
        opacity: isActive ? opacity : isNext ? 1 : 0,
        zIndex: isActive ? 2 : 1,
        y: isNext ? -10 : 0,
      }}
      drag={isActive ? 'x' : false}
      dragConstraints={{ left: -50, right: 50, top: -25, bottom: 25 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="absolute top-0 left-0 right-0 w-64 h-96 bg-white rounded-lg shadow-lg p-6 cursor-grab active:cursor-grabbing select-none"
      onContextMenu={(e) => e.preventDefault()}
      dragElastic={0.2}
    >
      <h2 className="text-2xl font-bold mb-4">{word}</h2>
      <p className="text-lg mb-2">{meaning}</p>
      <p className="text-sm italic">{usage}</p>
    </motion.div>
  );
};

Flashcard.propTypes = {
  word: PropTypes.string.isRequired,
  meaning: PropTypes.string.isRequired,
  usage: PropTypes.string.isRequired,
  onSwipe: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  isNext: PropTypes.bool.isRequired,
};

export default Flashcard;