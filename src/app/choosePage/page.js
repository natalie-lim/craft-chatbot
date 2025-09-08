"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Space_Grotesk } from "next/font/google";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import TypeTaskHeader from "./TypeTaskHeader";
import Task from "./Task";
import TypingText from "../TypingText";
import { db, getCurrentUser } from "../../../firebaseConfig";
import Popup from "reactjs-popup";
import IconList from "./IconList";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
});

//  Delete a task from Firestore
async function deleteTaskFromFirestore(taskMap, columnKey, taskIndex) {
  const user = await getCurrentUser();
  if (!user) return;

  const updatedTasks = { ...taskMap };
  const tasks = [...updatedTasks[columnKey].taskDescriptions];
  tasks.splice(taskIndex, 1);

  updatedTasks[columnKey] = {
    ...updatedTasks[columnKey],
    taskDescriptions: tasks,
  };

  const docRef = doc(db, "userInfo", user.uid);
  await updateDoc(docRef, { tasks: updatedTasks });
}

export default function TaskPage() {
  return (
    <div>
      <div className="pt-8 flex flex-col items-center pl-24">
        <TypingText text={"choose your adventure"} />
      </div>
    </div>
  );
}

// Export for external use
export { deleteTaskFromFirestore };
