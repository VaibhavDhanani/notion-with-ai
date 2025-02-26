"use client";
import stringToColor from "@/lib/stringToColor";
import { motion } from "framer-motion";
import React from "react";

const FollowPointer = ({
  x,
  y,
  info,
}: {
  x: number;
  y: number;
  info: { name: string; email: string; avatar: string };
}) => {
  const color = stringToColor(info.name || "1");

  return (
    <motion.div
      className="h-4 w-4 rounded-full absolute z-50"
      style={{
        top: y,
        left: x,
        pointerEvents: "none",
      }}
      initial={{
        scale: 1,
        opacity: 1,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
      }}
    >
      <svg
      width="24"
      height="24"
      viewBox="0 0 16 16"
      fill={color}
      stroke={color}
      className={`h-4 w-4 text-[${color}] transform strock-[${color}] `}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
      />
    </svg>
      <motion.div
        style={{
          backgroundColor: color,
        }}
        initial={{
          scale: 0.5,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.5,
          opacity: 0,
        }}
        className="px-2 py-2 bg-neutral-200 text-black font-bold whitespace-nowrap min-w-max text-xs rounded-full"
      >
        {info.email || info.name}
      </motion.div>
    </motion.div>
  );
};

export default FollowPointer;
