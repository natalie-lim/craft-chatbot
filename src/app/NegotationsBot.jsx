"use client";

import React, { useState } from "react";
import { Space_Grotesk } from "next/font/google";
import TypingText from "./TypingText";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function NegotiationsBot({textColor, bgColor }) {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: `Welcome to your negotiation bot!`,
    },
  ]);

  // accept the current question so we can call it with a snapshot
  const fetchSuggestion = async (q) => {
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `negotiate with me`,
        }),
      });
      const data = await res.json();
      return data.result ?? "No suggestion returned.";
    } catch (err) {
      console.error("Failed to fetch AI suggestion:", err);
      return "Error retrieving suggestion.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || isLoading) return;

    // show the user message immediately
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setQuestion("");
    setIsLoading(true);

    // fetch suggestion and add bot reply
    const suggestion = await fetchSuggestion(q);
    setMessages((prev) => [...prev, { role: "bot", text: suggestion }]);
    setIsLoading(false);
  };

  return (
    <div
      className={`${spaceGrotesk.className} bg-[#f0efeb] min-h-screen w-full flex flex-col items-center justify-center`}
    >
    <button
      onClick={() => router.push("/choosePage")}
      className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 
                 rounded-lg border border-[#967342] bg-[#f0efeb]/70 
                 text-[#967342] font-semibold shadow-[0_3px_0_0_#967342] 
                 hover:bg-[#f0efeb]/90 hover:translate-y-[1px] transition"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>

      <div className="rounded-4xl bg-white px-16 border-b-3 border-1 border-[#967342] flex flex-row space-x-8 items-center justify-center p-4">
        <TypingText
          textColor={textColor}
          textSize="text-4xl"
          text={`Negotiations Chatbot`}
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
            Negotiations Chat
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
            Negotiations
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#fff7ed] border-b border-[#967342]">
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs text-[#7a6a60]">Address</span>
            <input
              className="flex-1 text-sm px-3 py-1 border border-[#967342] rounded bg-white placeholder:text-[#b6a79f] focus:outline-none"
              placeholder={`craft://chatbot/negotiations`}
              readOnly
            />
          </div>
        </div>

        <div
          className="px-4 pt-4 pb-20 h-[360px] overflow-y-auto"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0, transparent 23px, rgba(150,115,66,0.08) 24px)",
          }}
        >
          <div className="mx-auto max-w-[640px] space-y-3">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div
                    className={`max-w-[75%] p-3 border border-[#967342] rounded-lg ${bgColor} bg-opacity-30 text-sm shadow-[0_4px_0_0_#967342]`}
                  >
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <div className="max-w-[75%] p-3 border border-[#967342] rounded-lg bg-white text-sm shadow-[0_4px_0_0_#967342]">
                    {m.text}
                  </div>
                </div>
              )
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[75%] p-3 border border-[#967342] rounded-lg bg-white text-sm shadow-[0_4px_0_0_#967342]">
                  <span className="animate-pulse">CraftBot is typing…</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom input (dock) */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#f8efe4] border-t border-[#967342] p-3">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex w-[95%] max-w-[720px] items-center gap-2"
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 text-sm px-3 py-2 border border-[#967342] rounded bg-white placeholder:text-[#b6a79f] focus:outline-none"
              placeholder={`Type your offer`}
              aria-label="Your question"
            />
            <button
              className="px-4 py-2 text-sm font-semibold border border-[#967342] rounded bg-[#f6efe8] hover:bg-white active:translate-y-[1px] shadow-[0_4px_0_0_#967342] disabled:opacity-60"
              type="submit"
              disabled={!question.trim() || isLoading}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
