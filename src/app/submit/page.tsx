"use client";

import { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  TextField,
  Chip,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { fps } from "@/constants/fps";
import Sidebar from "@/components/utils/Siderbar";

interface Row {
  id: number;
  order: number;
  video_id: string;
  frame_id: string;
  qa_text?: string;
  [key: string]: any; // cho phép thêm frame_id_1, frame_id_2...
}

export default function SubmitPage() {
  const [videoId, setVideoId] = useState("");
  const [frameId, setFrameId] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [queryName, setQueryName] = useState("submission");
  const [mode, setMode] = useState<"qa" | "trake" | null>(null);
  const [eventCount, setEventCount] = useState<number>(2);
  const [trakeFrames, setTrakeFrames] = useState<string[]>([]);

  const generateRows = () => {
    const newRows: Row[] = [];

    if (mode === "trake") {
      // fill đủ 100 dòng cho TRAKE
      for (let i = 0; i < 100; i++) {
        const row: Row = {
          id: i,
          order: i + 1,
          video_id: videoId,
          frame_id: "", // không dùng frame_id chính trong TRAKE
        };
        for (let j = 1; j <= eventCount; j++) {
          row[`frame_id_${j}`] = trakeFrames[j - 1] ?? "";
        }
        newRows.push(row);
      }
    } else {
      const baseFrame = parseInt(frameId, 10);
      if (isNaN(baseFrame)) return;

      // dòng đầu tiên = đúng input
      newRows.push({
        id: 0,
        order: 1,
        video_id: videoId,
        frame_id: frameId,
        qa_text: "",
      });

      // spam ±25, đủ 100 dòng
      let idx = 2;
      for (let offset = -25; offset <= 25; offset++) {
        if (offset === 0) continue;
        const val = baseFrame + offset;

        newRows.push({
          id: idx - 1,
          order: idx,
          video_id: videoId,
          frame_id: String(val),
          qa_text: "",
        });
        idx++;
        if (newRows.length >= 100) break;
      }

      while (newRows.length < 100) {
        newRows.push({
          id: newRows.length,
          order: newRows.length + 1,
          video_id: videoId,
          frame_id: String(baseFrame + newRows.length),
          qa_text: "",
        });
      }
    }

    setRows(newRows);
  };

  const downloadCSV = () => {
    let lines: string[];

    if (mode === "qa") {
      lines = rows.map(
        (r) =>
          `${r.video_id},${r.frame_id},"${(r.qa_text ?? "").replace(/"/g, '""')}"`
      );
    } else if (mode === "trake") {
      lines = rows.map((r) => {
        const values = [r.video_id];
        for (let i = 1; i <= eventCount; i++) {
          values.push(r[`frame_id_${i}`] ?? "");
        }
        return values.join(",");
      });
    } else {
      lines = rows.map((r) => `${r.video_id},${r.frame_id}`);
    }

    const content = lines.join("\r\n");

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${queryName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const baseColumns: GridColDef[] = [
    { field: "order", headerName: "#", width: 80 },
    { field: "video_id", headerName: "Video ID", flex: 1, editable: true },
    { field: "frame_id", headerName: "Frame ID", flex: 1, editable: true },
  ];

  const columns: GridColDef[] =
    mode === "qa"
      ? [
          ...baseColumns,
          { field: "qa_text", headerName: "QA Text", flex: 2, editable: true },
        ]
      : mode === "trake"
      ? [
          { field: "order", headerName: "#", width: 80 },
          { field: "video_id", headerName: "Video ID", flex: 1, editable: true },
          ...Array.from({ length: eventCount }, (_, i) => ({
            field: `frame_id_${i + 1}`,
            headerName: `Frame ${i + 1}`,
            flex: 1,
            editable: true,
          })),
        ]
      : baseColumns;

  function getFpsForVideo(video_id: string): number | null {
    if (fps[`${video_id}.mp4`] !== undefined) return fps[`${video_id}.mp4`];
    if (fps[video_id] !== undefined) return fps[video_id];
    return null;
  }

  const [drawerOpen, setDrawerOpen] = useState(false);

  async function exportToGoogleSheet(data: any) {
  const res = await fetch("/api/export", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json = await res.json();

  if (json.needConfirm) {
    const ok = window.confirm(json.message || "Tab đã tồn tại, replace?");
    if (ok) {
      // Gửi lại request với forceReplace = true
      const retry = await fetch("/api/export", {
        method: "POST",
        body: JSON.stringify({ ...data, forceReplace: true }),
      });
      const retryJson = await retry.json();
      if (retryJson.success) {
        alert("✅ Replace thành công!");
        window.open(retryJson.url, "_blank");
      } else {
        alert("❌ Lỗi: " + retryJson.error);
      }
    }
  } else if (json.success) {
    alert("✅ Xuất dữ liệu thành công!");
    window.open(json.url, "_blank");
  } else {
    alert("❌ Lỗi: " + json.error);
  }
}

  
  return (
    <Box className="p-4 space-y-4">
        <Sidebar open={drawerOpen} setOpen={setDrawerOpen}/>

        <Box className="flex flex-wrap justify-center items-center gap-4">
            <TextField
            label="Video ID"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            size="small"
            />

            {mode === "trake" ? (
            <Box className="flex gap-2">
                {Array.from({ length: eventCount }, (_, i) => (
                <TextField
                    key={i}
                    label={`Frame ${i + 1}`}
                    size="small"
                    value={trakeFrames[i] ?? ""}
                    onChange={(e) => {
                    const updated = [...trakeFrames];
                    updated[i] = e.target.value;
                    setTrakeFrames(updated);
                    }}
                />
                ))}
            </Box>
            ) : (
            <TextField
                label="Frame ID"
                value={frameId}
                onChange={(e) => setFrameId(e.target.value)}
                size="small"
            />
            )}

            <TextField
            label="File Name"
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
            size="small"
            />

            {videoId && (
            <Chip
                label={`FPS: ${getFpsForVideo(videoId) ?? "N/A"}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: "bold" }}
            />
            )}

            <FormControlLabel
            control={
                <Switch
                checked={mode === "qa"}
                onChange={(e) => {
                    setMode(e.target.checked ? "qa" : null);
                    setTrakeFrames([]);
                }}
                />
            }
            label="Enable QA"
            />

            <FormControlLabel
            control={
                <Switch
                checked={mode === "trake"}
                onChange={(e) => {
                    setMode(e.target.checked ? "trake" : null);
                    setTrakeFrames([]);
                }}
                />
            }
            label="Enable TRAKE"
            />

            {mode === "trake" && (
            <TextField
                label="Số lượng event"
                type="number"
                value={eventCount}
                onChange={(e) => setEventCount(Number(e.target.value))}
                size="small"
                sx={{ width: 150 }}
            />
            )}

            <Button variant="contained" onClick={generateRows}>
            Generate
            </Button>

           <Button
  variant="contained"
  color="success"
  onClick={() =>
    exportToGoogleSheet({
      rows,
      queryName,
      mode,
      eventCount,
    })
  }
>
  Export to Google Sheet
</Button>

        </Box>

        <div style={{ height: 500, width: "100%" }}>
            <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 25, 50, 100]}
            processRowUpdate={(newRow, oldRow) => {
                const updatedRows = rows.map((row) =>
                row.id === oldRow.id ? { ...row, ...newRow } : row
                );
                setRows(updatedRows);
                return newRow;
            }}
            onProcessRowUpdateError={(error) => {
                console.error("Update error:", error);
            }}
            editMode="row"
            />
        </div>

        <Button variant="contained" color="success" onClick={downloadCSV}>
            Download CSV
        </Button>
    </Box>
  );
}
