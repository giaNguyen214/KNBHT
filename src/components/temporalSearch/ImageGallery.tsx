import { 
    Box,
    ImageList,
    ImageListItem,
    IconButton,
    Dialog,
    Typography
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

import { Item } from "@/types/Query";
import { useState, useEffect } from "react";
import { ImageGalleryProps } from "@/types/Query";

import { base_folder } from "@/constants/keyframe";

export default function ImageGallery( {results, cols, gap, className }: ImageGalleryProps ) {
    const [showList, setShowList] = useState<boolean[]>([]);
    // Khi results thay đổi, reset showList cho đúng số lượng item
    useEffect(() => {
        setShowList(Array(results.length).fill(true));
    }, [results]);

    const [openImage, setOpenImage] = useState<Item | null>(null);

    const toggleShow = (index: number) => {
        setShowList((prev) =>
            prev.map((val, i) => (i === index ? !val : val))
        );
    };

    return (
        <Box className={className || "w-[60%] h-[90%] ml-5 border border-solid border-black rounded-[2%] overflow-auto"}>
            <ImageList cols={cols} gap={12} className="w-full m-0 overflow-x-hidden">
                {results.map((item, index) => {
                    // const imgSrc = `${base_folder}/${item.video_id}_${item.keyframe_id}.${item.timestamp}s.jpg`;
                    const imgSrc = `${base_folder}/${item.keyframe_id}`;
                    // console.log("img source", imgSrc)
                    const imgTitle = `${item.video_id}_${item.keyframe_id}`;
                    return (
                        <ImageListItem key={index} className="relative">
                            <img
                                src={imgSrc}
                                alt={imgTitle}
                                loading="lazy"
                                className={`w-full h-auto border rounded-8 ${showList[index] ? "opacity-100" : "opacity-40"}`}
                            />

                            {/* Overlay icon Hide/Show */}
                            <IconButton
                                onClick={() => toggleShow(index)}
                                sx={{
                                    position: "absolute",
                                    bottom: "8px",
                                    right: "8px",
                                    backgroundColor: `${showList[index] ? "rgba(255, 255, 255, 0.5)" : "red"}`,
                                    "&:hover": {
                                        backgroundColor: `${showList[index] ? "rgba(255, 255, 255, 0.7)" : "red"}`,
                                    },
                                }}
                            >
                                {showList[index] ? (
                                    <VisibilityIcon sx={{ color: "black" }} />
                                ) : (
                                    <VisibilityOffIcon sx={{ color: "black"}} />
                                )}
                            </IconButton>

                            {/* Overlay icon Fullscreen */}
                            <IconButton
                                onClick={() => setOpenImage({ img: imgSrc, title: imgTitle })}
                                sx={{
                                    position: "absolute",
                                    bottom: "8px",
                                    left: "8px",
                                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                                    },
                                }}
                            >
                                <FullscreenIcon sx={{ color: "black" }} />
                            </IconButton>

                            {/* keyframe id */}
                            <Typography 
                                sx={{
                                    position: "absolute",
                                    top: "8px",
                                    left: "8px", 
                                    color: 'white',
                                    fontSize:'15px',
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
