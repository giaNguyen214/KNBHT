"use client"

import { 
    Box 
} from "@mui/material"

import DynamicQuery from "@/components/temporalSearch/DynamicQuery"
import ImageGallery from "@/components/temporalSearch/ImageGallery"

import { useSearch } from "@/hooks/search"
import { SearchPayload } from "@/types/Search"


export default function Test() {
    const { results, searching, search } = useSearch();

    const handleSearch = (searchPayload: SearchPayload) => {
        search("temporal", searchPayload);
    };
    return (
        <Box className="h-screen w-screen flex justify-center items-center p-2">
            <DynamicQuery handleSearch={handleSearch} searching={searching}/>
        

            <ImageGallery results={results} cols={5} /> 
        </Box>
    )
}