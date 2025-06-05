
// TypeTaskHeader.js
import React, { useState, useEffect } from "react";
import { Space_Grotesk } from "next/font/google";
import Popup from "reactjs-popup";
import { HexColorPicker } from "react-colorful";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, user } from "../../../firebaseConfig";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600'],
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

// Function to add a new task directly to Firestore
async function addTaskToFirestore(columnKey) {
  try {
    const docRef = doc(db, "userInfo", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error("Document not found");
      return;
    }

    const data = docSnap.data();
    const tasks = data.tasks || {};
    const columnData = tasks[columnKey];

    if (!columnData) {
      console.error("Column not found in document");
      return;
    }

    const taskDescriptions = [...(columnData.taskDescriptions || [])];
    taskDescriptions.push(""); // Add empty task

    await updateDoc(docRef, {
      [`tasks.${columnKey}.taskDescriptions`]: taskDescriptions,
    });

    console.log(`New task added to column: ${columnKey}`);
  } catch (err) {
    console.error("Error adding task:", err);
  }
}

// Function to update header title
async function updateHeaderTitle(columnKey, newTitle) {
  try {
    const docRef = doc(db, "userInfo", user.uid);
    await updateDoc(docRef, {
      [`tasks.${columnKey}.headerDescription`]: newTitle,
    });
    console.log(`Header updated for column: ${columnKey}`);
  } catch (err) {
    console.error("Error updating header:", err);
  }
}

export default function TypeTaskHeader({ col, title, colorInput, taskIndex, taskMap }) {
  const [color, setColor] = useState("");
  const [headerTitle, setHeaderTitle] = useState(title || "");
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);

  const columnKey = taskIndex[col];
  const docRef = doc(db, "userInfo", user.uid);

  useEffect(() => {
    if (colorInput !== undefined) {
      setColor(colorInput);
    } else {
      setColor(getRandomPastelHex());
    }
    setMounted(true);
  }, [colorInput]);

  useEffect(() => {
    setHeaderTitle(title || "");
  }, [title]);

  const handleTitleChange = async (e) => {
    const value = e.target.value;
    setHeaderTitle(value);

    // Debounce the update
    if (isUpdatingTitle) return;
    setIsUpdatingTitle(true);

    try {
      await updateHeaderTitle(columnKey, value);
    } catch (err) {
      console.error("Error updating title:", err);
    } finally {
      setTimeout(() => setIsUpdatingTitle(false), 300);
    }
  };

  const handleColorChange = async (newColor) => {
    setColor(newColor);
    try {
      await updateDoc(docRef, {
        [`tasks.${columnKey}.color`]: newColor,
      });
      console.log(`Color updated for column: ${columnKey}`);
    } catch (err) {
      console.error("Error updating color:", err);
    }
  };

  const handleAddTask = async () => {
    await addTaskToFirestore(columnKey);
  };

  return (
    <div className="w-full relative">
      <div
        className="flex h-10 p-2 items-center justify-between"
        style={{ backgroundColor: color }}
      >
        <input
          className={`${spaceGrotesk.className} text-xl bg-transparent outline-none w-full`}
          value={headerTitle}
          placeholder="Column Title"
          onChange={handleTitleChange}
          disabled={isUpdatingTitle}
        />
        <div className="flex items-center space-x-2 z-10">
          {mounted && (
            <Popup
              trigger={
                <button onClick={() => setShow(!show)}>
                  <img src="../assets/pencil.svg" alt="edit" width={18} height={18} />
                </button>
              }
              position="bottom center"
              onOpen={() => setShow(true)}
              onClose={() => setShow(false)}
            >
              <HexColorPicker
                color={color}
                onChange={handleColorChange}
              />
            </Popup>
          )}
          <button onClick={handleAddTask}>
            <img src="../assets/plus-square.svg" alt="add task" width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  );
}