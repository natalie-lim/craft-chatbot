"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Space_Grotesk } from "next/font/google";
import { signInWithPopup } from "firebase/auth";
import {setDoc, doc, getDoc} from "firebase/firestore";
import { auth, provider, db, firebaseConfig} from "../../firebaseConfig";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600'],
});

function TypingText({ text, delay = 100 }) {
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

  return <span className={`${spaceGrotesk.className} text-5xl font-semibold pt-4`}>{displayedText}</span>;
}


async function checkIfUserExists({docName}) {
  const docRef = doc(db, "userInfo", docName);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log(" Document exists:", docSnap.data());
    return true;
  } else {
    console.log(" Document does NOT exist");
    return false;
  }
}

async function createDoc({user}) {
  if (!user ) {
    console.error("user not logged in yet");
    return;
  }
  let uid = user.uid;

  let exists = await checkIfUserExists({docName: uid});
  if (!exists) {
    const docRef = await setDoc(doc(db, "userInfo", uid),
      {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        tasks: {
          0: {headerDescription: 'to-do', taskDescriptions: ['ex) clean room'], color: "#FFADAD"},
          1: {headerDescription: 'in-progress', taskDescriptions: ['ex) math hw'], color: "#FFED9E"},
          2: {headerDescription: 'done', taskDescriptions: [], color: "#81DFA7"},
        },
      }
    );
  }
};

export default function Home() {
  const router = useRouter();
  const [fadeOut, setFadeOut] = useState(false);

  const handleClick = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setFadeOut(true);
      console.log("Firebase config:", firebaseConfig);

  
      // Wait for fade-out animation
      setTimeout(async () => {
        const userLet = result.user;
        await createDoc({ user: userLet }); 
        router.push("/taskpage");
      }, 1200);
    } catch (error) {
      console.error("Error during sign-in:", error.message);
    }
  };  
  
  return (
    <div className={`transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`flex flex-col items-center min-h-screen justify-center`}>
        <div className="flex flex-row">
        <TypingText delay = {150} text ="Task Manager." ></TypingText>
        </div>
        <h2 className={`${spaceGrotesk.className} text-lg pt-4`}>let&apos;s get your life together</h2>
        <button 
          onClick={handleClick}
          className="flex justify-center items-center h-10 w-58 mt-12 bg-[#357266] rounded-lg
          transition-opacity duration-200 hover:opacity-80 active:opacity-50"
        >
          <h2 className={`${spaceGrotesk.className} text-2xl text-white`}>start</h2>
        </button>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <img src="../assets/logo.svg" alt="ai help" width={110} />
      </div>

    </div>
  );
}
