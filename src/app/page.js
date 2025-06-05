"use client";

import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import { useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { signInWithPopup } from "firebase/auth";
import {setDoc, doc, getDoc} from "firebase/firestore";
import { auth, provider, db} from "../../firebaseConfig";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600'],
});

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

  const handleClick = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setFadeOut(true); // trigger fade-out
        setTimeout(async () => {
          let userLet = result.user;
          await createDoc({ user: userLet }); 
          router.push("/taskpage"); // navigate after 3s
        }, 1200);
      })
      .catch((error) => {
        console.error("Error during sign-in:", error.message);
      });
  };
  
  return (
    <div className={`flex flex-col items-center min-h-screen justify-center transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <h1 className={`${spaceGrotesk.className} text-6xl`}>task manager.</h1>
      <h2 className={`${spaceGrotesk.className} text-lg pt-4`}>let's get your life together</h2>
      <button 
        onClick={handleClick}
        className="flex justify-center items-center h-10 w-58 mt-12 bg-[#357266] rounded-lg
        transition-opacity duration-200 hover:opacity-80 active:opacity-50"
      >
        <h2 className={`${spaceGrotesk.className} text-2xl text-white`}>start</h2>
      </button>
    </div>
  );
}
