"use client"

import { 
    Box,
    Typography,
    TextField,
    Button
} from "@mui/material"

import { useSearchContext, useSearchResultContext } from "@/contexts/searchContext";
import { useState } from "react";

export default function SubscreenA() {
    const { query, mode } = useSearchContext();
    const {searching, handleSearch} = useSearchResultContext()

    const [objectFilters, setObjectFilters] = useState<string[]>([]);
    const [colorFilters, setColorFilters] = useState<string[]>([]);
    const [ocrQuery, setOcrQuery] = useState("");
    const [asrQuery, setAsrQuery] = useState("");

    const onFilterClick = () => {
        handleSearch({
            text_query: query,
            mode: mode,
            object_filters: objectFilters,
            color_filters: colorFilters,
            ocr_query: ocrQuery,
            asr_query: asrQuery,
            top_k: 100
        });
    };
    return (
        <Box className="w-full h-full border border-solid border-black">
            <Typography>Subscreen A</Typography>
            <Box className="flex-1 flex flex-col justify-center items-center gap-2 p-2">
                <TextField 
                    id="filled-basic" 
                    label="Object" 
                    variant="filled" 
                    className="w-[90%]" 
                    onChange={(e) => setObjectFilters(e.target.value.split(","))}
                    placeholder="Nhập nhiều object, cách nhau bằng dấu phẩy"
                />
                <TextField
                    label="Color"
                    variant="filled"
                    className="w-[90%]"
                    onChange={(e) => setColorFilters(e.target.value.split(","))}
                    placeholder="Nhập nhiều màu, cách nhau bằng dấu phẩy"
                />
                <TextField
                    label="OCR"
                    variant="filled"
                    className="w-[90%]"
                    onChange={(e) => setOcrQuery(e.target.value)}
                />
                <TextField
                    label="ASR"
                    variant="filled"
                    className="w-[90%]"
                    onChange={(e) => setAsrQuery(e.target.value)}
                />

                <Button variant="contained" onClick={onFilterClick}>
                    {searching ? "filtering..." : "Filter"}
                </Button>
            </Box>
        </Box>
    )
}