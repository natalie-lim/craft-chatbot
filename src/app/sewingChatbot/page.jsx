"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import TypingText from "../TypingText";
import { Scissors, Pin, Spool, User } from "lucide-react";
import Chatbot from "../Chatbot";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "600"] });

export default function SewingChatbot() {
  const router = useRouter();
  const go = (path) => () => router.push(path);

  return (
    <div className={`${spaceGrotesk.className} bg-[#f0efeb] min-h-screen w-full`}>
        <Chatbot category="Sewing" textColor="text-[#d4afb9]"/> 
    </div>
  );
}
