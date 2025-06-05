// used this as a template: https://codesandbox.io/p/sandbox/-w5szl?file=%2Fsrc%2Findex.js%3A1%2C1-165%2C1
"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import { getFirestore, doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import TypeTaskHeader from "./TypeTaskHeader";
import Task from "./Task";
import { auth, provider, db, user} from "../../../firebaseConfig";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600'],
});

// Helper function to update Firestore after drag operations
async function updateFirestoreAfterDrag(taskMap, sourceCol, destCol, sourceIndex, destIndex, taskIndex) {
  const docRef = doc(db, "userInfo", user.uid);
  
  const updatedTasks = { ...taskMap };
  
  if (sourceCol === destCol) {
    // Reorder within same column
    const tasks = [...updatedTasks[sourceCol].taskDescriptions];
    const [movedTask] = tasks.splice(sourceIndex, 1);
    tasks.splice(destIndex, 0, movedTask);
    updatedTasks[sourceCol] = {
      ...updatedTasks[sourceCol],
      taskDescriptions: tasks
    };
  } else {
    // Move between columns
    const sourceTasks = [...updatedTasks[sourceCol].taskDescriptions];
    const destTasks = [...updatedTasks[destCol].taskDescriptions];
    
    const [movedTask] = sourceTasks.splice(sourceIndex, 1);
    destTasks.splice(destIndex, 0, movedTask);
    
    updatedTasks[sourceCol] = {
      ...updatedTasks[sourceCol],
      taskDescriptions: sourceTasks
    };
    updatedTasks[destCol] = {
      ...updatedTasks[destCol],
      taskDescriptions: destTasks
    };
  }
  
  await updateDoc(docRef, { tasks: updatedTasks });
}

// Helper function to delete a task from Firestore
async function deleteTaskFromFirestore(taskMap, columnKey, taskIndex) {
  const docRef = doc(db, "userInfo", user.uid);
  
  const updatedTasks = { ...taskMap };
  const tasks = [...updatedTasks[columnKey].taskDescriptions];
  tasks.splice(taskIndex, 1);
  
  updatedTasks[columnKey] = {
    ...updatedTasks[columnKey],
    taskDescriptions: tasks
  };
  
  await updateDoc(docRef, { tasks: updatedTasks });
}

export default function TaskPage() {
  const [taskMap, setTaskMap] = useState({});
  const [taskIndex, setTaskIndex] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, "userInfo", user.uid);
    
    // Set up real-time listener for Firestore changes
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
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

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  async function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColIndex = parseInt(source.droppableId);
    const destColIndex = parseInt(destination.droppableId);
    const sourceColKey = taskIndex[sourceColIndex];
    const destColKey = taskIndex[destColIndex];

    // Update Firestore directly
    await updateFirestoreAfterDrag(
      taskMap,
      sourceColKey,
      destColKey,
      source.index,
      destination.index,
      taskIndex
    );
  }

  // Render tasks directly from Firestore data
  const renderTasks = (columnKey, groupIndex) => {
    const tasks = taskMap[columnKey]?.taskDescriptions || [];
    
    return tasks.map((description, itemIndex) => (
      <Draggable
        key={`task-${columnKey}-${itemIndex}`}
        draggableId={`task-${columnKey}-${itemIndex}`}
        index={itemIndex}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`select-none p-1 h-8 justify-center items-center mb-2 rounded border transition-all ${
              snapshot.isDragging
                ? "bg-green-300 border-white opacity-50"
                : "bg-white border-gray-300 opacity-100"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>
                <Task
                  description={description}
                  column={columnKey}
                  index={itemIndex}
                  taskIndex={taskIndex}
                />
              </span>
              <button
                onClick={async () => {
                  await deleteTaskFromFirestore(taskMap, columnKey, itemIndex);
                }}
                className="ml-2 text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </Draggable>
    ));
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
      <div className="pt-12 flex flex-col items-center justify-center">
        <h1 className={`${spaceGrotesk.className} text-5xl`}>tasks</h1>
        <h2 className={`${spaceGrotesk.className} text-xl pt-4`}>Seize the day {name}</h2>
      </div>

      <div className="flex items-center justify-center w-full">
        <div className="flex flex-row">
          <div className="flex align-top gap-1 m-8 overflow-x-auto">
            <DragDropContext onDragEnd={onDragEnd}>
              {taskIndex.map((columnKey, groupIndex) => (
                <Droppable key={groupIndex} droppableId={`${groupIndex}`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[100px] align-top rounded shadow transition-colors ${
                        snapshot.isDraggingOver ? "bg-gray-100" : "white"
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

// Export the delete function if needed elsewhere
export { deleteTaskFromFirestore };