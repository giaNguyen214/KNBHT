import React, { useState } from "react";
import { TextField, IconButton, Stack, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Query() {
  const [prompts, setPrompts] = useState<string[]>([""]);

  const handleChange = (index: number, value: string) => {
    const updated = [...prompts];
    updated[index] = value;
    setPrompts(updated);
  };

  const handleAdd = () => {
    setPrompts([...prompts, ""]);
  };

  const handleDelete = (index: number) => {
    const updated = prompts.filter((_, i) => i !== index); 
    setPrompts(updated);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...prompts];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setPrompts(updated);
  };

  const moveDown = (index: number) => {
    if (index === prompts.length - 1) return;
    const updated = [...prompts];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setPrompts(updated);
  };

  const buildQuery = () => {
    const query = prompts.filter(p => p.trim() !== "").join(" ");
    console.log("Query:", query);
    // Gọi API ở đây
  };

  return (
    <Stack spacing={2}>
      {prompts.map((prompt, index) => (
        <Stack direction="row" spacing={1} key={index} alignItems="flex-start">
          <TextField
            fullWidth
            multiline
            minRows={2}
            label={`Scene ${index + 1}`}
            value={prompt}
            onChange={(e) => handleChange(index, e.target.value)}
          />
          <Stack spacing={1}>
            <IconButton size="small" onClick={() => moveUp(index)}>
              <ArrowUpwardIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => moveDown(index)}>
              <ArrowDownwardIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => handleDelete(index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      ))}
      <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAdd}>
        Thêm prompt
      </Button>
      <Button variant="contained" onClick={buildQuery}>
        Gửi Query
      </Button>
    </Stack>
  );
}
