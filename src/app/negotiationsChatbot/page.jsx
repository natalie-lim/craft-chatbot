"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import TypingText from "../TypingText";
import { Scissors, Pin, Spool, User } from "lucide-react";
import NegotiationsBot from "../NegotationsBot";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function Negotiations({
  textColor,
  bgColor,
}) {
  return (
    <div
      className={`${spaceGrotesk.className} bg-[#f0efeb] min-h-screen w-full`}
    >
      <NegotiationsBot textColor="text-[#cfbaf0]" bgColor="bg-[#E9DFF7]" />
    </div>
  );
}

