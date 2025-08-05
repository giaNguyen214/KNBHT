"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

const SketchPicker = dynamic(
  () => import("react-color").then((mod) => mod.SketchPicker),
  { ssr: false }
);

interface MultiColorPickerProps {
  colors: string[];
  setColors: Dispatch<SetStateAction<string[]>>;
  currentColor: string;
  setCurrentColor: Dispatch<SetStateAction<string>>;
}

export default function MultiColorPicker({
  colors,
  setColors,
  currentColor,
  setCurrentColor
}: MultiColorPickerProps) {
  const handleChange = (color: any) => {
    setCurrentColor(color.hex);
  };

  const handleChangeComplete = (color: any) => {
    if (!colors.includes(color.hex)) {
      setColors([...colors, color.hex]);
    }
  };

  return (
    <Box sx={{ height: 250, overflow: "hidden" }}>
      <SketchPicker
        color={currentColor}
        onChange={handleChange} // thay đổi ngay khi kéo chuột
        onChangeComplete={handleChangeComplete} // lưu khi thả chuột
        styles={{
            default: {
                picker: {
                    transform: 'scale(0.8)', // 🔹 thu nhỏ toàn bộ
                    transformOrigin: 'top left', // giữ góc trên trái
                }
            }
        }}
      />
    </Box>
  );
}
