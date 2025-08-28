import React, { useState } from "react";
import { 
  Box, Button, Typography, IconButton, TextField, Switch, FormControlLabel 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useSearchContext } from "@/contexts/searchContext";
import { useIgnoreImageContext } from "@/contexts/ignoreContext";
import { fps } from "@/constants/fps";

// ---------------- AnswerCell ----------------
interface AnswerCellProps {
  value: string;
  onChange: (val: string) => void;
}
const AnswerCell: React.FC<AnswerCellProps> = React.memo(({ value, onChange }) => {
  // console.log("🔄 Re-render AnswerCell:", value);
  return (
    <TextField
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
});

// ---------------- Helpers ----------------
const KEYFRAME_RE = /^(L\d+_V\d{3})_(\d+(?:\.\d+)?)s\.jpg$/;

function parseKeyframeId(keyframe_id: string) {
  const m = keyframe_id.match(KEYFRAME_RE);
  if (!m) return { video_id: "", timestamp: NaN };
  const video_id = m[1];
  const timestamp = Number(m[2]);
  return { video_id, timestamp };
}

function getFpsForVideo(video_id: string): number | null {
  if (fps[`${video_id}.mp4`] !== undefined) return fps[`${video_id}.mp4`];
  if (fps[video_id] !== undefined) return fps[video_id];
  return null;
}

// ---------------- TableRowItem ----------------
interface TableRowProps {
  row: {
    index: number;
    originalIndex: number;
    video_id: string;
    timestamp: number;
    fps: number | null;
    frame_id: number | null;
    keyframe_id: string;
    answer: string;
  };
  isFirst: boolean;
  isLast: boolean;
  editableOriginalIndex: number | null;
  onEdit: (idx: number, field: string, value: string) => void;
  onDelete: (idx: number) => void;
  onMove: (idx: number, dir: -1 | 1) => void;
  showAnswer: boolean;
}

const TableRowItem: React.FC<TableRowProps> = React.memo(
  ({ row, isFirst, isLast, editableOriginalIndex, onEdit, onDelete, onMove, showAnswer }) => {
    // console.log("🔥 Re-render row:", row.originalIndex);

    return (
      <tr>
        <td style={{ textAlign: "center" }}>{row.index + 1}</td>

        <td style={{ textAlign: "center" }}>
          {row.originalIndex === editableOriginalIndex ? (
            <TextField
              size="small"
              placeholder="L29_V005_0113.96s.jpg"
              value={row.keyframe_id}
              onChange={(e) => onEdit(row.originalIndex, "keyframe_id", e.target.value)}
            />
          ) : (
            <span>{row.keyframe_id}</span>
          )}
        </td>

        <td style={{ textAlign: "center" }}>{row.video_id}</td>
        <td style={{ textAlign: "center" }}>{Number.isFinite(row.timestamp) ? row.timestamp : ""}</td>
        <td style={{ textAlign: "center" }}>{row.fps ?? ""}</td>
        <td style={{ textAlign: "center" }}>{row.frame_id ?? ""}</td>

        {showAnswer && (
          <td style={{ textAlign: "center" }}>
            <AnswerCell value={row.answer} onChange={(val) => onEdit(row.originalIndex, "answer", val)} />
          </td>
        )}

        <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
          <IconButton size="small" onClick={() => onMove(row.originalIndex, -1)} disabled={isFirst}>
            <KeyboardArrowUpIcon />
          </IconButton>
          <IconButton size="small" onClick={() => onMove(row.originalIndex, +1)} disabled={isLast}>
            <KeyboardArrowDownIcon />
          </IconButton>
        </td>

        <td style={{ textAlign: "center" }}>
          <IconButton onClick={() => onDelete(row.originalIndex)}>
            <DeleteIcon />
          </IconButton>
        </td>
      </tr>
    );
  },
  (prev, next) =>
    prev.row.keyframe_id === next.row.keyframe_id &&
    prev.row.answer === next.row.answer &&
    prev.editableOriginalIndex === next.editableOriginalIndex &&
    prev.showAnswer === next.showAnswer
);

// ---------------- Main Component ----------------
interface ResultModalProps {
  submit: boolean;
  closeSubmitModal: () => void;
  results: any[];
  mode: string;
}

export default function ResultModal({ submit, closeSubmitModal, results, mode }: ResultModalProps) {
  // console.log("⚡ Re-render ResultModal");
  const [rows, setRows] = useState(results.slice(0, 100));
  const { showList, setShowList } = useIgnoreImageContext();
  const { queryName } = useSearchContext();
  const [editableOriginalIndex, setEditableOriginalIndex] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(true);

  const handleDelete = (originalIndex: number) => {
    const updated = [...rows];
    updated.splice(originalIndex, 1);
    setRows(updated);
    setEditableOriginalIndex(prev => {
      if (prev === null) return prev;
      if (originalIndex === prev) return null;
      if (originalIndex < prev) return prev - 1;
      return prev;
    });
  };

  const handleEdit = (index: number, field: string, value: string) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

const downloadFrameTxt = () => {
  const first100 = derivedRows.slice(0, 100);
  const sanitize = (v: unknown) =>
    (v ?? "").toString().replace(/\r?\n/g, " ").replace(/\t/g, " ").trim();

  const lines = first100.map((r) => {
    const base = `${r.video_id},${r.frame_id ?? ""}`;
    if (showAnswer) {
      const ans = sanitize(rows[r.originalIndex]?.answer);
      return `${base},${ans}`;
    }
    return base;
  });

  // ❌ Không thêm \uFEFF → UTF-8 thuần
  // ✅ Xuống dòng theo CRLF cho Windows
  const content = lines.join("\r\n");

  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `${queryName}${showAnswer ? "_frames_ans" : "_frames"}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



  const derivedRows = rows
    .map((item, idx) => ({ item, idx }))
    .filter(({ idx }) => showList[idx])
    .map(({ item, idx }) => {
      const { video_id, timestamp } = parseKeyframeId(item.keyframe_id || "");
      const fpsVal = getFpsForVideo(video_id);
      const frame_id =
        Number.isFinite(timestamp) && fpsVal != null ? Math.round(timestamp * fpsVal) : null;
      return {
        index: idx, // index hiển thị
        originalIndex: idx,
        video_id,
        timestamp,
        fps: fpsVal,
        frame_id,
        keyframe_id: item.keyframe_id ?? "",
        answer: item.answer ?? "",
      };
    });

  const moveRow = (originalIndex: number, dir: -1 | 1) => {
    const i = derivedRows.findIndex(r => r.originalIndex === originalIndex);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= derivedRows.length) return;
    const a = derivedRows[i].originalIndex;
    const b = derivedRows[j].originalIndex;
    const next = [...rows];
    [next[a], next[b]] = [next[b], next[a]];
    setRows(next);
  };

  const addRowTop = (init?: Partial<any>) => {
    const newRow = {
      keyframe_id: "",
      answer: "",
      ...(init || {}),
    };
    setRows(prev => [newRow, ...prev]);
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
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff", backgroundColor: "#d32f2f", px: 1.5, py: 0.5, borderRadius: 1 }}>
              Results của {mode}
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff", backgroundColor: "#009688", px: 1.5, py: 0.5, borderRadius: 1 }}>
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
                  <th>Keyframe ID</th>
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
                {derivedRows.map((r, idx) => (
                  <TableRowItem
                    key={r.originalIndex}
                    row={r}
                    isFirst={idx === 0}
                    isLast={idx === derivedRows.length - 1}
                    editableOriginalIndex={editableOriginalIndex}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onMove={moveRow}
                    showAnswer={showAnswer}
                  />
                ))}
              </tbody>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  );
}
