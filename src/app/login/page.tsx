"use client";

import { useState, useEffect } from "react";
import { Box, CircularProgress, TextField, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            // Nếu đã login rồi thì chuyển luôn sang trang /simple
            router.push("/simple");
        }
        setLoading(false);
    }, [router]);

    const handleLogin = () => {
        const allowedUsers = ["Gia Nguyên", "Duy Khương", "Duy Bảo", "Minh Tâm", "Lê Hiếu"];

        if (!allowedUsers.includes(username)) {
            setError(true);
            setMessage("Sai tên đăng nhập");
            return;
        }

        localStorage.setItem("username", username);
        router.push("/simple"); // Điều hướng sau khi login
    };

    if (loading) {
        return (
            <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Box className="w-[300px] bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
                <Typography sx={{ fontFamily: "monospace" }} variant="h6" align="center">
                    Login
                </Typography>
                <TextField
                    label="Username"
                    variant="filled"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        if (error) {
                            setError(false);
                            setMessage("");
                        }
                    }}
                    size="small"
                    fullWidth
                    error={error}
                    helperText={error ? message : ""}
                    slotProps={{
                        input: { className: "font-mono" }
                    }}
                />
                <Button variant="contained" onClick={handleLogin}>
                    Đăng nhập
                </Button>
            </Box>
        </Box>
    );
}
