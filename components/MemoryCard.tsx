import gsap from 'gsap';
import { useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
interface MemoryCardProps{
  imageUrl: string;
  caption: string;
  index: number;
}
export default function MemoryCard({ imageUrl, caption, index }: MemoryCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  console.log("MemeoryCard ", imageUrl)
  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 50,
        rotate: index % 2 === 0 ? -5 : 5,
      },
      {
        opacity: 1,
        y: 0,
        rotate: index % 2 === 0 ? 2 : -2,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top bottom-=100',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`w-64 md:w-80 mx-auto mb-12 ${index % 2 === 0 ? 'md:ml-12' : 'md:mr-12'}`}
    >
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="p-0">
          <div className="relative w-full">
            <img
              src={imageUrl}
              alt={caption || ""}
              width={320}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="p-4 bg-white">
            <p className="text-gray-800 text-sm md:text-base">{caption}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

