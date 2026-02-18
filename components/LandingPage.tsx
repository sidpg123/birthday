"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// import React from "react";

export default function LandingPage() {
    const [dots, setDots] = useState<Array<{ left: number, top: number, color: string, delay: number, duration: number }>>([]);

    useEffect(() => {
        const generated = [...Array(40)].map(() => ({
            left: Math.random() * 100,
            top: Math.random() * 100, color: [
                '#fbb6ce', // pink
                '#f9a8d4', // soft rose
                '#fbcfe8', // light pink
                '#d6bcfa', // lavender
                '#e9d5ff', // light purple
                '#c4b5fd', // soft violet
                '#bfdbfe', // sky blue
                '#bae6fd', // light blue
                '#a5f3fc', // cyan soft
                '#fde68a', // soft yellow
                '#fef3c7', // warm pastel yellow
                '#bbf7d0', // mint green
                '#dcfce7', // pale green
            ][Math.floor(Math.random() * 13)],

            delay: Math.random() * 3,
            duration: 3 + Math.random() * 2
        }));
        setDots(generated);
    }, []);

    return (
        <div>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-200 via-purple-200 to-blue-100 relative overflow-hidden">

                {/* Floating decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Bokeh circles */}
                    <div className="absolute top-20 left-10 w-32 h-32 bg-pink-300/30 rounded-full blur-2xl"></div>
                    <div className="absolute top-40 right-20 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-32 left-1/4 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-pink-200/30 rounded-full blur-2xl"></div>

                    {/* Floating confetti dots */}
                    <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-float"></div>
                    <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-pink-400 rounded-full animate-float-delay-1"></div>
                    <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-blue-300 rounded-full animate-float-delay-2"></div>
                    <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-float"></div>

                    {/* More scattered dots */}
                    {dots.map((dot, i) => (
                        <div
                            key={i}
                            className="absolute w-24 h-24 blur-xs rounded-full animate-float"
                            style={{
                                left: `${dot.left}%`,
                                top: `${dot.top}%`,
                                backgroundColor: dot.color,
                                animationDelay: `${dot.delay}s`,
                                animationDuration: `${dot.duration}s`
                            }}
                        />
                    ))}

                </div>

                {/* Navbar */}
                <nav className="w-full flex justify-between items-center px-6 md:px-16 py-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full ">
                            <Image src="/images/bday_logo.png" alt="WishYou Logo" width={48} height={48} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-2xl font-bold text-[#57326a]">WishYou</span>
                    </div>

                    <div className="hidden md:flex gap-8 text-gray-700 font-medium">
                        <button className="hover:text-purple-600 transition">Sign in</button>
                        <button className="hover:text-purple-600 transition">About</button>
                        <button className="hover:text-purple-600 transition">Contact</button>
                        <button className="hover:text-purple-600 transition">FAQ</button>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="flex-1 grid grid-cols-1 md:grid-cols-2 items-center px-6 md:px-16 pb-12 gap-10 relative z-10">

                    {/* Left Content */}
                    <div className="flex flex-col gap-6 text-left">
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight text-[#57326a]">
                            Create Magical Birthday Websites <span className="text-purple-400">in Minutes</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#564562] max-w-xl">
                            Surprise your loved ones with a beautiful, personalized birthday website.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href={'/saniya'} className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                                <span className="text-xl">👍</span>
                                Preview Demo
                            </Link>

                            <Link href={'/create'} className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                                <span className="text-xl">❤️</span>
                                Create Wishes
                            </Link>
                        </div>
                    </div>

                    {/* Right Illustration */}
                    {/* <div className="flex justify-center md:justify-end relative">
                    <div className="w-full max-w-xl aspect-square relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-96 h-96">
                                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl shadow-2xl flex items-center justify-center">
                                    <Image src="/images/bdaypic.png" alt="Gift Box" width={300} height={300} className="w-full h-full object-contain" />
                                </div>
                                <div className="absolute -top-4 -right-4 text-4xl animate-bounce">✨</div>
                                <div className="absolute -bottom-4 -left-4 text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</div>
                            </div>
                        </div>
                    </div>
                </div> */}

                    <div className="flex justify-center md:justify-end relative">
                        <div className="w-full max-w-xl relative flex items-center justify-center">

                            <Image
                                src="/images/bdaypic.png"
                                alt="Gift Box"
                                width={600}
                                height={600}
                                className="w-full h-full  object-contain"
                                priority
                            />

                            {/* Sparkles */}
                            <div className="absolute top-4 right-4 text-4xl animate-bounce">✨</div>
                            <div
                                className="absolute bottom-4 left-4 text-3xl animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                            >
                                ⭐
                            </div>

                        </div>
                    </div>



                </section>

                {/* How It Works Section */}


                <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delay-1 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float-delay-2 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 2s;
        }
        `}</style>
                <section className="w-full  py-20 px-6 md:px-16 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
                        How It Works
                    </h2>

                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

                        {/* Step 1 */}
                        <div className="relative bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-lg text-center flex flex-col items-center">
                            <div className="absolute -top-5 w-10 h-10 flex items-center justify-center rounded-full bg-purple-500 text-white font-bold shadow">
                                1
                            </div>

                            <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl flex items-center justify-center shadow mb-5">
                                <span className="text-4xl">✍️</span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Write your message
                            </h3>

                            <p className="text-gray-600">
                                Add heartfelt wishes and personalize your birthday message.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-lg text-center flex flex-col items-center">
                            <div className="absolute -top-5 w-10 h-10 flex items-center justify-center rounded-full bg-purple-500 text-white font-bold shadow">
                                2
                            </div>

                            <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl flex items-center justify-center shadow mb-5">
                                <span className="text-4xl">📷</span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Add memories
                            </h3>

                            <p className="text-gray-600">
                                Upload photos and moments to make the experience emotional.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-lg text-center flex flex-col items-center">
                            <div className="absolute -top-5 w-10 h-10 flex items-center justify-center rounded-full bg-purple-500 text-white font-bold shadow">
                                3
                            </div>

                            <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-blue-200 rounded-2xl flex items-center justify-center shadow mb-5">
                                <span className="text-4xl">📱</span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Share the surprise
                            </h3>

                            <p className="text-gray-600">
                                Send the magical birthday link and make their day unforgettable.
                            </p>
                        </div>

                    </div>

                    {/* CTA */}
                    <div className="flex justify-center mt-16">
                        <button className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-2xl shadow-lg hover:scale-105 transition">
                            Create Your Birthday Wish Now 🎉
                        </button>
                    </div>
                </section>
            </div>


        </div>
    );
}