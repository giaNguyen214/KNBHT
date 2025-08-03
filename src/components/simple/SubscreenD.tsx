import { 
    Box,
    Typography
} from "@mui/material"
import * as React from 'react';
import ImageGallery from "../temporalSearch/ImageGallery";
import { useSearchResultContext } from "@/contexts/searchContext";

export default function SubscreenD() {
    const {results} = useSearchResultContext()
    console.log(results)
    return (
        <Box className="w-full h-full p-2 border border-solid border-black overflow-auto">
            <Typography>Subscreen D</Typography>
            {/* <ImageList cols={3} gap={12}>
                {itemData.map((item, index) => (
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
            <ImageGallery results={results} cols={3} gap={12} className="w-full"/> 
        </Box>
    )
}