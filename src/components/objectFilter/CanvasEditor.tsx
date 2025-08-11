"use client"

import { CanvasEditorProps, CustomObject } from "@/types/Object";
import { Rnd } from 'react-rnd';
import { 
    Box, 
    Typography,
    Table, 
    TableBody, 
    TableCell, 
    TableRow
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from "@mui/icons-material/Delete";
import ColorPalettePicker from "./ColorPalletePicker";
import { useState, useEffect } from "react";

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

export default function CanvasEditor({shapesOnCanvas, setShapesOnCanvas, handleDragStop, handleResizeStop, handleDeleteShape}: CanvasEditorProps) {
    const [openColorPicker, setOpenColorPicker] = useState(false)
    const [color, setColor] = useState("#FF9800")
    const [selectedShape, setSelectedShape] = useState<CustomObject>()

    
    const handleOpenColorPicker = (shape: CustomObject) => {
        setOpenColorPicker(true)
        setColor(shape.color)
        setSelectedShape(shape) // lưu shape đang chọn
    }

    useEffect(() => {
        if (selectedShape) {
            setShapesOnCanvas((prevShapes) =>
                prevShapes.map((shape) =>
                    shape.id === selectedShape.id
                        ? { ...shape, color }
                        : shape
                )
            );
        }
    }, [color, selectedShape, setShapesOnCanvas]);

    const fields = ["name", "x_min", "x_max", "y_min", "y_max", "color"] as const;
    type Field = typeof fields[number];
    
    return (
        <Box className="w-full h-full">
            <Box className="w-full h-full flex justify-center items-center gap-10">
                <Box className="h-[95vh] flex flex-col">
                    <Box className="max-w-[60vw] h-full aspect-video bg-white border border-[#ccc] relative
                        [background-image:linear-gradient(to_right,_#eee_1px,_transparent_1px),_linear-gradient(to_bottom,_#eee_1px,_transparent_1px)]
                        [background-size:20px_20px] flex-1"
                    >
                        {shapesOnCanvas.map((shape) => {
                            const width = shape.x_max - shape.x_min;
                            const height = shape.y_max - shape.y_min;
                            const constrastColor = getContrastColor(shape.color)
                            return (
                                <Rnd
                                    key={shape.id}
                                    size={{ width: width, height: height }}
                                    position={{ x: shape.x_min, y: shape.y_min }}
                                    bounds="parent"
                                    onClick={() => handleOpenColorPicker(shape)}
                                    onDragStop={(e, d) => handleDragStop(d, shape, setShapesOnCanvas)}
                                    onResizeStop={(
                                        e: MouseEvent | TouchEvent,
                                        direction,
                                        ref: HTMLElement,
                                        delta,
                                        position: { x: number; y: number }
                                        ) => {handleResizeStop(ref, position, shape)}}
                                    style={{
                                        border: (openColorPicker && selectedShape && shape.id === selectedShape.id)
                                            ? `2px dashed ${constrastColor}`
                                            : `1px solid ${constrastColor}`,
                                        boxShadow: (openColorPicker && selectedShape && shape.id === selectedShape.id)
                                            ? '0 0 10px 3px rgba(0, 0, 0, 0.4)'
                                            : 'none',
                                        backgroundColor: shape.color,
                                        borderRadius: 4,
                                        position: "absolute",

                                    }}
                                >
                                    {/* Container full-size to position icons and text */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            position: 'relative',
                                        }}
                                    >
                                        {/* Top Icons */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteShape(shape)}
                                            >
                                                <DeleteIcon fontSize="small" sx={{color: constrastColor}}/>
                                            </IconButton>
                                        </Box>

                                        {/* Centered Text */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: '100%',
                                                padding: '0 4px',
                                            }}
                                        >
                                            <Typography variant="body2" sx={{color: constrastColor}}>
                                                {shape.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Rnd>
                            );
                        })}
                    </Box>

                    {/* <Box>
                        <Typography 
                            variant="caption" 
                            sx={{ fontSize: "11px", marginBottom: "4px" }}
                        >
                            Tổng số object: {shapesOnCanvas.length}
                        </Typography>

                        <Table size="small">
                            <TableBody>
                            {fields.map((field) => (
                                <TableRow key={field}>
                                <TableCell
                                    component="th"
                                    scope="row"
                                    sx={{ fontWeight: "bold", fontSize: "10px", padding: "2px 4px" }}
                                >
                                    {field}
                                </TableCell>
                                {shapesOnCanvas.map((shape, idx) => (
                                    <TableCell 
                                    key={idx} 
                                    sx={{ fontSize: "10px", padding: "2px 4px" }}
                                    >
                                    {shape[field]}
                                    </TableCell>
                                ))}
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </Box> */}

                </Box>
                <Box className="w-[15%]">
                    {
                        openColorPicker && (
                            <ColorPalettePicker color={color} setColor={setColor} shapesOnCanvas={shapesOnCanvas}/>
                        )
                    }
                </Box>
            </Box>

            {/* <Box>
                Tổng số object: {shapesOnCanvas.length}
            </Box>
            
            {shapesOnCanvas.map((shape, index) => (
                <Box key={index}>
                    {shape.name} {shape.x_min} {shape.x_max} {shape.y_min} {shape.y_max} {shape.color} 
                </Box>
            ))} */}
       
        </Box>
    )
}

