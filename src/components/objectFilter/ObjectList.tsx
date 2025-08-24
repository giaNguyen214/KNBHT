"use client"

import { 
  Autocomplete,
  Box,
  Button,
  TextField,
  Table, 
  TableBody, 
  TableCell, 
  TableRow,
  Typography
} from "@mui/material"
import { ObjectListProps } from "@/types/Object"
import { useState } from "react"

export default function ObjectList({ objects, handleAddShape, shapesOnCanvas = []   }: ObjectListProps) {
  // text hiện tại trong ô input
  const [value, setValue] = useState<string>("")
  const [inputValue, setInputValue] = useState<string>("")

  const names = objects.map(o => o.name)

  const DEFAULT_TEMPLATE = { width: 120, height: 80, color: "#111111" };

  const addSelected = () => {
    const name = (inputValue || value || "").trim();
    if (!name) return;

    const found = objects.find(
        o => o.name.toLowerCase() === name.toLowerCase()
    );

    const template = found ?? { name, ...DEFAULT_TEMPLATE };
    handleAddShape(template);

    setValue("");
    setInputValue("");
    };

  const fields = ["name", "x_min", "y_min", "x_max", "y_max", "color"] as const;

  return (
    <Box className="h-full w-full">
        <Box className="flex justify-center items-center gap-2 mb-2">
            <Autocomplete
            freeSolo
            options={names}
            value={value}
            inputValue={inputValue}
            onChange={(_, newValue) => {
                // khi chọn từ dropdown
                setValue(newValue ?? "")
                setInputValue(newValue ?? "")
            }}
            onInputChange={(_, newInputValue) => {
                // khi gõ tay
                setInputValue(newInputValue)
            }}
            renderInput={(params) => (
                <TextField
                {...params}
                label="Chọn hoặc nhập object…"
                variant="outlined"
                size="small"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                    e.preventDefault()
                    addSelected()
                    }
                }}
                />
            )}
            fullWidth
            clearOnEscape
            disablePortal
            selectOnFocus
            handleHomeEndKeys
            />
            <Button
            variant="contained"
            onClick={addSelected}
            disabled={!((inputValue || value)?.trim().length)}
            >
            Thêm
            </Button>
        </Box>

        <Box className="max-h-[65%] overflow-auto">
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
        <Box>
            <Typography 
                variant="caption" 
                sx={{ fontSize: "11px", marginBottom: "4px" }}
            >
                Tổng số object: {shapesOnCanvas.length}
            </Typography>
            <Box className="max-w-[250px] overflow-y-auto"> 
                <Table size="small"> 
                    <TableBody> 
                        {fields.map((field) => ( 
                            <TableRow key={field}> 
                                <TableCell 
                                    component="th" 
                                    scope="row" 
                                    sx={{ fontWeight: "bold", fontSize: "10px", padding: "2px 4px" }} 
                                > 
                                    {field} 
                                </TableCell> 
                                {shapesOnCanvas.map((shape, idx) => ( 
                                    <TableCell 
                                        key={idx} 
                                        sx={{ fontSize: "10px", padding: "2px 4px" }} 
                                    > 
                                        {["x_min", "x_max", "y_min", "y_max"].includes(field) ? 
                                        Math.round(Number(shape[field])) : shape[field]} 
                                    </TableCell> 
                                ))} 
                            </TableRow> 
                        ))} 
                    </TableBody> 
                </Table> 
            </Box>
        </Box>
    </Box>
  )
}
