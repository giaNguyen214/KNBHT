"use client"

import { 
    Box,
    Button,
    TextField,
    Typography,
    Checkbox
} from "@mui/material"
import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useIgnoreContext, useSearchContext, useSearchResultContext } from "@/contexts/searchContext";
import { useState, useEffect } from "react";
import PopupAlert from "../utils/Popup";
import CustomAvatar from "../utils/CustomAvatar";
import { red, orange, yellow } from "@mui/material/colors";

import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import axios from "axios";

export default function SubscreenC() {
    const [autoIgnore, setAutoIgnore] = useState(false);
    const { query, setQuery, mode, setMode, queryName, setQueryName, dataSource, setDataSource} = useSearchContext();
    const {searching, handleSearch, cols, setCols} = useSearchResultContext()
    const [topK, setTopK] = useState<number | "">("")

    const [isOpen, setIsOpen] = useState(false)
    const [popupSeverity, setPopupSeverity] = useState<"success" | "info" | "warning" | "error">("info");
    const [popupMessage, setPopupMessage] = useState("")
    const closeModal = () => {
        setIsOpen(false)
    }

    const onSearchClick = () => {
        if (query.trim() === "") {
            setPopupSeverity("warning");
            setPopupMessage("Cần nhập câu truy vấn trước");
            setIsOpen(true);
            return;
        }

        const topK_value = topK === "" ? 100 : Number(topK);

        handleSearch({
            text_query: query,
            mode: mode,
            object_filters: [],
            color_filters: [],
            ocr_query: "",
            asr_query: "",
            top_k: topK_value
        });
    };

    const [username, setUsername] = useState<string>("Unknown User");
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleChangeDataSource = (event: SelectChangeEvent) => {
      setDataSource(event.target.value as string);
    };

    const QUERYNAME = Array.from({ length: 30 }, (_, i) => ({
        value: `Q${i + 1}`,
        label: `Q${i + 1}`
    }));

    const isDifferent = dataSource !== username;

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
        <Box className="w-full h-full p-2 border border-solid border-black">
            <Box className="flex flex-col justify-center items-center">
                <Box className="w-full p-2 flex justify-center items-center gap-5">
                    <TextField 
                        id="filled-basic" 
                        label="Nhập query" 
                        variant="filled" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        size="small"
                        fullWidth
                    />

                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label"
                                sx={{
                                    fontSize: 12,
                                    '&.MuiInputLabel-shrink': {
                                    transform: 'translate(14px, -6px) scale(0.85)', // đẩy label lên cao hơn
                                    backgroundColor: 'white', // nếu muốn nền che border
                                    padding: '0 4px'
                                    }
                                }}>
                                Data source?
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={dataSource}
                                label="Age"
                                onChange={handleChangeDataSource}
                                sx={{
                                    border: isDifferent ? "2px solid red" : undefined,
                                    backgroundColor: isDifferent ? "#ffebee" : "white", // đỏ nhạt cảnh báo
                                }}
                            >
                                <MenuItem value={"Gia Nguyên"}>Nguyên</MenuItem>
                                <MenuItem value={"Minh Tâm"}>Tâm</MenuItem>
                                <MenuItem value={"Lê Hiếu"}>Hiếu</MenuItem>
                                <MenuItem value={"Duy Khương"}>Khương</MenuItem>
                                <MenuItem value={"Duy Bảo"}>Bảo</MenuItem>
                                <MenuItem value={"all"}>Full database</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    
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

                    <CustomAvatar/>
                </Box>
                <Box className="flex-1 w-full mt-2 flex justify-around items-center">
                    {/* Ignore */}
                    <Box className="flex justify-center items-center gap-2 border p-2">
                        <FormControlLabel
                            label="Auto Ignore"
                            labelPlacement="top"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column", // 👈 label trên, checkbox dưới
                                textAlign: "center",
                                m: 1
                            }}
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
                        
                        <Box sx={{ minWidth: 110 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label"
                                    sx={{
                                    fontSize: 12,
                                        '&.MuiInputLabel-shrink': {
                                        transform: 'translate(14px, -6px) scale(0.85)', // đẩy label lên cao hơn
                                        backgroundColor: 'white', // nếu muốn nền che border
                                        padding: '0 4px'
                                        }
                                    }}>
                                    Query name
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={queryName}
                                    label="Age"
                                    onChange={(e) => setQueryName(e.target.value)}
                                    sx={{
                                        backgroundColor: yellow[100],
                                    }}
                                >
                                    {QUERYNAME.map((q) => (
                                        <MenuItem key={q.value} value={q.value}>
                                        {q.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

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

                    {/* chọn mode */}
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={mode}
                            onChange={(e) => setMode(e.target.value as any)}
                        >
                            <FormControlLabel value="clip" control={<Radio />} label="CLIP"/>
                            <FormControlLabel value="beit3" control={<Radio />} label="BEIT3" />
                            <FormControlLabel value="hybrid" control={<Radio />} label="Hybrid" />
                        </RadioGroup>
                    </FormControl>

                    {/* Gửi query */}
                    <Box className="flex justify-around items-center gap-2">                        
                        <TextField
                            label="Số cột"
                            type="number"
                            size="small"
                            value={cols}
                            onChange={(e) => {
                                const val = e.target.value;
                                setCols(val === "" ? "" : Number(val));
                            }}
                            slotProps={{
                                htmlInput: { min: 1 }
                            }}
                            sx={{ width: 100 }} // 👈 ép nhỏ hơn
                        />

                        <Button variant="contained" onClick={onSearchClick}>
                            {searching ? "đang tìm kiếm..." : "Tìm kiếm"}
                        </Button>
                    </Box>
                    
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