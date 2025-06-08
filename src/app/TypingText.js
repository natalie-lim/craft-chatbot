"use client";

import { useState, useEffect } from "react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600'],
});

export default function TypingText({ text, delay = 100 }) {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);
  
    useEffect(() => {
        if (index < text.length) {
            const intervalId = setInterval(() => {
                setDisplayedText(prevText => prevText + text[index]);
                setIndex(prevIndex => prevIndex + 1);
            }, delay);
  
            return () => clearInterval(intervalId);
        }
    }, [displayedText, index, text, delay]);
  
    return <span className={`${spaceGrotesk.className} text-6xl font-semibold pt-4`}>{displayedText}</span>;
  }