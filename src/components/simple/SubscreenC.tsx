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
import { useSearchContext, useSearchResultContext } from "@/contexts/searchContext";
import { useState, useEffect } from "react";
import PopupAlert from "../utils/Popup";
import CustomAvatar from "../utils/CustomAvatar";
import { red, orange } from "@mui/material/colors";

import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

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

                    <TextField 
                        id="filled-basic" 
                        label="Query name" 
                        variant="filled" 
                        value={queryName}
                        onChange={(e) => setQueryName(e.target.value)}
                        size="small"
                        fullWidth
                        sx={{
                            width: 150
                        }}
                    />

                    <CustomAvatar/>
                </Box>
                <Box className="flex-1 w-full mt-2 flex justify-around items-center">
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


                    <Box className="flex justify-center items-center gap-2">
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
                                    onChange={() => setAutoIgnore(!autoIgnore)}
                                    color="success"
                                />
                            }
                        />

                        {/* <FormControlLabel
                            label="Full database?"
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
                                    color: red[600],
                                }
                            }}
                            control={
                                <Checkbox
                                    checked={full}
                                    onChange={() => setFull(!full)}
                                    sx={{
                                        color: red[800],
                                        '&.Mui-checked': {
                                            color: red[600],
                                        },
                                    }}
                                />
                            }
                        /> */}
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
                                >
                                    <MenuItem value={"Gia Nguyên"}>Nguyên</MenuItem>
                                    <MenuItem value={"Minh Tâm"}>Tâm</MenuItem>
                                    <MenuItem value={"Lê Hiếu"}>Hiếu</MenuItem>
                                    <MenuItem value={"Duy Khương"}>Khương</MenuItem>
                                    <MenuItem value={"Duy Bảo"}>Bảo</MenuItem>
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