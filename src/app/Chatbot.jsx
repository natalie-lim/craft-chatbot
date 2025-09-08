"use client";

import React from "react";
import { useState } from "react";
import { Space_Grotesk } from "next/font/google";
import TypingText from "./TypingText";
import { Search } from "lucide-react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function Chatbot({ category = "none", textColor }) {
  const handleAskChat = () => {
    
  }

  return (
    <div
      className={`${spaceGrotesk.className} bg-[#f0efeb] min-h-screen w-full flex flex-col items-center justify-center`}
    >
      <div className="rounded-4xl bg-white px-16 border-b-3 border-1 border-[#967342] flex flex-row space-x-8 items-center justify-center p-4">
        <TypingText 
          textColor={textColor} 
          textSize="text-4xl" 
          text={`${category} Chatbot`} 
        />
      </div>

     {/* Retro Internet Tab */}
      <div className="relative w-full max-w-[800px] mt-12 rounded-2xl border border-[#967342] bg-[#fcf7ef] shadow-[0_8px_0_0_#967342] overflow-hidden">

      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#e7d8c9] border-b border-[#967342]">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-[#e76f51]" />
          <span className="inline-block h-3 w-3 rounded-full bg-[#f4a261]" />
          <span className="inline-block h-3 w-3 rounded-full bg-[#2a9d8f]" />
        </div>
        <span className="text-sm font-semibold text-[#5a463e] tracking-wide">
          {category || "Chat"}
        </span>
        <div className="flex items-center gap-1">
          <button className="px-2 py-0.5 text-xs border border-[#967342] rounded bg-white hover:bg-[#fff6ea]">
            _
          </button>
          <button className="px-2 py-0.5 text-xs border border-[#967342] rounded bg-white hover:bg-[#fff6ea]">
            □
          </button>
          <button className="px-2 py-0.5 text-xs border border-[#967342] rounded bg-white hover:bg-[#fff6ea]">
            ×
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-end gap-2 px-3 pt-3 bg-[#f2e9e4] border-b border-[#967342]">
        <div className="px-3 py-1 rounded-t-md border border-b-0 border-[#967342] bg-white text-sm font-medium shadow-[0_4px_0_0_#967342]">
          {category || "Chat"}
        </div>
        <div className="px-3 py-1 rounded-t-md border border-b-0 border-[#967342] bg-[#f6efe8] text-sm text-[#7a6a60]">
          About
        </div>
        <div className="px-3 py-1 rounded-t-md border border-b-0 border-[#967342] bg-[#f6efe8] text-sm text-[#7a6a60]">
          Settings
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#fff7ed] border-b border-[#967342]">
        <button className="px-2 py-1 border border-[#967342] rounded bg-white hover:bg-[#fff2de] text-xs">
          ◀︎
        </button>
        <button className="px-2 py-1 border border-[#967342] rounded bg-white hover:bg-[#fff2de] text-xs">
          ▶︎
        </button>
        <button className="px-2 py-1 border border-[#967342] rounded bg-white hover:bg-[#fff2de] text-xs">
          ⟳
        </button>
        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-[#7a6a60]">Address</span>
          <input
            className="flex-1 text-sm px-3 py-1 border border-[#967342] rounded bg-white placeholder:text-[#b6a79f] focus:outline-none"
            placeholder="craft://chatbot/{category}"
            readOnly
          />
        </div>
      </div>

      {/* Content area with subtle scanlines */}
      <div
        className="px-4 pt-4 pb-20 h-[360px] overflow-y-auto"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 23px, rgba(150,115,66,0.08) 24px)",
        }}
      >
        <div className="mx-auto max-w-[640px] space-y-3">
          <div className="p-3 border border-[#967342] rounded bg-white shadow-[0_4px_0_0_#967342]">
            <p className="text-sm text-[#5a463e]">
              Welcome to <span className="font-semibold">CraftBot</span>! Pick a
              category and ask me anything about {category || "your craft"} ✂️🧶
            </p>
          </div>

          {/* Example message bubbles */}
          <div className="flex justify-start">
            <div className="max-w-[75%] p-3 border border-[#967342] rounded-lg bg-[#fff7ed] text-sm">
              Hi! Share your project details (yarn, gauge, fabric, pattern), and I’ll help.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom input (dock) */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#f8efe4] border-t border-[#967342] p-3">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto flex w-[95%] max-w-[720px] items-center gap-2"
        >
          <input
            className="flex-1 text-sm px-3 py-2 border border-[#967342] rounded bg-white placeholder:text-[#b6a79f] focus:outline-none"
            placeholder={`Type your ${category || "craft"} question…`}
          />
          <button
            className="px-4 py-2 text-sm font-semibold border border-[#967342] rounded bg-[#f6efe8] hover:bg-white active:translate-y-[1px] shadow-[0_4px_0_0_#967342]"
            type="submit"
            onClick={() => handleAskChat()}
          >
            Send
          </button>
        </form>
      </div>
      </div>

    </div>
  );
}
