import { 
    Box,
    TextField,
    Typography
} from "@mui/material";
import { LoginProps } from "@/types/Utils";
import { useState } from "react";

export default function Login({
  closeModal,
}: LoginProps) {
    const [username, setUsername] = useState("");
    const handleUsernameChange = (value: string) => {
        setUsername(value);
        if (typeof window !== "undefined") {
            localStorage.setItem("username", value);
        }
    };
    return (
        <Box className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.6)] flex justify-center items-center z-[9999]" onClick={closeModal}>
            <Box className="w-[200px] h-[100px] bg-white p-2 rounded-10 flex flex-col justify-around items-center" onClick={(e) => {e.stopPropagation()}}>
                <Typography sx={{ fontFamily: "monospace" }}>Login</Typography>
                <TextField
                    id="filled-basic"
                    label="Username"
                    variant="filled"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    size="small"
                    fullWidth 
                    slotProps={{
                        input: {
                        className: "font-mono"
                        }
                    }}
                />
            </Box>
        </Box>
    )
}