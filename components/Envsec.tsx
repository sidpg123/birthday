'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

type EnvelopeSectionProps = {
  name?: string;
  message?: string;
  senderName?: string;
};

export default function EnvelopeSection({
  name = 'Friend',
  senderName = 'Siddharth',
  message = "You're amazing! Hope your day is as special as you are!",
}: EnvelopeSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const { width, height } = useWindowSize();

  const handleOpen = () => {
    if (isOpen) return; // prevent multiple taps

    // Delay the "open" to match message reveal
    setTimeout(() => {
      setIsOpen(true);
      setShowMessage(true);

      const audio = new Audio('/sounds/open.mp3');
      audio.play().catch((e) => console.log('Audio not played:', e));
    }, 400); // 400ms delay to sync
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-blue-900 to-black overflow-hidden">
      {isOpen && <Confetti width={width} height={height} />}

      {/* Envelope */}
      <div onClick={handleOpen} className="cursor-pointer relative z-1">
        <Image
          src={isOpen ? '/images/envelope-opened.png' : '/images/envelope-closed.png'}
          alt="Envelope"
          width={500}
          height={300}
        />
      </div>

      {/* Message */}
      {showMessage && (
        <motion.div
          initial={{ y: 100, scale: 0.9, opacity: 0 }}
          animate={{ y: -150, scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 12, delay: 0.1 }}
          className="absolute z-10 p-8 rounded-3xl shadow-lg w-[85%] max-w-md border bg-gradient-to-br from-[#fff1f8] to-[#ffeaff] backdrop-blur-md"
          style={{
            fontFamily: "'Dancing Script', cursive",
            backgroundImage: 'url(/images/paper-texture.jpeg)',
            // boxShadow: '0 12px 30px rgba(255, 105, 180, 0.2)',
            borderColor: '#ffb6c1',
          }}
        >
          <h2 className="text-3xl text-center text-pink-600 font-bold mb-4">
            Happy Birthday {name}!
          </h2>
          <p className="text-xl text-center text-gray-700 leading-relaxed tracking-wide">
            {message}
          </p>
          <br/>
          <br/>
          <p className="text-x text-center text-gray-700 leading-relaxed tracking-wide">
            from <br/>
            - {senderName}
          </p>
        </motion.div>
      )}


      {/* Hint text */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-20 text-center text-lg text-purple-600"
        >
          Tap the envelope to open your birthday wish 🎉
        </motion.div>
      )}
    </div>
  );
}
