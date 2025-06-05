"use client";

import React, { useState, useEffect } from "react";
import { Space_Grotesk } from "next/font/google";
import Popup from "reactjs-popup";
import { HexColorPicker } from "react-colorful";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, getCurrentUser } from "../../../firebaseConfig";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
});

function getRandomPastelHex() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 85%)`;
}

export default function TypeTaskHeader({ col, title, colorInput, taskIndex, taskMap }) {
  const [color, setColor] = useState(colorInput || getRandomPastelHex());
  const [headerTitle, setHeaderTitle] = useState(title || "");
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [isTypingTimeout, setIsTypingTimeout] = useState(null);

  const columnKey = taskIndex[col];

  useEffect(() => {
    setHeaderTitle(title || "");
  }, [title]);

  useEffect(() => {
    if (colorInput) setColor(colorInput);
  }, [colorInput]);

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getCurrentUser();
      setUser(u);
    };
    fetchUser();
  }, []);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setHeaderTitle(value);

    if (isTypingTimeout) clearTimeout(isTypingTimeout);

    const newTimeout = setTimeout(async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "userInfo", user.uid);
        await updateDoc(docRef, {
          [`tasks.${columnKey}.headerDescription`]: value,
        });
      } catch (err) {
        console.error("Error updating title:", err);
      }
    }, 400); // debounce time

    setIsTypingTimeout(newTimeout);
  };

  const handleColorChange = async (newColor) => {
    setColor(newColor);
    if (!user) return;

    try {
      const docRef = doc(db, "userInfo", user.uid);
      await updateDoc(docRef, {
        [`tasks.${columnKey}.color`]: newColor,
      });
    } catch (err) {
      console.error("Error updating color:", err);
    }
  };

  const handleAddTask = async () => {
    if (!user) return;

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
      taskDescriptions.push(""); // add empty task

      await updateDoc(docRef, {
        [`tasks.${columnKey}.taskDescriptions`]: taskDescriptions,
      });
    } catch (err) {
      console.error("Error adding task:", err);
    }
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
        />
        <div className="flex items-center space-x-2 z-10 ml-2">
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
            <HexColorPicker color={color} onChange={handleColorChange} />
          </Popup>

          <button onClick={handleAddTask}>
            <img src="../assets/plus-square.svg" alt="add task" width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
