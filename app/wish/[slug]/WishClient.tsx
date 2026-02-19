"use client";

import { Memory, Wish } from "@/app/generated/prisma/client";
import BirthdayCardSection from "@/components/BirthdayCardSection";
import EnvelopeSection from "@/components/Envsec";
import FinalGreetingSection from "@/components/FinalGreetingSection";
import Loader from "@/components/Loader";
import MemoryWallSection from "@/components/MemoryWallSection";
import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

type TWish = Wish & {
  // Additional properties that are not in the original Wish type
  memories: Memory[];
};

export default function WishClient({ wish }: { wish: TWish }) {
  const { progress } = useProgress();
  const [isReady, setIsReady] = useState(false);
  const [loadStarted, setLoadStarted] = useState(false);

  useEffect(() => {
    if (!loadStarted && progress > 0) {
      setLoadStarted(true);
    }

    if (progress === 100) {
      setTimeout(() => setIsReady(true), 500);
    }
  }, [progress, loadStarted]);

  useEffect(() => {
    if (!loadStarted) return;

    const fallbackTimer = setTimeout(() => {
      setIsReady(true);
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, [loadStarted]);

  if (!isReady) return <Loader />;

  return (
    <main className="relative">
      <section id="welcome">
        <EnvelopeSection
          name={wish.recipientName}
          senderName={wish.senderName}
          message={wish.message}
        />
      </section>

      <section id="card">
        <BirthdayCardSection message={wish.message} photoUrl={wish.envelopeImageUrl!} />
      </section>

      <section id="memories">
        {wish.memories.length > 0 && (
        <MemoryWallSection
          memories={wish.memories.map((m) => ({
            image: m.imageUrl,
            caption: m.caption || "",
          }))}
        />
        )}
      </section>

      <section id="final-greeting">
        <FinalGreetingSection
          message="Hope this made your day a little brighter! Wishing you the best year ever!"
          name={wish.senderName}
        />
      </section>
    </main>
  );
}
