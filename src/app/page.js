"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { signInWithPopup } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, provider, db } from "../../firebaseConfig";
import { Scissors } from "lucide-react";
import TypingText from "./TypingText";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
});

// Write without pre-reading; this works even if temporarily offline
async function createDoc({ user }) {
  if (!user) return;
  const uid = user.uid;

  await setDoc(
    doc(db, "userInfo", uid),
    {
      uid,
      displayName: user.displayName || null,
      email: user.email || null,
      createdAt: serverTimestamp(),
      // seed defaults (merge prevents overwriting if doc already exists)
      tasks: {
        0: { headerDescription: "to-do",       taskDescriptions: ["ex) clean room"], color: "#FFADAD" },
        1: { headerDescription: "in-progress", taskDescriptions: ["ex) math hw"],    color: "#FFED9E" },
        2: { headerDescription: "done",        taskDescriptions: [],                  color: "#81DFA7" },
      },
    },
    { merge: true }
  );
}

export default function Home() {
  const router = useRouter();
  const [fadeOut, setFadeOut] = useState(false);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const handleClick = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);

      setFadeOut(true);

      // Fire-and-forget: don't block navigation on Firestore/network
      createDoc({ user }).catch((e) => {
        console.error("createDoc failed:", e);
      });

      // Let the fade animation play (match your CSS duration)
      await sleep(300);

      router.push("/choosePage");
    } catch (err) {
      const code = err?.code || "auth/unknown";
      const msg = err?.message || String(err);
      console.error("Sign-in error:", code, msg);
      alert(`Sign-in failed: ${code}\n${msg}`);
    }
  };

  return (
    <div
      className={`transition-opacity bg-[#f0efeb] duration-1000 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <div className="flex flex-col items-center min-h-screen justify-center">
        <div className="w-24 h-24 mb-12 bg-[#809bce] rounded-xl opacity-[80%] flex items-center justify-center">
          <Scissors className="text-white h-16 w-16" />
        </div>

        <div className="flex flex-row mb-8">
          <TypingText textColor="text-[#d5bdaf]" delay={150} text="Craft Chatbot" />
        </div>

        <h2 className={`${spaceGrotesk.className} text-[#809bce] font-semibold text-lg pt-4`}>
          Professional assistance for knitting, crocheting, sewing, and project negotiations
        </h2>

        <button
          onClick={handleClick}
          className="flex justify-center items-center h-10 w-58 mt-12 bg-[#664E4C] rounded-lg transition-opacity duration-200 hover:opacity-80 active:opacity-50"
        >
          <h2 className={`${spaceGrotesk.className} text-2xl text-white`}>start</h2>
        </button>
      </div>

      <div className={`${spaceGrotesk.className} text-[#809bce] font-semibold text-md bottom-4 left-1/2 transform absolute -translate-x-1/2`}>
        made w love by natalie lim ❤️
      </div>
    </div>
  );
}