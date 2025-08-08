"use client"

import { 
    Autocomplete,
    Box,
    Button,
    TextField
} from "@mui/material"
import { ObjectListProps } from "@/types/Object"
import { useState } from "react"

export default function ObjectList({ objects, handleAddShape }: ObjectListProps) {
    const [selectedObject, setSelectedObject] = useState<string | null>("")

    return (
        <Box className="h-full w-[300px]">
            <Box className="flex justify-center items-center gap-2 mb-2">
                <Autocomplete
                    options={objects.map(obj => obj.name)}
                    value={selectedObject}
                    onChange={(event, newValue) => {
                        setSelectedObject(newValue)
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Chọn object..." variant="outlined" size="small" />
                    )}
                    fullWidth
                    clearOnEscape
                    disablePortal
                />
                <Button
                    variant="contained"
                    onClick={() => {
                        const object = objects.find(obj => obj.name === selectedObject)
                        if (object) {
                            handleAddShape(object)
                        }
                    }}
                    disabled={!selectedObject}
                >
                    Thêm
                </Button>
            </Box>

            <Box className="max-h-[90%] overflow-auto">
                {objects.map((object) => (
                    <Button 
                        key={object.name}
                        onClick={() => handleAddShape(object)}
                        variant="outlined"
                        className="mt-1"
                        fullWidth
                    >
                        {object.name}
                    </Button>
                ))}  
            </Box>
        </Box>
    )
}
