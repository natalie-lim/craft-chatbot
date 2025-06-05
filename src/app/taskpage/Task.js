// Task.js
import { useEffect, useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, user } from "../../../firebaseConfig";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function Task({ description, column, index }) {
  const [taskName, setTaskName] = useState(description);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setTaskName(description);
  }, [description]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setTaskName(value);

    // Debounce the Firestore update to avoid too many writes
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

      // Update using dot notation for the specific field
      await updateDoc(docRef, {
        [`tasks.${column}.taskDescriptions`]: taskDescriptions,
      });

      console.log(`Task updated: column ${column}, index ${index}`);
    } catch (err) {
      console.error("Error updating task:", err);
    } finally {
      // Add a small delay to prevent rapid successive updates
      setTimeout(() => setIsUpdating(false), 300);
    }
  };

  return (
    <div className="w-full flex flex-row">
      <input
        className={`${spaceGrotesk.className} text-med bg-transparent outline-none w-full`}
        value={taskName}
        placeholder="insert task"
        onChange={handleChange}
        //disabled={isUpdating}
      />
    </div>
  );
}
