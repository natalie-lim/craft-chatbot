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
    taskDescriptions: tasks
  };

  const docRef = doc(db, "userInfo", user.uid);
  await updateDoc(docRef, { tasks: updatedTasks });
}

export default function TaskPage() {
  const [taskMap, setTaskMap] = useState({});
  const [taskIndex, setTaskIndex] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [meanness, setMeanness] = useState("nice");
  const [wordCount, setWordCount] = useState(150);

  //  Realtime Firestore sync
  useEffect(() => {
    let unsubscribe;

    const fetchUserAndSubscribe = async () => {
      const user = await getCurrentUser();
      if (!user) return;

      const docRef = doc(db, "userInfo", user.uid);

      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.displayName || "friend");

          const tasks = data.tasks || {};
          setTaskMap(tasks);
          setTaskIndex(Object.keys(tasks));
          setLoading(false);
        } else {
          console.log("No such document!");
          setLoading(false);
        }
      });
    };

    fetchUserAndSubscribe();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  //  Immediate local update, then Firestore
  async function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColIndex = parseInt(source.droppableId);
    const destColIndex = parseInt(destination.droppableId);
    const sourceColKey = taskIndex[sourceColIndex];
    const destColKey = taskIndex[destColIndex];

    const updated = structuredClone(taskMap);

    if (sourceColKey === destColKey) {
      const tasks = [...updated[sourceColKey].taskDescriptions];
      const [moved] = tasks.splice(source.index, 1);
      tasks.splice(destination.index, 0, moved);
      updated[sourceColKey].taskDescriptions = tasks;
    } else {
      const sourceTasks = [...updated[sourceColKey].taskDescriptions];
      const destTasks = [...updated[destColKey].taskDescriptions];
      const [moved] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, moved);
      updated[sourceColKey].taskDescriptions = sourceTasks;
      updated[destColKey].taskDescriptions = destTasks;
    }

    setTaskMap(updated);

    const user = await getCurrentUser();
    const docRef = doc(db, "userInfo", user.uid);
    await updateDoc(docRef, { tasks: updated });
  }

  const renderTasks = (columnKey, groupIndex) => {
    const tasks = taskMap[columnKey]?.taskDescriptions || [];

    return tasks.map((description, itemIndex) => {
      const taskId = `task-${columnKey}-${itemIndex}-${description}`;
      return (
        <Draggable
          key={taskId}
          draggableId={taskId}
          index={itemIndex}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`select-none p-2 w-full justify-center items-center mb-2 rounded border transition-all duration-200 ${
                snapshot.isDragging
                  ? "bg-gray-200 border-white opacity-50"
                  : "bg-white border-gray-300 opacity-100"
              }`}
            >
              <div className="flex items-center w-full">
                <div className="flex-grow">
                  <Task
                    description={description}
                    meanness={meanness}
                    wordCount={wordCount}
                    column={columnKey}
                    index={itemIndex}
                    taskIndex={taskIndex}
                  />
                </div>
                <button
                  onClick={async () => {
                    await deleteTaskFromFirestore(taskMap, columnKey, itemIndex);
                  }}
                  className="ml-4 text-red-500 hover:text-red-700 text-sm shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </Draggable>
      );
    });
  };

  if (loading) {
    return (
      <div className="pt-12 flex flex-col items-center justify-center">
        <h1 className={`${spaceGrotesk.className} text-5xl`}>Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="pt-8 flex flex-col items-left pl-24">
        <TypingText text={"tasks."}/>
        <h2 className={`${spaceGrotesk.className} text-xl pt-2`}>{name}
        </h2>
      </div>

      <div className="absolute top-6 right-8 flex pt-8 gap-4 z-50">
        <Popup
          trigger={<button
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
          info
          </button>}
          position="bottom center"
          closeOnDocumentClick
          onOpen={async () => {
          }}
      >
        <div
          className={`rounded shadow p-4 max-w-60 text-black bg-gray-200`}
        >
          <h2 className={`${spaceGrotesk.className} text-lg text-black`}>what each symbol means: </h2>
          <IconList 
          />
        </div>
        </Popup>
      </div>

      <div className="flex items-center justify-center w-full">
        <div className="flex flex-row">
          <div className="flex w-screen gap-4 pl-24 pr-24 pt-8 overflow-x-hidden">
            <DragDropContext onDragEnd={onDragEnd}>
              {taskIndex.map((columnKey, groupIndex) => (
                <Droppable key={columnKey} droppableId={`${groupIndex}`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex flex-col flex-1 min-h-[100px] transition-colors ${
                        snapshot.isDraggingOver ? "bg-gray-100" : "bg-white"
                      }`}                      
                    >
                      <TypeTaskHeader
                        col={groupIndex}
                        title={taskMap[columnKey]?.headerDescription}
                        colorInput={taskMap[columnKey]?.color}
                        taskIndex={taskIndex}
                        taskMap={taskMap}
                      />
                      {renderTasks(columnKey, groupIndex)}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export for external use
export { deleteTaskFromFirestore };
