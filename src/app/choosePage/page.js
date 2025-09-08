"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import TypingText from "../TypingText";
import { Scissors, Pin, Spool, User } from "lucide-react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function ChoosePage() {
  const router = useRouter();
  const go = (path) => () => router.push(path); // helper

  return (
    <div
      className={`${spaceGrotesk.className} bg-[#f0efeb] min-h-screen w-full`}
    >
      <div className="flex flex-col items-center justify-center pt-48 px-6">
        <TypingText textColor="text-[#d5bdaf]" text="choose your chatbot" />
        <div className="flex flex-row flex-wrap gap-8 mt-24 p-4">
          {/* Sewing */}
          <button
            onClick={go("/sewingChatbot")} // <- function, absolute path
            className="flex flex-col items-center justify-center rounded-xl h-48 w-48 bg-[#d4afb9] opacity-90 hover:opacity-100 transition"
          >
            <Scissors className="h-16 w-16 text-white mb-3" />
            <span className="text-white font-semibold text-lg">Sewing</span>
          </button>

          {/* Knitting */}
          <button
            onClick={go("/knittingChatbot")}
            className="flex flex-col items-center justify-center rounded-xl h-48 w-48 bg-[#cfbaf0] opacity-90 hover:opacity-100 transition"
          >
            <Pin className="h-16 w-16 text-white mb-3" />
            <span className="text-white font-semibold text-lg">Knitting</span>
          </button>

          {/* Crocheting */}
          <button
            onClick={go("/crochetingChatbot")}
            className="flex flex-col items-center justify-center rounded-xl h-48 w-48 bg-[#9cadce] opacity-90 hover:opacity-100 transition"
          >
            <Spool className="h-16 w-16 text-white mb-3" />
            <span className="text-white font-semibold text-lg">Crocheting</span>
          </button>

          {/* Negotiations */}
          <button
            onClick={go("/negotiationsChatbot")}
            className="flex flex-col items-center justify-center rounded-xl h-48 w-48 bg-[#95b8d1] opacity-90 hover:opacity-100 transition"
          >
            <User className="h-16 w-16 text-white mb-3" />
            <span className="text-white font-semibold text-lg">
              Negotiations
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
