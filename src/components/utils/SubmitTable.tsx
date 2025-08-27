import React, { useState } from "react";
import { Box, Button, Typography, IconButton, TextField, Switch, FormControlLabel } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Papa from "papaparse";
import { useSearchContext } from "@/contexts/searchContext";
import { useIgnoreImageContext } from "@/contexts/ignoreContext";
import {fps} from "@/constants/fps"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";


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

    const handleDelete = (originalIndex: number) => {
        const updated = [...rows];
        updated.splice(originalIndex, 1);
        setRows(updated);
        // cập nhật editableOriginalIndex nếu cần
        setEditableOriginalIndex(prev => {
            if (prev === null) return prev;
            if (originalIndex === prev) return null;           // xoá đúng row đang edit
            if (originalIndex < prev) return prev - 1;         // các index sau bị dồn lên
            return prev;
        });
    };

    const handleEdit = (index: number, field: string, value: string) => {
        const updated = [...rows];
        updated[index][field] = value;
        setRows(updated);
    };


    // Tải CSV
const downloadFrameTxt = () => {
  // Lấy 100 dòng đầu (đã lọc theo showList)
  const first100 = derivedRows.slice(0, 100);

  // Helper: làm phẳng chuỗi để không xuống dòng / tab trong TXT
  const sanitize = (v: unknown) =>
    (v ?? "").toString().replace(/\r?\n/g, " ").replace(/\t/g, " ").trim();

  // Nếu showAnswer: mỗi dòng "video_id,frame_id,answer"
  // Ngược lại: "video_id,frame_id"
  const lines = first100.map((r) => {
    const base = `${r.video_id},${r.frame_id ?? ""}`;
    if (showAnswer) {
      const ans = sanitize(rows[r.originalIndex]?.answer);
      return `${base},${ans}`;
    }
    return base;
  });

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  // đổi tên file khi có answer cho dễ nhận biết
  link.setAttribute("download", `${queryName}${showAnswer ? "_frames_ans" : "_frames"}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



    // ngay trong component, trước phần return
    // thay block derivedRows hiện tại bằng block này
    const derivedRows = rows
        .map((item, idx) => ({ item, idx }))                 // giữ original index
        .filter(({ idx }) => showList[idx])                  // lọc theo showList
        .map(({ item, idx }) => {
            const { video_id, timestamp } = parseKeyframeId(item.keyframe_id || "");
            const fpsVal = getFpsForVideo(video_id);
            const frame_id =
                Number.isFinite(timestamp) && fpsVal != null ? Math.round(timestamp * fpsVal) : null;
            return {
            originalIndex: idx,          // dùng để edit/delete đúng dòng trong rows
            video_id,
            timestamp,
            fps: fpsVal,
            frame_id,
            note: item.answer ?? "",       // giữ ghi chú (nếu đã có)
            };
    });

    const [showAnswer, setShowAnswer] = useState(true);
    // đặt trong component
    const moveRow = (originalIndex: number, dir: -1 | 1) => {
        // tìm vị trí của dòng đang hiển thị trong derivedRows
        const i = derivedRows.findIndex(r => r.originalIndex === originalIndex);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= derivedRows.length) return;

        const a = derivedRows[i].originalIndex;   // index trong rows
        const b = derivedRows[j].originalIndex;   // index trong rows

        const next = [...rows];
        [next[a], next[b]] = [next[b], next[a]];
        setRows(next);
    };

    const moveUp = (originalIndex: number) => moveRow(originalIndex, -1);
    const moveDown = (originalIndex: number) => moveRow(originalIndex, +1);

    // Thêm row mới lên đầu
    const [editableOriginalIndex, setEditableOriginalIndex] = useState<number | null>(null);
    const addRowTop = (init?: Partial<any>) => {
        const newRow = {
            keyframe_id: "",  // có thể truyền vào qua init nếu muốn
            answer: "",
            ...(init || {}),
        };

        setRows(prev => [newRow, ...prev]);

        // đảm bảo showList khớp thứ tự với rows
        if (typeof setShowList === "function") {
            setShowList(prev => [true, ...(prev ?? [])]);
        }
        setEditableOriginalIndex(0);
    };

    return (
        submit && (
        <Box
            className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.6)] flex justify-center items-center z-[9999]"
            onClick={closeSubmitModal}
        >
            <Box
                className="bg-white p-2 rounded-10 max-w-[1000px] w-full h-[80vh] overflow-auto flex flex-col gap-2"
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

                    <FormControlLabel
                        control={
                        <Switch
                            checked={showAnswer}
                            onChange={(e) => setShowAnswer(e.target.checked)}
                        />
                        }
                        label="Q&A"
                    />

                    <Button variant="outlined" onClick={() => addRowTop()}>
                        + Thêm dòng đầu
                    </Button>

                    <Button variant="contained" onClick={downloadFrameTxt}>
                        Tải xuống
                    </Button>
                </Box>

                <Box className="h-[80vh] overflow-auto">
                    <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Keyframe ID</th> {/* NEW */}
                            <th>Video ID</th>
                            <th>Timestamp (s)</th>
                            <th>FPS</th>
                            <th>Frame ID</th>
                            {showAnswer && <th>Answer</th>}
                            <th>Di chuyển</th>
                            <th>Xóa</th>
                        </tr>
                        </thead>
                        <tbody>
                            {derivedRows.map((row, index) => {
                                const isFirst = index === 0;
                                const isLast = index === derivedRows.length - 1;
                                const isKeyframeValid = Number.isFinite(row.timestamp) && !!row.video_id;

                                return (
                                    <tr key={index}>
                                        <td style={{ textAlign: "center" }}>{index + 1}</td>

                                        <td style={{ textAlign: "center" }}>
                                            {row.originalIndex === editableOriginalIndex ? (
                                                <TextField
                                                    size="small"
                                                    placeholder="L29_V005_0113.96s.jpg"
                                                    value={rows[row.originalIndex]?.keyframe_id ?? ""}
                                                    onChange={(e) =>
                                                        handleEdit(row.originalIndex, "keyframe_id", e.target.value)
                                                    }
                                                    error={
                                                        !!rows[row.originalIndex]?.keyframe_id &&
                                                        !(Number.isFinite(row.timestamp) && !!row.video_id)
                                                    }
                                                    helperText={
                                                        !!rows[row.originalIndex]?.keyframe_id &&
                                                        !(Number.isFinite(row.timestamp) && !!row.video_id)
                                                        ? "Định dạng: Lxx_Vyyy_ssss.s(s).jpg"
                                                        : " "
                                                    }
                                                />
                                            ) : (
                                                <span>{rows[row.originalIndex]?.keyframe_id ?? ""}</span>
                                            )}
                                        </td>


                                        <td style={{ textAlign: "center" }}>{row.video_id}</td>
                                        <td style={{ textAlign: "center" }}>
                                            {Number.isFinite(row.timestamp) ? row.timestamp : ""}
                                        </td>
                                        <td style={{ textAlign: "center" }}>{row.fps ?? ""}</td>
                                        <td style={{ textAlign: "center" }}>{row.frame_id ?? ""}</td>
                                        
                                        {showAnswer && (
                                            <td style={{ textAlign: "center" }}>
                                            <TextField
                                                size="small"
                                                value={rows[row.originalIndex]?.answer ?? ""} 
                                                onChange={(e) => handleEdit(row.originalIndex, "answer", e.target.value)}
                                            />
                                            </td>
                                        )}

                                        <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                            <IconButton size="small" onClick={() => moveUp(row.originalIndex)} disabled={isFirst}>
                                                <KeyboardArrowUpIcon />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => moveDown(row.originalIndex)} disabled={isLast}>
                                                <KeyboardArrowDownIcon />
                                            </IconButton>
                                        </td>
                                        
                                        <td style={{ textAlign: "center" }}>
                                            <IconButton onClick={() => handleDelete(row.originalIndex)}>
                                            <DeleteIcon />
                                            </IconButton>
                                        </td>
                                        
                                        
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Box>
                </Box>

            </Box>
        </Box>
        )
    );
}
