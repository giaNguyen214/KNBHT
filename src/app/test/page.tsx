"use client"

import ObjectFilterScreen from "@/components/objectFilter/ObjectFilterScreen"
import { ObjectProvider } from "@/contexts/objectContext"
import { Box } from "@mui/material"
import { ChromePicker } from "react-color"
import { useState } from "react"
import ColorPalettePicker from "@/components/objectFilter/ColorPalletePicker"
export default function Test() {
    return (
        <ObjectProvider>
            <Box className="h-screen w-screen flex justify-center items-center">
                <Box className="h-[80vh] w-full flex justify-center items-center p-5">
                    {/* <ObjectFilterScreen/> */}
                </Box>
            </Box>
        </ObjectProvider>
    )
    // const [color, setColor] = useState("#FF9800");
    
    // return (
    //     <ColorPalettePicker color={color} setColor={setColor}/>

    // )
}