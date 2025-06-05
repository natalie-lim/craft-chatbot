import { useEffect, useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, user } from "../../../firebaseConfig";
import { Space_Grotesk } from "next/font/google";
import Popup from "reactjs-popup";


const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
});

function getRandomPastelHex() {
  const hue = Math.floor(Math.random() * 360);
  
  const hslToRgb = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
    return [f(0), f(8), f(4)];
  };

  const rgbToHex = ([r, g, b]) =>
    `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;

  return rgbToHex(hslToRgb(hue, 70, 85));
}


export default function Task({ description, column, index }) {
  const [taskName, setTaskName] = useState(description);
  const [isUpdating, setIsUpdating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
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
  

  useEffect(() => {
    setTaskName(description);
  }, [description]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setTaskName(value);

    if (isUpdating) return;
    setIsUpdating(true);

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
    } finally {
      setTimeout(() => setIsUpdating(false), 300);
    }
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
      <div>
        <div
          className={`${spaceGrotesk.className} text-sm min-h-56 rounded shadow p-4 text-black`}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: getRandomPastelHex(),
            zIndex: 50,
          }}
        >
          <p>AI suggestion for: <strong>{taskName}</strong></p>
          <div className="w-full min-h-48 mt-4 bg-white p-2 rounded overflow-auto">
            {aiSuggestion}
          </div>
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
