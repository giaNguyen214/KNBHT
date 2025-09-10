"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
} from "@mui/material";
import SubmissionButton from "@/components/utils/SubmissionButton"


interface TabInfo {
  sheetName: string;
  firstRow: string[];
}

export default function TabListTable() {
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTabs() {
      try {
        const res = await fetch("/api/listTabs", { method: "GET" });
        const text = await res.text();

        try {
          const data = JSON.parse(text);
          if (data.success) {
            setTabs(data.tabs);
          } else {
            setError(data.error || "Có lỗi xảy ra");
          }
        } catch {
          console.error("❌ Response không phải JSON:", text);
          setError("API trả về HTML thay vì JSON");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTabs();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  // tìm số cột lớn nhất
  const maxCols = Math.max(0, ...tabs.map((t) => t.firstRow.length));

  return (
    <Paper sx={{ width: "100%", overflowX: "auto", p: 2 }}>
      <Typography
        variant="h6"
        component="div"
        sx={{ mb: 2, fontWeight: "bold" }}
      >
        Danh sách Tabs trong Google Sheet
      </Typography>
{/* 
      <SubmissionButton/> */}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Tên Tab</TableCell>
            {Array.from({ length: maxCols }).map((_, colIdx) => (
              <TableCell key={colIdx} sx={{ fontWeight: "bold" }}>
                Cột {colIdx + 1}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tabs.map((tab, idx) => (
            <TableRow key={idx}>
              <TableCell>{tab.sheetName}</TableCell>
              {Array.from({ length: maxCols }).map((_, colIdx) => (
                <TableCell key={colIdx}>
                  {tab.firstRow[colIdx] || ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
