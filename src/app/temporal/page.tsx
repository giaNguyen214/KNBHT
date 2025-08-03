"use client"

import { 
    Box 
} from "@mui/material"

import DynamicQuery from "@/components/temporalSearch/DynamicQuery"
import ImageGallery from "@/components/temporalSearch/ImageGallery"

import { useSearch } from "@/hooks/search"
import { SearchPayload } from "@/types/Search"

import { useState, useEffect } from "react"
import Login from "@/components/utils/Login"

export default function Test() {
    // //  logic Login
    // const [username, setUsername] = useState("");
    // useEffect(() => {
    //     const storedUsername = localStorage.getItem("username");
    //     if (storedUsername) {
    //         setUsername(storedUsername);
    //     }
    // }, []);
    // const [isOpen, setIsOpen] = useState(false)
    // const closeModal = () => {
    //     setIsOpen(false)
    // }
    // if (username === undefined || username === "" || !username) {
    //     console.log("username", username)
    //     return (
    //         <Login closeModal={closeModal}/>
    //     )
    // }

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