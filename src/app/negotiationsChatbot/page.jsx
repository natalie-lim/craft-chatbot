"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import TypingText from "../TypingText";
import { Scissors, Pin, Spool, User } from "lucide-react";
import NegotiationsBot from "../NegotationsBot";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function Negotiations({ textColor, bgColor }) {
  return (
    <div
      className={`${spaceGrotesk.className} bg-[#f0efeb] min-h-screen w-full`}
    >
      <NegotiationsBot textColor="text-[#95b8d1]" bgColor="bg-[#D3E6F5]" />
    </div>
  );
}
