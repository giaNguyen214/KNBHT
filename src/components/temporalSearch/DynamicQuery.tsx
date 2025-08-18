import {
  Box,
  Stack,
  TextField, 
  IconButton,
  Button
} from "@mui/material"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useState } from "react"
import { Query } from "@/types/Query"
import { QueryProps } from "@/types/Query";

const initialQuery: Query = {
      query: "",
      object: "",
      color: "",
      ocr: "",
      asr: ""
    }
export default function DynamicQuery({
  handleSearch,
  searching
}:QueryProps) {
  const [queries, setQueries] = useState<Query[]>([initialQuery])

  const handleChange = (index: number, mode: keyof Query, value: string) =>  {
    const updated = [...queries]
    updated[index][mode] = value
    setQueries(updated)
  }

  const moveUp = (index: number) => {
    if (index === 0) {return}
    const updated = [...queries];
    [updated[index-1], updated[index]] =  [updated[index], updated[index-1]]
    setQueries(updated)
  }

  const moveDown = (index: number) => {
    if (index === queries.length-1) {return}
    const updated = [...queries];
    [updated[index], updated[index+1]] =  [updated[index+1], updated[index]]
    setQueries(updated)
  }

  const handleDelete = (index: number) => {
    // filter( callback func ), callback func: (element, index, array) => boolean
    const updated = queries.filter(
      (_, i) => i !== index
    )
    setQueries(updated)
  }

  const handleAdd = () => {
    const newQưery: Query = {
      query: "",
      object: "",
      color: "",
      ocr: "",
      asr: ""
    }
    setQueries([...queries, newQưery]);
  };

  const handleSubmit = () => {
    handleSearch({
      text_query: "query",
      mode: "mode",
      object_filters: Record<string, [number, number, number][]>,
      color_filters: Record<string, [number, number, number][]>,
      ocr_query: "",
      asr_query: "",
      top_k: 10
    });
  }
  return (
    <Stack spacing={2} className="w-[40%]">
      {queries.map((query, index) => (
        <Stack key={index} direction="row" spacing={1} alignItems="stretch" className="w-full">
          <TextField 
            value={query.query} 
            placeholder={`Query cảnh ${index + 1}`}
            onChange={(e) => handleChange(index, "query", e.target.value)}
            className="flex-10"
            sx={{
              "& .MuiInputBase-root": {
                height: "100%", // chiếm full chiều cao
                alignItems: "center",
              },
              "& .MuiInputBase-input": {
                height: "100%",
              },
            }}
            multiline
            minRows={2} // số dòng tối thiểu
            maxRows={5} // số dòng tối đa trước khi cuộn
          />

          <Stack className="flex-10" spacing={0.5}>
            <TextField 
              value={query.object} 
              placeholder="Object"
              onChange={(e) => handleChange(index, "object", e.target.value)}
              size="small"
              sx={{
                "& .MuiInputBase-input": {
                  padding: "2px 8px", // giảm padding (top/bottom, left/right)
                  fontSize: "0.8rem", // chữ nhỏ hơn
                },
                "& .MuiOutlinedInput-root": {
                  height: "28px", // chiều cao tổng thể
                }
              }}
            />
            <TextField 
              value={query.color} 
              placeholder="Color"
              onChange={(e) => handleChange(index, "color", e.target.value)}
              size="small"
              sx={{
                "& .MuiInputBase-input": {
                  padding: "2px 8px", // giảm padding (top/bottom, left/right)
                  fontSize: "0.8rem", // chữ nhỏ hơn
                },
                "& .MuiOutlinedInput-root": {
                  height: "28px", // chiều cao tổng thể
                }
              }}
            />
            <TextField 
              value={query.ocr} 
              placeholder="OCR"
              onChange={(e) => handleChange(index, "ocr", e.target.value)}
              size="small"
              sx={{
                "& .MuiInputBase-input": {
                  padding: "2px 8px", // giảm padding (top/bottom, left/right)
                  fontSize: "0.8rem", // chữ nhỏ hơn
                },
                "& .MuiOutlinedInput-root": {
                  height: "28px", // chiều cao tổng thể
                }
              }}
            />
            <TextField 
              value={query.asr} 
              placeholder="ASR"
              onChange={(e) => handleChange(index, "asr", e.target.value)}
              size="small"
              sx={{
                "& .MuiInputBase-input": {
                  padding: "2px 8px", // giảm padding (top/bottom, left/right)
                  fontSize: "0.8rem", // chữ nhỏ hơn
                },
                "& .MuiOutlinedInput-root": {
                  height: "28px", // chiều cao tổng thể
                }
              }}
            />
          </Stack>

          <Stack className="flex-1 flex justify-between items-center" >
            <IconButton size="small" onClick={() => moveUp(index)}>
              <ArrowUpwardIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => moveDown(index)}>
              <ArrowDownwardIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => handleDelete(index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
            <Box>{index+1}</Box>
          </Stack>
        </Stack>
      ))}
      <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAdd}>
        Thêm prompt
      </Button>
      <Button variant="contained" 
        sx={{
          backgroundColor: "#ff8e3c", 
          color: "black",
          "&:hover": {
            backgroundColor: "#d9376e", 
          }
        }}
        onClick={handleSubmit}
      >
        {searching? "đang gửi query..." : "Gửi query"}
      </Button>
    </Stack>
  )
}
