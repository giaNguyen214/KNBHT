"use client"

import { 
    Box,
    Button,
    TextField,
    Typography
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

export default function SubscreenC() {
    const { query, setQuery, mode, setMode } = useSearchContext();
    const {searching, handleSearch} = useSearchResultContext()
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

    const [username, setUsername] = React.useState<string>("Unknown User");
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);


    return (
        <Box className="w-full h-full p-2 border border-solid border-black">
            <Typography>Subscreen C</Typography>
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

                    <CustomAvatar name={"Unknown User"}/>
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