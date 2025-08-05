import { 
    Box,
    ImageList,
    ImageListItem,
    IconButton,
    Dialog,
    Typography,
    Pagination,
    Button
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

import { Item } from "@/types/Query";
import { useState, useEffect } from "react";
import { ImageGalleryProps } from "@/types/Query";

import { base_folder } from "@/constants/keyframe";
import { itemsPerPage } from "@/constants/keyframe";
import { useIgnoreContext } from "@/contexts/searchContext";

import axios from "axios";

export default function ImageGallery( {results, cols, className }: ImageGalleryProps ) {
    const {showList, setShowList, currentPage, setCurrentPage} = useIgnoreContext()
    // const [showList, setShowList] = useState<boolean[]>([])

    // Khi results thay đổi, reset showList cho đúng số lượng item
    useEffect(() => {
        setShowList(Array(results.length).fill(true));
        setCurrentPage(1); // reset về trang đầu mỗi khi đổi tab
    }, [results]);

    const [openImage, setOpenImage] = useState<Item | null>(null);

    const toggleShow = (index: number) => {
        setShowList((prev) =>
            prev.map((val, i) => (i === index ? !val : val))
        );
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedResults = results.slice(startIndex, startIndex + itemsPerPage);
    const pageCount = Math.ceil(results.length / itemsPerPage);


    const sendHiddenTitles = async () => {
        const hiddenTitles = results
            .filter((_, idx) => !showList[idx])
            .map(item => `${item.video_id}_${item.keyframe_id}`);

        try {
            console.log("hidden titles: ", hiddenTitles)
            await axios.post("/api/hide-list", { hiddenTitles });
            console.log("Đã gửi thành công!");
        } catch (err) {
            console.error("Lỗi khi gửi:", err);
        }
    };
    return (
        <Box className={className || "w-[60%] h-[90%] ml-5 border border-solid border-black rounded-[2%] overflow-auto"}>
            <ImageList cols={cols} gap={12} className="w-full m-0 overflow-x-hidden">
                {paginatedResults.map((item, index) => {
                    const globalIndex = startIndex + index; // dùng để index vào showList
                    // console.log("Render item", globalIndex);

                    let imgSrc = `${base_folder}/${item.keyframe_id}`; // mặc định
                    if (process.env.NEXT_PUBLIC_MODE === "test") {
                        imgSrc = `${base_folder}/${item.video_id}_${item.keyframe_id}.${item.timestamp}s.jpg`;
                    }


                    // console.log("img source", imgSrc)
                    const imgTitle = `${item.video_id}_${item.keyframe_id}`;
                    return (
                        <ImageListItem key={globalIndex} className="relative">
                            <img
                                src={imgSrc}
                                alt={imgTitle}
                                loading="lazy"
                                className={`w-full h-auto border rounded-8 ${showList[globalIndex] ? "opacity-100" : "opacity-40"}`}
                            />

                            {/* Overlay icon Hide/Show */}
                            <IconButton
                                onClick={() => toggleShow(globalIndex)}
                                sx={{
                                    position: "absolute",
                                    bottom: "5px",
                                    right: "5px",
                                    p: "4px",
                                    backgroundColor: `${showList[globalIndex] ? "rgba(255, 255, 255, 0.5)" : "red"}`,
                                    "&:hover": {
                                        backgroundColor: `${showList[globalIndex] ? "rgba(255, 255, 255, 0.7)" : "red"}`,
                                    },
                                }}
                            >
                                {showList[globalIndex] ? (
                                    <VisibilityIcon sx={{ color: "black", fontSize: 18 }} />
                                ) : (
                                    <VisibilityOffIcon sx={{ color: "black", fontSize: 18 }} />
                                )}
                            </IconButton>

                            {/* Overlay icon Fullscreen */}
                            <IconButton
                                onClick={() => setOpenImage({ img: imgSrc, title: imgTitle })}
                                sx={{
                                    position: "absolute",
                                    bottom: "5px",
                                    left: "5px",
                                    p: "4px",
                                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                                    },
                                }}
                            >
                                <FullscreenIcon sx={{ color: "black", fontSize: 18 }} />
                            </IconButton>

                            {/* keyframe id */}
                            <Typography 
                                sx={{
                                    position: "absolute",
                                    top: "8px",
                                    left: "8px", 
                                    color: 'white',
                                    fontSize:'10px',
                                    userSelect: "text",
                                    pointerEvents: "auto",
                                    fontFamily:'monospace'
                                }}
                            >
                                {imgTitle}
                            </Typography>
                        </ImageListItem>
                    )
                })}
            </ImageList>
            <Box className="w-full flex justify-around items-center p-4">
                <Pagination 
                    count={pageCount}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    variant="outlined" 
                    shape="rounded" 
                />

                <Button 
                    variant="contained" 
                    sx={{
                        backgroundColor: "#9c27b0",
                        "&:hover": { backgroundColor: "#7b1fa2" },
                        "&:active": { backgroundColor: "#4a148c" },
                        color: "white",
                        textTransform: "none",
                    }}
                    onClick={sendHiddenTitles}
                    >
                    Ignore
                </Button>
            </Box>
            {/* Dialog fullscreen */}
            <Dialog
                open={!!openImage}
                onClose={() => setOpenImage(null)}
                maxWidth="lg"
                slotProps={{
                    transition: { timeout: 0 }, // bỏ delay
                }}
                slots={{
                    transition: undefined, // tắt animation
                }}
            >
                {openImage && (
                    <Box className="p-2 h-full overflow-hidden">
                        <img
                            src={openImage.img}
                            alt={openImage.title}
                            style={{
                                width: "100%",
                                height: "auto",
                                borderRadius: 8,
                                maxHeight: "80vh", // giới hạn chiều cao
                                objectFit: "contain", // giữ nguyên tỉ lệ
                            }}
                        />
                        <Typography sx={{ mt: 1, textAlign: "center", fontFamily:'monospace' }}>
                            {openImage.title}
                        </Typography>
                    </Box>
                )}
            </Dialog>
        </Box>
    );
}
