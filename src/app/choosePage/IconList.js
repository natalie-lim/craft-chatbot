"use client";

import React from "react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const icons = [
  { file: "Key.svg", label: "ai insights for your task" },
  { file: "pencil.svg", label: "change heading colors" },
  { file: "plus-square.svg", label: "add task to column" },
  { file: "Sliders.svg", label: "changes the AI tone and response length" },
];

export default function IconList() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {icons.map(({ file, label }) => (
        <div key={file} className="flex items-center gap-3">
          <img src={`../assets/${file}`} alt={label} width={24} height={24} />
          <span className={`${spaceGrotesk.className} text-lg`}>{label}</span>
        </div>
      ))}
    </div>
  );
}
