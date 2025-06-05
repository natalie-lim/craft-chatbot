"use client";

import { useEffect, useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, getCurrentUser } from "../../../firebaseConfig";
import { Space_Grotesk } from "next/font/google";
import Popup from "reactjs-popup";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
});


export default function Task({ description, column, index }) {
  const [taskName, setTaskName] = useState(description);
  const [isUpdating, setIsUpdating] = useState(false);
  const [user, setUser] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState("");


  useEffect(() => {
    setTaskName(description);
  }, [description]);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const fetchSuggestion = async () => {
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `Give suggestions for: ${taskName}` }),
      });
      const data = await res.json();
      return data.result;
    } catch (err) {
      console.error("Failed to fetch AI suggestion:", err);
      return "Error retrieving suggestion.";
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setTaskName(value);
  
    if (!user) return;
  
    // Debounce the update
    if (isUpdating) clearTimeout(isUpdating);
  
    const timeout = setTimeout(async () => {
      try {
        const docRef = doc(db, "userInfo", user.uid);
        const docSnap = await getDoc(docRef);
  
        if (!docSnap.exists()) {
          console.error("Document not found");
          return;
        }
  
        const data = docSnap.data();
        const tasks = data.tasks || {};
        const columnData = tasks[column];
  
        if (!columnData) {
          console.error("Column not found in document");
          return;
        }
  
        const taskDescriptions = [...(columnData.taskDescriptions || [])];
        taskDescriptions[index] = value;
  
        await updateDoc(docRef, {
          [`tasks.${column}.taskDescriptions`]: taskDescriptions,
        });
  
        console.log(`Task updated: column ${column}, index ${index}`);
      } catch (err) {
        console.error("Error updating task:", err);
      }
    }, 1000); // delay in ms
  
    setIsUpdating(timeout);
  };
  
  return (
    <div className="w-full flex flex-row justify-between items-center">
      <Popup
        trigger={
          <button className="pr-2">
            <img src="../assets/Key.svg" alt="ai help" width={20} height={20} />
          </button>
        }
        position="bottom center"
        closeOnDocumentClick
        onOpen={async () => {
          setAiSuggestion("Loading...");
          const result = await fetchSuggestion();
          setAiSuggestion(result);
        }}
      >
        <div
          className={`${spaceGrotesk.className} text-sm min-h-56 rounded shadow p-4 text-black bg-gray-200`}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 50,
            maxWidth: "80vw",
            width: "400px",
          }}
        >
          <p>
            AI suggestion for: <strong>{taskName}</strong>
          </p>
          <div className="w-full min-h-48 mt-4 bg-white p-2 rounded overflow-auto">
            {aiSuggestion}
          </div>
        </div>
      </Popup>

      <input
        className={`${spaceGrotesk.className} text-sm w-full bg-transparent outline-none flex-grow`}
        value={taskName}
        placeholder="insert task"
        onChange={handleChange}
      />
    </div>
  );
}
