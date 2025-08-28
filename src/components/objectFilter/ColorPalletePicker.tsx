"use client"

import { HexColorPicker } from "react-colorful";
import React, { useState } from "react";
import { 
  Button, 
  Box, 
  TextField, 
  Typography,
  Autocomplete,
  IconButton,
  Table, 
  TableBody, 
  TableCell, 
  TableRow
} from "@mui/material";
import { ColorPalletePickerProps } from "@/types/Color";
import { cssColorNames } from "@/constants/color";
import InvertColorsIcon from "@mui/icons-material/InvertColors"
import { presetColors } from "@/constants/color";
import { Switch, FormControlLabel } from "@mui/material"


function getContrastColor(bgColor: string) {
  // Bỏ dấu # nếu có
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Tính độ sáng theo công thức WCAG
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Ngưỡng khoảng 128-150 là phổ biến (ở đây dùng 128)
  return brightness > 128 ? "black" : "white";
}


export default function ColorPalettePicker({color, setColor, shapesOnCanvas, setCircleMode}: ColorPalletePickerProps) {
  const [colorNameInput, setColorNameInput] = useState("");
  const [hexInput, setHexInput] = useState("");

  const rgbToHex = (rgb: string): string => {
  const result = rgb.match(/\d+/g);
  if (!result || result.length < 3) return "#000000"; // fallback

  const [r, g, b] = result.map(Number);
    return (
      "#" +
      [r, g, b]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
    );
  };
  const handleColorNameSubmit = () => {
    try {
      const temp = document.createElement("div");
      temp.style.color = colorNameInput;

      // Nếu tên màu hợp lệ, browser sẽ chấp nhận và đổi thành giá trị thực
      if (temp.style.color !== "") {
        document.body.appendChild(temp);
        const rgb = getComputedStyle(temp).color;
        document.body.removeChild(temp);

        const hex = rgbToHex(rgb);
        setColor(hex);
      } else {
        alert("Tên màu không hợp lệ!");
      }
    } catch {
      alert("Tên màu không hợp lệ!");
    }
  };


  const handleHexSubmit = () => {
    const hexRegex = /^#?([0-9A-Fa-f]{6})$/;
    const match = hexInput.match(hexRegex);
    if (match) {
      setColor(`#${match[1]}`);
    } else {
      alert("Mã hex không hợp lệ!");
    }
  };

  const fields = ["name", "x_min", "y_min", "x_max", "y_max", "color"] as const;
  type Field = typeof fields[number];
  
  return (
    <Box className="h-[85vh] w-full flex flex-col justify-center items-center gap-5">
      
      <Box className="w-full grid grid-cols-5 gap-2">
        {presetColors.map((preset) => (
          <Box
            key={preset}
            onClick={() => setColor(preset)}
            style={{
              backgroundColor: preset,
              width: 32,
              height: 32,
              borderRadius: 4,
              cursor: "pointer",
              border: preset === color ? "3px solid black" : "1px solid #ccc"
            }}
          />
        ))}
      </Box>
      
      <HexColorPicker color={color} onChange={setColor} />
      
      {/* Input tên màu */}
      <Box className="flex justify-around items-center w-full gap-2">
        <Autocomplete
          options={cssColorNames}
          value={colorNameInput}
          onChange={(e, newValue) => {
            if (newValue) setColorNameInput(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tên màu (CSS)"
              variant="outlined"
              size="small"
            />
          )}
          fullWidth
          freeSolo // cho phép nhập tự do ngoài danh sách
        />

        <IconButton 
          onClick={handleColorNameSubmit} 
          color="primary" 
          size="small"
        >
          <InvertColorsIcon />
        </IconButton>
      </Box>


      {/* Input hex */}
      <Box className="flex justify-around items-center w-full gap-2">
        <TextField
          label="Mã Hex (VD: #ff0000)"
          variant="outlined"
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          size="small"
          fullWidth
        />
        <IconButton 
          onClick={handleHexSubmit} 
          color="primary" 
          size="small"
        >
          <InvertColorsIcon />
        </IconButton>
      </Box>

      <Typography 
        sx={{
          backgroundColor: color, 
          color: getContrastColor(color),
          userSelect: 'text', // Cho phép bôi đen
          padding: '2px',
        }}
      >
          Selected {color}
      </Typography>

      
    </Box>
  );
}
