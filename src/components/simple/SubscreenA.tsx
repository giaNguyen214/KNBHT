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
import { presetColors, basicColors } from "@/constants/color";
import { HexColorPicker } from "react-colorful";
import { useRouter } from "next/navigation"

import PopupAlert from "../utils/Popup";

import { useSearchContext, useSearchResultContext } from "@/contexts/searchContext";
import { useState } from "react";

import MultiColorPicker from "../utils/ColorPicker";

import { useIgnoreContext } from "@/contexts/searchContext";
import axios from "axios";

import { itemsPerPage } from "@/constants/keyframe";

import ResultModal from "../utils/SubmitTable";
import { useFetchIgnoredImages } from "@/hooks/getIgnoreInit";
import { useObjectContext } from "@/contexts/objectContext";
import { CustomObject } from "@/types/Object";
import ObjectFilterScreen from "../objectFilter/ObjectFilterScreen";

function getContrastColor(bgColor: string) {
  // Bỏ dấu # nếu có
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Tính độ sáng theo công thức WCAG
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Ngưỡng khoảng 128-150 là phổ biến (ở đây dùng 128)
  return brightness > 128 ? "black" : "white";
}

// Hàm chuyển hex sang [R, G, B]
function hexToRgb(hex: string): [number, number, number] | null {
  const cleanHex = hex.replace(/^#/, "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function convertShapes(shapesOnCanvas: CustomObject[]) {
  const result: Record<string, [number[], number[]][]> = {};

  for (const shape of shapesOnCanvas) {
    let vec = hexToRgb(shape.color); // RGB từ color
    let bbox = [
        Math.round(shape.x_min),
        Math.round(shape.y_min),
        Math.round(shape.x_max),
        Math.round(shape.y_max)
    ];

    if (shape.only_name) {
      vec = null;
      bbox = null;
    } else if (shape.only_bbox) {
      vec = null;
    } else if (shape.only_color) {
      bbox = null;
    }

    if (!result[shape.name]) {
      result[shape.name] = [];
    }
    result[shape.name].push([vec, bbox]);
  }

  return result;
}

export default function SubscreenA() {
    const router = useRouter()

    const { query, mode, topK, dataSource } = useSearchContext();
    const {results, searching, handleSearch} = useSearchResultContext()

    // const [objectFilters, setObjectFilters] = useState<string[]>([]);
    
    const [ocrQuery, setOcrQuery] = useState("");
    const [asrQuery, setAsrQuery] = useState("");

    const [isOpen, setIsOpen] = useState(false)
    const [popupSeverity, setPopupSeverity] = useState<"success" | "info" | "warning" | "error">("info");
    const [popupMessage, setPopupMessage] = useState("")
    const closeModal = () => {
        setIsOpen(false)
    }

    // const [shapesOnCanvas, setShapesOnCanvas] = useState<CustomObject[]>([]);
    const {shapesOnCanvas, setShapesOnCanvas} = useObjectContext()

    const validateFilters = () => {
        if (query.trim() === "") {
            return { valid: false, severity: "warning" as const, message: "Cần nhập câu truy vấn trước" };
        }

        if (queryName.trim() === "") {
            return { valid: false, severity: "warning" as const, message: "Chọn query name trước" };
        }

        const noFilters =
            shapesOnCanvas.length === 0 &&
            colors.length === 0 &&
            ocrQuery.trim() === "" &&
            asrQuery.trim() === "";

        if (noFilters) {
            return { valid: false, severity: "info" as const, message: "Cần chọn filter trước" };
        }

        return { valid: true } as const;
    };

    const { fetchIgnoredImages } = useFetchIgnoredImages();
    const onFilterClick = () => {
        const result = validateFilters();

        if (!result.valid) {
            setPopupSeverity(result.severity);
            setPopupMessage(result.message);
            setIsOpen(true);
            return;
        }

        const rgbColors: [number, number, number][] = colors.map(hex => hexToRgb(hex));

        const payload = {
            text_query: query,
            mode: mode,
            object_filters: convertShapes(shapesOnCanvas),
            color_filters: rgbColors,
            ocr_query: ocrQuery,
            asr_query: asrQuery,
            top_k: topK
        }
        console.log("payload", JSON.stringify(payload, null, 2));
        // const topK_value = topK === "" ? 100 : Number(topK);
        handleSearch({
            text_query: query,
            mode: mode,
            object_filters: convertShapes(shapesOnCanvas),
            color_filters: rgbColors,
            ocr_query: ocrQuery,
            asr_query: asrQuery,
            top_k: topK,
            user_query: dataSource
        });

        fetchIgnoredImages(queryName)
    };

    // const [autoIgnore, setAutoIgnore] = useState(false);
    // const {showList, setShowList,  currentPage, setCurrentPage} = useIgnoreContext()
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

    // const [prevShowList, setPrevShowList] = useState<boolean[]>([]);
    // const handleAutoIgnoreChange = () => {
    //     if (!autoIgnore) {
    //         // Trường hợp đang OFF -> Bật ON
    //         setPrevShowList(showList); // lưu trạng thái trước đó

    //         // setShowList(Array(showList.length).fill(false)); // hide hết
    //         // setShowList(Array(itemsPerPage).fill(true));
    //         const startIndex = (currentPage - 1) * itemsPerPage;
    //         const endIndex = startIndex + itemsPerPage;

    //         setShowList(prev =>
    //             prev.map((val, i) => {
    //                 if (i >= startIndex && i < endIndex) {
    //                     return false; // hide ảnh trong trang hiện tại
    //                 }
    //                 return val; // giữ nguyên các trang khác
    //             })
    //         );

    //         setAutoIgnore(true);
    //     } else {
    //         // Trường hợp đang ON -> Tắt OFF
    //         if (prevShowList.length > 0) {
    //             setShowList(prevShowList); // khôi phục trạng thái cũ
    //         }
    //         setAutoIgnore(false);
    //     }
    // };

    const [colors, setColors] = useState<string[]>([]);
    const [currentColor, setCurrentColor] = useState("#000000");
    // Thêm màu vào list nếu chưa có
    const addColorToList = (newColor: string) => {
        setColors((prev) => {
            if (!prev.includes(newColor)) {
                return [...prev, newColor];
            }
            return prev; // tránh thêm trùng
        });
    };
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

    const [openObjectFilter, setOpenObjectFilter] = useState(false)
    return (
        <Box className="w-full h-full border border-solid border-black">
            <Box className="flex-1 flex flex-col justify-center items-center gap-1 p-2">
                {/* color picker + filter input */}
                <Box className="w-full flex gap-2 justify-around">
                    <Box className="max-w-[150px] max-h-[250px] flex flex-col items-center">
                        <Box className="w-full grid grid-cols-6">
                            {basicColors.map((preset) => (
                                <Box
                                key={preset}
                                onClick={() => {
                                    setCurrentColor(preset);
                                    addColorToList(preset);
                                }}
                                style={{
                                    backgroundColor: preset,
                                    width: 25,
                                    height: 25,
                                    borderRadius: 4,
                                    cursor: "pointer",
                                    border: preset === currentColor ? "3px solid black" : "1px solid #ccc"
                                }}
                                />
                            ))}
                        </Box>

                        <TextField
                            label="HEX"
                            variant="filled"
                            size="small"
                            value={currentColor}
                            onChange={(e) => {
                                const val = e.target.value;
                                setCurrentColor(val);
                                if (/^#([0-9A-Fa-f]{6})$/.test(val)) { // kiểm tra hex hợp lệ
                                    addColorToList(val);
                                }
                            }}
                            sx={{
                                maxWidth: 100,
                                '& .MuiInputBase-root': {
                                    fontSize: '0.75rem', // chữ nhỏ
                                    padding: '2px 6px',  // khoảng cách nhỏ
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: '0.7rem', // label nhỏ
                                }
                            }}
                        />

                    </Box>
                
                    <Box className="flex flex-1 flex-col gap-1">
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

                        <Box sx={{ mt: 2, display: "flex", gap: 0.5, flexWrap: "wrap", maxHeight:"150px", overflow:"auto" }}>
                            {colors.map(c => {
                                const contrast_color = getContrastColor(c)
                                return (
                                    <Chip
                                        key={c}
                                        label={c}
                                        size="small" // Thu nhỏ chip
                                        sx={{
                                            backgroundColor: c,
                                            color: contrast_color,
                                            userSelect: "text", // Cho phép copy text
                                            fontSize: "0.7rem",       // chữ nhỏ hơn chút
                                            height: 20,               // thu chiều cao
                                            minWidth: 60,             // đặt chiều rộng tối thiểu
                                            padding: "0 4px",         // thu hẹp padding ngang
                                            "& .MuiChip-label": {
                                                padding: 0,             // bỏ padding mặc định label
                                            },
                                            "& .MuiChip-deleteIcon": {
                                                color: contrast_color,
                                                fontSize: "1rem",       // icon nhỏ hơn
                                            }
                                        }}
                                        onDelete={() => removeColor(c)}
                                    />
                                )
                            })}
                        </Box>
                    </Box>
                </Box>


                <Box className="flex justify-around w-full">
                    <Box className="flex justify-center items-center gap-10">
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

                    <Button variant="contained" onClick={() => setOpenObjectFilter(true)}>
                        Object filter
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
                <ResultModal
                    submit={submit}
                    closeSubmitModal={closeSubmitModal}
                    results={results}
                    mode="Filter"
                />

            )}

            {openObjectFilter && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1300,
                    }}
                    // onClick={() => setOpenObjectFilter(false)} // click overlay để đóng
                >
                    <Box
                        className="w-[95vw] h-[90vh] bg-white flex justify-center items-center p-5"
                        onClick={(e) => e.stopPropagation()} // chặn click bên trong popup làm đóng
                    >
                        <ObjectFilterScreen
                            shapesOnCanvas={shapesOnCanvas}
                            setShapesOnCanvas={setShapesOnCanvas}
                            setOpenObjectFilter={setOpenObjectFilter}
                        />
                    </Box>
                </Box>
            )}
            
        </Box>
    )
}