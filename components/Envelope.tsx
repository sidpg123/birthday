// pages/index.js (or app/page.js for App Router)
"use client"; // Add this if using App Router

import BirthdayCardSection from '@/components/BirthdayCardSection';
import FinalGreetingSection from '@/components/FinalGreetingSection';
import MemoryWallSection from '@/components/MemoryWallSection';
import { useState } from 'react';
import EnvelopeSection from './Envsec';

export default function Home() {
  const [ loading ] = useState(false);
  const [birthdayPerson ] = useState({
    name: "Friend",  // Replace with the name from your database or URL params
    message: "I'm so grateful for your friendship. You make every day brighter just by being you. Here's to another amazing year!",
    senderName: "Siddharth"  // Replace with the sender's name
  });
  
  // Sample memories data - in production, load this from your database
  const memories = [
    {
      image: '/images/memory1.jpg',
      caption: "Remember that amazing dinner at Luigi's last year?",
    },
    {
      image: '/images/memory2.jpg',
      caption: 'That time we climbed Mount Rainier and you were terrified!',
    },
    {
      image: '/images/memory3.jpg',
      caption: 'Beach day! You built the best sandcastle ever.',
    },
    {
      image: '/images/memory4.jpg',
      caption: 'Your graduation day. So proud of you!',
    },
    {
      image: '/images/memory5.jpg',
      caption: 'That crazy road trip where we got lost for 3 hours!',
    },
  ];
  
  // Simulate loading effect
  // useEffect(() => {
  //   // In production, you'd fetch data here
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 2000);
  // }, []);
  
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-300 to-pink-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-700 mb-4"></div>
        <p className="text-lg text-purple-800">Preparing your birthday surprise...</p>
      </div>
    );
  }
  
  return (
    <main className="relative">
      {/* Each section takes full viewport height */}
      <section id="welcome">
        {/* <WelcomeSection name={birthdayPerson.name} /> */}
        <EnvelopeSection name={birthdayPerson.name} senderName={birthdayPerson.senderName} message={birthdayPerson.message} />
      </section>
      
      <section id="card">
        <BirthdayCardSection message={birthdayPerson.message} />
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
      
      {/* Create Your Own Button - Fixed at the bottom */}
      
    </main>
  );
}