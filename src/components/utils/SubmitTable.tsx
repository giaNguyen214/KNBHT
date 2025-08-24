import React, { useState } from "react";
import { Box, Button, Typography, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Papa from "papaparse";
import { useSearchContext } from "@/contexts/searchContext";
import { useIgnoreImageContext } from "@/contexts/ignoreContext";
import {fps} from "@/constants/fps"

interface ResultModalProps {
  submit: boolean; // Khi true thì hiển thị modal
  closeSubmitModal: () => void; // Hàm đóng modal
  results: any[]; // Danh sách dữ liệu ban đầu
  mode: string
}

// helpers (đặt bên trong file component, phía trên export default)
const KEYFRAME_RE = /^(L\d+_V\d{3})_(\d+(?:\.\d+)?)s\.jpg$/;

function parseKeyframeId(keyframe_id: string) {
  const m = keyframe_id.match(KEYFRAME_RE);
  if (!m) return { video_id: "", timestamp: NaN };
  const video_id = m[1];               // L29_V005
  const timestamp = Number(m[2]);      // 113.96
  return { video_id, timestamp };
}

function getFpsForVideo(video_id: string): number | null {
  // Ưu tiên key có đuôi .mp4, nếu không có thì thử không đuôi
  if (fps[`${video_id}.mp4`] !== undefined) return fps[`${video_id}.mp4`];
  if (fps[video_id] !== undefined) return fps[video_id];
  return null;
}


export default function ResultModal({ submit, closeSubmitModal, results, mode }: ResultModalProps) {
    const [rows, setRows] = useState(results);
    const {showList, setShowList} = useIgnoreImageContext()
    const {queryName} = useSearchContext()

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
    const downloadFrameTxt = () => {
        // Lấy 100 dòng đầu
        const first100 = derivedRows.slice(0, 100);

        // Mỗi dòng dạng "video_id,frame_id"
        const lines = first100.map(r => `${r.video_id},${r.frame_id ?? ""}`);

        const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${queryName}_frames.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        };


    // ngay trong component, trước phần return
    const derivedRows = rows
    .filter((_, idx) => showList[idx])
    .map((item) => {
        const { video_id, timestamp } = parseKeyframeId(item.keyframe_id || "");
        const fpsVal = getFpsForVideo(video_id);
        const frame_id =
            Number.isFinite(timestamp) && fpsVal != null ? Math.round(timestamp * fpsVal) : null;
        return {
            video_id,
            timestamp,                // số giây (number)
            fps: fpsVal,              // giữ số chính xác từ map fps
            frame_id
        };
    });

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

                    <Button variant="contained" onClick={downloadFrameTxt}>
                        Tải xuống
                    </Button>
                </Box>

                <Box className="h-[80vh] overflow-auto">
                    <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Video ID</th>
                            <th>Timestamp (s)</th>
                            <th>FPS</th>
                            <th>Frame ID</th>
                            <th>Xóa</th>
                        </tr>
                        </thead>
                        <tbody>
                            {derivedRows.map((row, index) => (
                                <tr key={index}>
                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                    <td style={{ textAlign: "center" }}>{row.video_id}</td>
                                    <td style={{ textAlign: "center" }}>
                                    {Number.isFinite(row.timestamp) ? row.timestamp : ""}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{row.fps ?? ""}</td>
                                    <td style={{ textAlign: "center" }}>{row.frame_id ?? ""}</td>
                                    <td style={{ textAlign: "center" }}>
                                    <IconButton onClick={() => handleDelete(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Box>
                </Box>

            </Box>
        </Box>
        )
    );
}
