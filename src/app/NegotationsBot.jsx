"use client";

import React, { useMemo, useState } from "react";
import { Space_Grotesk } from "next/font/google";
import TypingText from "./TypingText";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function NegotiationsBot({ textColor, bgColor }) {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [latestUserOffer, setLatestUserOffer] = useState(null);
  const [latestAssistantOffer, setLatestAssistantOffer] = useState(null);
  const handleSave = () => {
    console.log("user: " + latestUserOffer);
    console.log("assistatn: " + latestAssistantOffer);
  };
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: `Welcome to your negotiation bot! We could trade patterns, yarns, even finished products! Offer me something, and I'll counter.`,
    },
  ]);
  const fetchSuggestion = async (q) => {
    try {
      const parseOffer = (text) => {
        const m = [...(text || "").matchAll(/\$?\s*(\d+(?:\.\d+)?)/g)];
        if (!m.length) return null;
        const n = parseFloat(m[m.length - 1][1]);
        return Number.isFinite(n) ? n : null;
      };

      // derive latest numeric offers from the transcript
      for (let i = messages.length - 1; i >= 0; i--) {
        const m = messages[i];
        const offer = parseOffer(m.text);
        if (offer != null) {
          if (m.role === "user" && latestUserOffer == null)
            setLatestUserOffer(offer);
          if (m.role === "bot" && latestAssistantOffer == null)
            setLatestAssistantOffer(offer);
        }
        if (latestUserOffer != null && latestAssistantOffer != null) break;
      }

      // build a compact conversation history
      const conversationHistory = messages
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
        .join("\n");

      // keep the negotiation short: count assistant barter turns so far
      const assistantTurns = messages.filter((m) => m.role === "bot").length;
      const exchangesRemaining = Math.max(0, 4 - assistantTurns);

      // --- prompt -------------------------------------------------------------
      const prompt = `
      SYSTEM:
      You are SellerBot, a friendly but firm seller on a crafts marketplace or a local yarn store.

      GOALS:
      - Negotiate efficiently and fairly.
      - Always respond with a concrete offer when making/countering/accepting an offer.

      CRAFT MATERIALS LIST:
      Fabric, thread, needles, sewing machine, fabric scissors, embroidery scissors, pinking shears, 
      pins, pin cushion, measuring tape, seam ripper, tailor’s chalk, iron, interfacing, zippers, 
      buttons, snaps, hooks, patterns, yarn, knitting needles (straight/circular/double-pointed), 
      crochet hooks, stitch markers, row counters, yarn/tapestry needle, small scissors/snips, 
      blocking mats, blocking pins, cable needle, project bag.

      GUARDRAILS:
      - Respond with an offer when the question IS related to knitting/crocheting/sewing products, or similar topic
      - If the user's question is NOT related to BARTERING knitting/crocheting/sewing products, or similar topics, reply exactly:
        "This chatbot is only for negotiating or bartering." Otherwise, respond.
        - If the user's question is NOT related to any of the craft materials listed above, or similar topics, reply exactly:
        "This chatbot is only for craft materials." Otherwise, respond.
      - Keep each reply to ≤ 3 sentences.
      - Complete the deal within 4 assistant replies total; if time is short, make your best final offer or accept.
      - If the offer is made and an agreement has been reached, say "Thank you for negotiating. Please click Finalize
      Offer!"

      STATE:
      - Latest buyer offer: ${latestUserOffer ?? "none"}
      - Latest seller offer: ${latestAssistantOffer ?? "none"}
      - Assistant replies remaining (this session): ${exchangesRemaining}

      TACTICS:
      - Start near your ask, then move in smaller concessions.
      - Prefer round numbers. Mention simple justifications (condition, accessories, demand).

      CONVERSATION SO FAR:
      ${conversationHistory}

      USER: ${q}
      ASSISTANT:
      `.trim();

      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
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
          <button
            onClick={() => {
              setIsChatOpen(true);
              setIsHistoryOpen(false);
            }}
            className={`px-3 py-1 rounded-t-md border border-b-0 border-[#967342] text-sm font-medium shadow-[0_4px_0_0_#967342] ${
              isChatOpen ? "bg-white text-black" : "bg-gray-100 text-gray-500"
            }`}
          >
            Negotiations
          </button>
          <button
            onClick={() => {
              setIsChatOpen(false);
              setIsHistoryOpen(true);
            }}
            className={`px-3 py-1 rounded-t-md border border-b-0 border-[#967342] text-sm font-medium shadow-[0_4px_0_0_#967342] ${
              isHistoryOpen
                ? "bg-white text-black"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            Negotiations History
          </button>
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

        {/* Main content area */}
        <div
          className={`px-4 pt-4 ${
            isChatOpen ? "pb-20" : "pb-4"
          } h-[360px] overflow-y-auto`}
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0, transparent 23px, rgba(150,115,66,0.08) 24px)",
          }}
        >
          <div className="mx-auto max-w-[640px] space-y-3">
            {isChatOpen ? (
              // CHAT VIEW
              <>
                {messages
                  // hide the welcome only when History tab is selected (defensive if you reuse)
                  .filter(
                    (m, i) =>
                      !(isHistoryOpen && i === 0 && /welcome/i.test(m.text))
                  )
                  .map((m, i) =>
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
              </>
            ) : (
              // HISTORY VIEW — fills the panel
              <div className="w-full">
                <div className="mb-2 text-xs text-[#7a6a60]">Saved Offers</div>
                <div className="rounded-lg border border-[#967342] bg-white shadow-[0_4px_0_0_#967342]">
                  <ul className="divide-y divide-[#967342]/30 text-sm">
                    <li className="px-3 py-2 flex items-center justify-between">
                      <span className="font-medium">You offered</span>
                      <span className="tabular-nums">$120</span>
                      <span className="text-xs text-[#7a6a60]">
                        Sep 8, 1:06 PM
                      </span>
                    </li>
                    <li className="px-3 py-2 flex items-center justify-between bg-[#fff7ed]">
                      <span className="font-medium">Seller countered</span>
                      <span className="tabular-nums">$190</span>
                      <span className="text-xs text-[#7a6a60]">
                        Sep 8, 1:07 PM
                      </span>
                    </li>
                    <li className="px-3 py-2 flex items-center justify-between">
                      <span className="font-medium">You offered</span>
                      <span className="tabular-nums">$150</span>
                      <span className="text-xs text-[#7a6a60]">
                        Sep 8, 1:10 PM
                      </span>
                    </li>
                    <li className="px-3 py-2 flex items-center justify-between bg-[#fff7ed]">
                      <span className="font-medium">Seller countered</span>
                      <span className="tabular-nums">$180</span>
                      <span className="text-xs text-[#7a6a60]">
                        Sep 8, 1:12 PM
                      </span>
                    </li>
                    <li className="px-3 py-2 flex items-center justify-between">
                      <span className="font-medium">You offered</span>
                      <span className="tabular-nums">$165</span>
                      <span className="text-xs text-[#7a6a60]">
                        Sep 8, 1:14 PM
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="mt-2 text-xs text-[#7a6a60]">
                  Tip: This is placeholder data. Replace with parsed offers from{" "}
                  <code>messages</code> when ready.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom input (dock) */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#f8efe4] border-t border-[#967342] p-3">
          {isChatOpen && (
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
              </button>{" "}
              <button
                className="px-4 py-2 text-sm font-semibold border border-[#967342] rounded bg-[#f6efe8] hover:bg-white active:translate-y-[1px] shadow-[0_4px_0_0_#967342] disabled:opacity-60"
                type="submit"
                onClick={handleSave}
              >
                Finalize Offer
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
