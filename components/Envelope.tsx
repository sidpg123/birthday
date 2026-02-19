// pages/index.js (or app/page.js for App Router)
"use client"; // Add this if using App Router
import { useProgress } from '@react-three/drei';
import BirthdayCardSection from '@/components/BirthdayCardSection';
import FinalGreetingSection from '@/components/FinalGreetingSection';
import MemoryWallSection from '@/components/MemoryWallSection';
import { useEffect, useState } from 'react';
import EnvelopeSection from './Envsec';
import Loader from './Loader';

export default function Home() {
  const { progress } = useProgress();
  const [isReady, setIsReady] = useState(false);
  const [loadStarted, setLoadStarted] = useState(false);

  const [birthdayPerson] = useState({
    name: "Saniya",
    message: "Happy Birthday! 🌷 You bring so much light and joy to everyone around you. Wishing you a wonderful day and an even better year ahead! ✨",
    senderName: "Siddharth"
  });

  // Sample memories data
  const memories = [
    {
      image: '/images/memory1.png',
      caption: "No matter where life takes us, I’ll always choose to walk beside you",
    },
    {
      image: '/images/memory2.png',
      caption: 'Our favorite people, our loud laughter, and memories that taste like happiness',
    },
    {
      image: '/images/memory3.png',
      caption: 'In the quiet of the sunset, I realized you are my forever.',
    },
    {
      image: '/images/memory4.png',
      caption: "That smile I fell in love with — and still fall for every single day.",
    },
  ];

  useEffect(() => {
    // Mark that loading has started (this helps with the fallback timer)
    if (!loadStarted && progress > 0) {
      setLoadStarted(true);
    }

    // Consider content loaded when progress reaches 100%
    if (progress === 100) {
      setTimeout(() => setIsReady(true), 500);
    }
  }, [progress, loadStarted]);

  // Separate effect for the fallback timer
  useEffect(() => {
    // Only start fallback timer after load has actually begun
    if (!loadStarted) return;

    // Fallback: Force completion after 5 seconds if progress seems stuck
    const fallbackTimer = setTimeout(() => {
      console.log('Fallback timer triggered - progress was:', progress);
      setIsReady(true);
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, [loadStarted, progress]);

  // Show loader until content is ready
  if (!isReady) return <Loader />;

  return (
    <main className="relative">
      {/* Each section takes full viewport height */}
      <section id="welcome">
        <EnvelopeSection
          name={birthdayPerson.name}
          senderName={birthdayPerson.senderName}
          message={birthdayPerson.message}
        />
      </section>

      <section id="card">
        <BirthdayCardSection photoUrl='/images/envelopImage.png' message={birthdayPerson.message} />
      </section>

      <section id="memories">
        <MemoryWallSection memories={memories} />
      </section>

      <section id="final-greeting">
        <FinalGreetingSection
          message="Hope this made your day a little brighter! Wishing you the best year ever!"
          name={birthdayPerson.senderName}
        />
      </section>
    </main>
  );
}