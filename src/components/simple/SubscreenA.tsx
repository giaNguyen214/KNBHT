"use client"

import { 
    Box,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel
} from "@mui/material"

import PopupAlert from "../utils/Popup";

import { useSearchContext, useSearchResultContext } from "@/contexts/searchContext";
import { useState } from "react";

import { useIgnoreContext } from "@/contexts/searchContext";
import axios from "axios";

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

    const [autoIgnore, setAutoIgnore] = useState(false);
    const {showList, setShowList} = useIgnoreContext()
    const {results} = useSearchResultContext()
    const sendHiddenTitles = async () => {
        const hiddenTitles = results
            .filter((_, idx) => !showList[idx])
            .map(item => `${item.video_id}_${item.keyframe_id}`);

        try {
            console.log("hidden titles: ", hiddenTitles)
            await axios.post("/api/hide-list", { hiddenTitles });
            console.log("Đã gửi thành công!");
        } catch (err) {
            console.error("Lỗi khi gửi:", err);
        }
    };

    const [prevShowList, setPrevShowList] = useState<boolean[]>([]);
    const handleAutoIgnoreChange = () => {
        if (!autoIgnore) {
            // Trường hợp đang OFF -> Bật ON
            setPrevShowList(showList); // lưu trạng thái trước đó
            setShowList(Array(showList.length).fill(false)); // hide hết
            setAutoIgnore(true);
        } else {
            // Trường hợp đang ON -> Tắt OFF
            if (prevShowList.length > 0) {
                setShowList(prevShowList); // khôi phục trạng thái cũ
            }
            setAutoIgnore(false);
        }
    };
    return (
        <Box className="w-full h-full border border-solid border-black">
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
                    <Box className="flex justify-center items-center gap-2 border p-2">
                        <FormControlLabel
                            label="Auto Ignore"
                            slotProps={{
                                typography: {
                                    fontFamily: "monospace",
                                    fontSize: "15px",
                                    color:'green'
                                }
                            }}
                            control={
                                <Checkbox
                                    checked={autoIgnore}
                                    onChange={handleAutoIgnoreChange}
                                    color="success"
                                />
                            }
                        />

                        <Button 
                            variant="contained" 
                            sx={{
                                backgroundColor: "#9c27b0",
                                "&:hover": { backgroundColor: "#7b1fa2" },
                                "&:active": { backgroundColor: "#4a148c" },
                                color: "white",
                                textTransform: "none",
                            }}
                            onClick={sendHiddenTitles}
                            >
                            Ignore
                        </Button>
                    </Box>

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