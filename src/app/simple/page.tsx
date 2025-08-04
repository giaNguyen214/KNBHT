"use client" 

import SubscreenA from "@/components/simple/SubscreenA"
import SubscreenB from "@/components/simple/SubscreenB"
import SubscreenC from "@/components/simple/SubscreenC"
import SubscreenD from "@/components/simple/SubscreenD"

import { Box } from "@mui/material" 
import { useState, useEffect } from "react"
import Login from "@/components/utils/Login"

import { IgnoreProvider, SearchProvider, SearchResultProvider } from "@/contexts/searchContext";
import CircularProgress from "@mui/material/CircularProgress";


export default function Simple() {    

    return (
        <SearchProvider>
            
            <Box className="w-screen h-screen grid grid-cols-[1fr_2fr] gap-2">
                <IgnoreProvider>
                    <Box className="w-full h-full p-2 grid grid-rows-[1fr_2fr] gap-1 min-h-0">
                        <SearchResultProvider>
                            <SubscreenA/>
                            <SubscreenB/>
                        </SearchResultProvider>
                    </Box>
                </IgnoreProvider>

                <IgnoreProvider>
                    <Box className="w-full h-full p-2 grid grid-rows-[1fr_4fr] gap-1 min-h-0">
                        <SearchResultProvider>
                            <SubscreenC/>
                            <SubscreenD/>
                        </SearchResultProvider>
                    </Box>
                </IgnoreProvider>
            </Box>
         </SearchProvider>
    )
}


