"use client"

import { 
    Box,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Chip
} from "@mui/material"

import PopupAlert from "../utils/Popup";

import { useSearchContext, useSearchResultContext } from "@/contexts/searchContext";
import { useState } from "react";

import MultiColorPicker from "../utils/ColorPicker";

import { useIgnoreContext } from "@/contexts/searchContext";
import axios from "axios";

import { itemsPerPage } from "@/constants/keyframe";

import ResultModal from "../utils/SubmitTable";

export default function SubscreenA() {
    const { query, mode, topK } = useSearchContext();
    const {searching, handleSearch} = useSearchResultContext()

    const [objectFilters, setObjectFilters] = useState<string[]>([]);
    
    const [ocrQuery, setOcrQuery] = useState("");
    const [asrQuery, setAsrQuery] = useState("");

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
            colors.length === 0 &&
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

        console.log("color", colors)
        const topK_value = topK === "" ? 100 : Number(topK);
        handleSearch({
            text_query: query,
            mode: mode,
            object_filters: objectFilters,
            color_filters: colors,
            ocr_query: ocrQuery,
            asr_query: asrQuery,
            top_k: topK_value
        });
    };

    const [autoIgnore, setAutoIgnore] = useState(false);
    const {showList, setShowList,  currentPage, setCurrentPage} = useIgnoreContext()
    const {results} = useSearchResultContext()
    // const sendHiddenTitles = async () => {
    //     const hiddenTitles = results
    //         .filter((_, idx) => !showList[idx])
    //         .map(item => `${item.video_id}_${item.keyframe_id}`);

    //     try {
    //         console.log("hidden titles: ", hiddenTitles)
    //         await axios.post("/api/hide-list", { hiddenTitles });
    //         console.log("Đã gửi thành công!");
    //     } catch (err) {
    //         console.error("Lỗi khi gửi:", err);
    //     }
    // };

    const [prevShowList, setPrevShowList] = useState<boolean[]>([]);
    const handleAutoIgnoreChange = () => {
        if (!autoIgnore) {
            // Trường hợp đang OFF -> Bật ON
            setPrevShowList(showList); // lưu trạng thái trước đó

            // setShowList(Array(showList.length).fill(false)); // hide hết
            // setShowList(Array(itemsPerPage).fill(true));
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;

            setShowList(prev =>
                prev.map((val, i) => {
                    if (i >= startIndex && i < endIndex) {
                        return false; // hide ảnh trong trang hiện tại
                    }
                    return val; // giữ nguyên các trang khác
                })
            );

            setAutoIgnore(true);
        } else {
            // Trường hợp đang ON -> Tắt OFF
            if (prevShowList.length > 0) {
                setShowList(prevShowList); // khôi phục trạng thái cũ
            }
            setAutoIgnore(false);
        }
    };

    const [colors, setColors] = useState<string[]>([]);
    const [currentColor, setCurrentColor] = useState("#000000");
    const removeColor = (c: string) => {
        setColors(colors.filter(col => col !== c));
    };

    const [submit, setSubmit] = useState(false)
    const closeSubmitModal = () => {
        setSubmit(false)
    }
    const {queryName} = useSearchContext()
    const openSubmitModal = () => {
        if (results.length === 0) {
            setPopupSeverity("warning");
            setPopupMessage("Result rỗng. Cần nhấn Filter trước!");
            setIsOpen(true);
            return;
        }
        if (queryName === "") {
            setPopupSeverity("warning");
            setPopupMessage("Phải chọn Query name trước");
            setIsOpen(true);
            return;
        }
        setSubmit(true)
    }

    return (
        <Box className="w-full h-full border border-solid border-black">
            <Box className="flex-1 flex flex-col justify-center items-center gap-1 p-2">
                {/* color picker + filter input */}
                <Box className="w-full flex gap-2 justify-around">
                    <Box sx={{ maxWidth: 200 }}>
                        <MultiColorPicker
                            colors={colors}
                            setColors={setColors}
                            currentColor={currentColor}
                            setCurrentColor={setCurrentColor}
                        />
                    </Box>
                
                    <Box className="flex flex-1 flex-col gap-1">
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
                            fullWidth
                        />
                        
                        <TextField
                            label="OCR"
                            variant="filled"
                            className="w-[90%]"
                            onChange={(e) => setOcrQuery(e.target.value)}
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label="ASR"
                            variant="filled"
                            className="w-[90%]"
                            onChange={(e) => setAsrQuery(e.target.value)}
                            size="small"
                            fullWidth
                        />

                        <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {colors.map(c => (
                            <Chip
                                key={c}
                                label={c}
                                size="small" // Thu nhỏ chip
                                sx={{
                                    backgroundColor: c,
                                    color: "#fff",
                                    userSelect: "text", // Cho phép copy text
                                    fontSize: "0.75rem", // Chữ nhỏ hơn
                                    height: 24 // Thu gọn chiều cao
                                }}
                                onDelete={() => removeColor(c)}
                            />
                            ))}
                        </Box>
                    </Box>
                </Box>


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

                    </Box>

                    <Button variant="contained" onClick={onFilterClick}>
                        {searching ? "filtering..." : "Filter"}
                    </Button>

                    <Button
                        variant="contained"
                        onClick={openSubmitModal}
                        sx={{
                            backgroundColor: '#ff4081',  // Màu nền
                            color: 'white',               // Màu chữ
                            '&:hover': {
                                backgroundColor: '#f50057' // Màu khi hover
                            },
                            borderRadius: '50px',   // Hình pill (dài và bo tròn)
                        }}
                    >
                        Submit
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

            {submit && (
                // <Box className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.6)] flex flex-col justify-center items-center z-[9999] gap-5" onClick={closeSubmitModal}>
                //     <Box className="max-w-[700px] w-full flex flex-col items-center" onClick={(e) => {e.stopPropagation()}}>
                //         <Box className="flex justify-around items-center bg-white max-w-[700px] w-full p-2">
                //             <Typography
                //                 variant="h6"
                //                 sx={{
                //                     color: "#2e7d32", // màu xanh dương nổi bật
                //                     fontWeight: "bold", // chữ đậm
                //                     backgroundColor: "#e8f5e9", // nền nhẹ
                //                     padding: "4px 8px",
                //                     borderRadius: "4px",
                //                     display: "inline-block"
                //                 }}
                //             >
                //                 Results của filter
                //             </Typography>
                //             <Button variant="contained" size="large">
                //                 Tải xuống
                //             </Button>
                //         </Box>
                //         <Box className="bg-white p-2 rounded-10 max-w-[700px] w-full h-[80vh] overflow-auto flex flex-col gap-2 p-2">
                //             <Box>
                //                 {results.map((item, index) => {
                //                     console.log("result", results)
                //                     return (
                //                         <Box key={index}>
                //                             {item.video_id} - {item.keyframe_id} - {item.timestamp}
                //                         </Box>
                //                     )
                //                 })}
                //             </Box>
                //         </Box>
                //     </Box>
                // </Box>
                <ResultModal
                    submit={submit}
                    closeSubmitModal={closeSubmitModal}
                    results={results}
                    mode="Filter"
                />

            )}
        </Box>
    )
}