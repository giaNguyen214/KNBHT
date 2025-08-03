import { 
    Box,
    Typography,
    ImageList,
    ImageListItem
} from "@mui/material"
import * as React from 'react';
import { useSearchResultContext } from "@/contexts/searchContext";
import ImageGallery from "../temporalSearch/ImageGallery";
import { base_folder } from "@/constants/keyframe";

export default function SubscreenB() {
    const {results} = useSearchResultContext()
    return (
        <Box className="w-full h-full p-2 overflow-y-scroll max-h-full border border-solid border-black">
            <Typography>Subscreen B</Typography>
            <Box className="h-[calc(100%-2rem)] w-full">
                <ImageGallery results={results} cols={2} gap={12} className="w-full h-auto" />
            </Box>

        </Box>
    )
}