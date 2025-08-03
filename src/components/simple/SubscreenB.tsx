import { 
    Box,
    Typography
} from "@mui/material"
import * as React from 'react';
import { useSearchResultContext } from "@/contexts/searchContext";
import ImageGallery from "../temporalSearch/ImageGallery";

export default function SubscreenB() {
    const {results} = useSearchResultContext()
    return (
        <Box className="w-full h-full p-2 border border-solid border-black overflow-auto">
            <Typography>Subscreen B</Typography>
            {/* <ImageList cols={2} gap={12}>
                {results.map((item, index) => (
                    <ImageListItem key={index}>
                    <img
                        src={item.img}
                        alt={item.title}
                        loading="lazy"
                        style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                    />
                    </ImageListItem>
                ))}
            </ImageList> */}
            <ImageGallery results={results} cols={2} gap={12} className="w-full"/> 

        </Box>
    )
}