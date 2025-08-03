"use client" 

import SubscreenA from "@/components/simple/SubscreenA"
import SubscreenB from "@/components/simple/SubscreenB"
import SubscreenC from "@/components/simple/SubscreenC"
import SubscreenD from "@/components/simple/SubscreenD"

import { Box } from "@mui/material" 
import { useState, useEffect } from "react"
import Login from "@/components/utils/Login"

import { SearchProvider, SearchResultProvider } from "@/contexts/searchContext";

export default function Simple() {    
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


    return (
        <SearchProvider>
            <Box className="w-screen h-screen grid grid-cols-[1fr_3fr] gap-4">
                
                <Box className="w-full h-full p-2 grid grid-rows-[1fr_2fr] gap-1 min-h-0">
                    <SearchResultProvider>
                        <SubscreenA/>
                        <SubscreenB/>
                    </SearchResultProvider>
                </Box>

                <Box className="w-full h-full p-2 grid grid-rows-[1fr_4fr] gap-1 min-h-0">
                    <SearchResultProvider>
                        <SubscreenC/>
                        <SubscreenD/>
                    </SearchResultProvider>
                </Box>
            </Box>
         </SearchProvider>
    )
}


