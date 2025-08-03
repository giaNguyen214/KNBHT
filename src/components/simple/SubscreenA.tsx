"use client"

import { 
    Box,
    Typography,
    TextField,
    Button
} from "@mui/material"

import PopupAlert from "../utils/Popup";

import { useSearchContext, useSearchResultContext } from "@/contexts/searchContext";
import { useState } from "react";

export default function SubscreenA() {
    const { query, mode } = useSearchContext();
    const {searching, handleSearch} = useSearchResultContext()

    const [objectFilters, setObjectFilters] = useState<string[]>([]);
    const [colorFilters, setColorFilters] = useState<string[]>([]);
    const [ocrQuery, setOcrQuery] = useState("");
    const [asrQuery, setAsrQuery] = useState("");
    const [topK, setTopK] = useState<number | "">("")

    const [isOpen, setIsOpen] = useState(false)
    const [popupSeverity, setPopupSeverity] = useState<"success" | "info" | "warning" | "error">("info");
    const [popupMessage, setPopupMessage] = useState("")
    const closeModal = () => {
        setIsOpen(false)
    }

    const validateFilters = () => {
        if (query.trim() === "") {
            return { valid: false, severity: "warning" as const, message: "Cần nhập câu truy vấn trước" };
        }

        const noFilters =
            objectFilters.length === 0 &&
            colorFilters.length === 0 &&
            ocrQuery.trim() === "" &&
            asrQuery.trim() === "";

        if (noFilters) {
            return { valid: false, severity: "info" as const, message: "Cần chọn filter trước" };
        }

        return { valid: true } as const;
    };

    const onFilterClick = () => {
        const result = validateFilters();

        if (!result.valid) {
            setPopupSeverity(result.severity);
            setPopupMessage(result.message);
            setIsOpen(true);
            return;
        }

        const topK_value = topK === "" ? 100 : Number(topK);

        handleSearch({
            text_query: query,
            mode: mode,
            object_filters: objectFilters,
            color_filters: colorFilters,
            ocr_query: ocrQuery,
            asr_query: asrQuery,
            top_k: topK_value
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
                    onChange={(e) =>
                        setObjectFilters(
                            e.target.value
                                .split(",")
                                .map(v => v.trim())
                                .filter(Boolean) // tương đương v !== ""
                        )
                    }
                    placeholder="Nhập nhiều object, cách nhau bằng ','"
                    size="small"
                />
                <TextField
                    label="Color"
                    variant="filled"
                    className="w-[90%]"
                    onChange={(e) =>
                        setColorFilters(
                            e.target.value
                                .split(",")
                                .map(v => v.trim())
                                .filter(Boolean)
                        )
                    }
                    placeholder="Nhập nhiều màu, cách nhau bằng ','"
                    size="small"
                />
                <TextField
                    label="OCR"
                    variant="filled"
                    className="w-[90%]"
                    onChange={(e) => setOcrQuery(e.target.value)}
                    size="small"
                />
                <TextField
                    label="ASR"
                    variant="filled"
                    className="w-[90%]"
                    onChange={(e) => setAsrQuery(e.target.value)}
                    size="small"
                />

                <Box className="flex justify-center items-center gap-10">
                    <TextField
                        label="Top K"
                        type="number"
                        variant="outlined"
                        value={topK}
                        onChange={(e) => {
                            const val = e.target.value;
                            setTopK(val === "" ? "" : Number(val));
                        }}
                        slotProps={{
                            input: {
                                inputProps: {
                                    min: 0,
                                    max: 100000,
                                    step: 1,
                                },
                            },
                        }}
                        size="small"
                    />
                    <Button variant="contained" onClick={onFilterClick}>
                        {searching ? "filtering..." : "Filter"}
                    </Button>
                </Box>
            </Box>

            {isOpen && (
                <PopupAlert
                    severity={popupSeverity}
                    message={popupMessage}
                    closeModal={closeModal}
                />
            )}
        </Box>
    )
}