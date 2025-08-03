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

export default function SubscreenC() {
    const { query, setQuery, mode, setMode } = useSearchContext();
    const {searching, handleSearch} = useSearchResultContext()

    const onSearchClick = () => {
        handleSearch({
            text_query: query,
            mode: mode,
            object_filters: [],
            color_filters: [],
            ocr_query: "",
            asr_query: "",
            top_k: 100
        });
    };


    return (
        <Box className="w-full h-full border border-solid border-black">
            <Typography>Subscreen C</Typography>
            <Box className="flex flex-col justify-center items-center">
                <TextField 
                    id="filled-basic" 
                    label="Nhập query" 
                    variant="filled" 
                    className="w-[90%]" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Box className="flex-1 w-full mt-10 flex justify-around items-center">
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

                    <Button variant="contained" onClick={onSearchClick}>
                        {searching ? "đang tìm kiếm..." : "Tìm kiếm"}
                    </Button>
                </Box>
            </Box>
        </Box>

    )
}