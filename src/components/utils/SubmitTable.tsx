import React, { useState } from "react";
import { Box, Button, Typography, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Papa from "papaparse";
import { useSearchContext } from "@/contexts/searchContext";

interface ResultModalProps {
  submit: boolean; // Khi true thì hiển thị modal
  closeSubmitModal: () => void; // Hàm đóng modal
  results: any[]; // Danh sách dữ liệu ban đầu
  mode: string
}


export default function ResultModal({ submit, closeSubmitModal, results, mode }: ResultModalProps) {
    const [rows, setRows] = useState(results);

    const {queryName} = useSearchContext()

    const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(rows);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setRows(items);
    };

    const handleDelete = (index: number) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
    };

    const handleEdit = (index: number, field: string, value: string) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
    };


    // Tải CSV
    const downloadCSV = () => {
        const safeRows = rows.map(row => [
            `="${row.video_id}"`,
            `="${row.keyframe_id}"`,
            `="${row.timestamp}"`
        ]);

        const csv = Papa.unparse(safeRows, { header: false, quotes: false });
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${queryName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        submit && (
        <Box
            className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.6)] flex justify-center items-center z-[9999]"
            onClick={closeSubmitModal}
        >
            <Box
                className="bg-white p-2 rounded-10 max-w-[700px] w-full h-[80vh] overflow-auto flex flex-col gap-2"
                onClick={(e) => e.stopPropagation()}
            >
                <Box className="flex justify-around items-center">
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            color: '#fff',
                            backgroundColor: '#d32f2f', // Đỏ
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            display: 'inline-block'
                        }}
                    >
                        Results của {mode}
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            color: '#fff',
                            backgroundColor: '#009688',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            display: 'inline-block'
                        }}
                    >
                        Query {queryName}
                    </Typography>

                    <Button variant="contained" onClick={downloadCSV}>
                        Tải xuống
                    </Button>
                </Box>

                <Box className="h-[80vh] overflow-auto">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="table">
                        {(provided) => (
                            <Box
                            component="table"
                            sx={{ width: "100%", borderCollapse: "collapse" }}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            >
                            <thead>
                                <tr>
                                <th>#</th>
                                <th>Video ID</th>
                                <th>Keyframe ID</th>
                                <th>Timestamp</th>
                                <th>Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((item, index) => (
                                <Draggable
                                    key={index}
                                    draggableId={String(index)}
                                    index={index}
                                >
                                    {(provided) => (
                                    <tr
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <td>{index + 1}</td>
                                        <td>
                                        <TextField
                                            size="small"
                                            value={item.video_id}
                                            onChange={(e) =>
                                            handleEdit(index, "video_id", e.target.value)
                                            }
                                        />
                                        </td>
                                        <td>
                                        <TextField
                                            size="small"
                                            value={item.keyframe_id}
                                            onChange={(e) =>
                                            handleEdit(index, "keyframe_id", e.target.value)
                                            }
                                        />
                                        </td>
                                        <td>
                                        <TextField
                                            size="small"
                                            value={item.timestamp}
                                            onChange={(e) =>
                                            handleEdit(index, "timestamp", e.target.value)
                                            }
                                        />
                                        </td>
                                        <td>
                                        <IconButton onClick={() => handleDelete(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                        </td>
                                    </tr>
                                    )}
                                </Draggable>
                                ))}
                                {provided.placeholder}
                            </tbody>
                            </Box>
                        )}
                        </Droppable>
                    </DragDropContext>
                </Box>
            </Box>
        </Box>
        )
    );
}
