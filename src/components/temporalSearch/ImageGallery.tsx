import { 
    Box,
    ImageList,
    ImageListItem,
    IconButton,
    Dialog,
    Typography,
    Pagination,
    Button,
    Checkbox
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FormControlLabel from '@mui/material/FormControlLabel';

import { Item } from "@/types/Query";
import { useState, useEffect } from "react";
import { ImageGalleryProps } from "@/types/Query";

import { base_folder } from "@/constants/keyframe";
import { itemsPerPage } from "@/constants/keyframe";
import { useSearchContext, useIgnoreContext } from "@/contexts/searchContext";
import { useIgnoreImageContext } from "@/contexts/ignoreContext";

import CustomAvatar from "../utils/CustomAvatar";

import socket from "@/lib/socket";

type IgnoredItem = {
  keyframe_id: string;
  username: string;
};

export default function ImageGallery( {results, cols, className }: ImageGalleryProps ) {
    const {showList, setShowList, currentPage, setCurrentPage} = useIgnoreContext()
    const {queryName} = useSearchContext()
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

    const [autoIgnore, setAutoIgnore] = useState(false);
    const [prevShowList, setPrevShowList] = useState<boolean[]>([]);
    const handleAutoIgnoreChange = () => {
        if (!autoIgnore) {
            // Trường hợp đang OFF -> Bật ON
            setPrevShowList(showList); // lưu trạng thái trước đó

            // setShowList(Array(showList.length).fill(false)); // hide hết
            // setShowList(Array(itemsPerPage).fill(true));
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;

            setShowList(prev =>
                prev.map((val, i) => {
                    if (i >= startIndex && i < endIndex) {
                        return false; // hide ảnh trong trang hiện tại
                    }
                    return val; // giữ nguyên các trang khác
                })
            );

            setAutoIgnore(true);
        } else {
            // Trường hợp đang ON -> Tắt OFF
            if (prevShowList.length > 0) {
                setShowList(prevShowList); // khôi phục trạng thái cũ
            }
            setAutoIgnore(false);
        }
    };

    const [username, setUsername] = useState<string>("Unknown User");
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);
    // socket config
    const sendHiddenTitles = async () => {
        const hiddenTitles = results
            .filter((_, idx) => !showList[idx])
            .map(item => `${item.keyframe_id}`);
        console.log("Đã gửi ignored image")
        console.log("hidden titles: ", hiddenTitles);
        socket.emit("hiddenTitles", {
            username,          // gửi thêm username
            query_name: queryName,
            hiddenTitles       // và danh sách bị ẩn
        });
    };
    

    const {ignoredMap, setIgnoredMap, ignoredUsernames, setIgnoredUsernames} = useIgnoreImageContext()


    useEffect(() => {
        socket.on("ignoredImage", (newIgnored: { keyframe_id: string; username: string; query_name: string }[]) => {
            setIgnoredMap((prev) => {
            const updated = new Map(prev);
            newIgnored.forEach(({ keyframe_id, username, query_name }) => {
                if (!updated.has(query_name)) {
                updated.set(query_name, new Map());
                }
                updated.get(query_name)!.set(keyframe_id, username);
            });
            return updated;
            });
        });

        return () => {
            socket.off("ignoredImage");
        };
    }, []);

    useEffect(() => {
        const currentIgnored = ignoredMap.get(queryName) || new Map();

        const newShowList: boolean[] = [];
        const newIgnoredUsernames: (string | null)[] = [];

        results.forEach(item => {
            if (currentIgnored.has(item.keyframe_id)) {
            newShowList.push(false);
            newIgnoredUsernames.push(currentIgnored.get(item.keyframe_id) || null);
            } else {
            newShowList.push(true);
            newIgnoredUsernames.push(null);
            }
        });

        setShowList(newShowList);
        setIgnoredUsernames(newIgnoredUsernames);
    }, [results, ignoredMap]);
   
    // Hàm tách ra "L26"
    function getFirstPart(name) {
        return name.split("_")[0];
    }

    // Hàm tách ra "L26_V261"
    function getFirstTwoParts(name) {
        return name.split("_").slice(0, 2).join("_");
    }
    return (
        <Box className={className || "w-[60%] h-[90%] ml-5 border border-solid border-black rounded-[2%] overflow-auto"}>
            <ImageList cols={cols} gap={12} className="w-full m-0 overflow-x-hidden">
                {paginatedResults.map((item, index) => {
                    const globalIndex = startIndex + index; // dùng để index vào showList
                    // console.log("Render item", globalIndex);

                    // let imgSrc = `${base_folder}/${item.keyframe_id}`; // mặc định
                    // if (process.env.NEXT_PUBLIC_MODE !== "test") {
                    //     const [l, _, v] = item.video_id.split("_"); // destructuring, bỏ phần giữa
                    //     // console.log("l, v", l, v)
                    //     imgSrc = `${base_folder}/${l}/${v}/${item.keyframe_id}`; // mặc định
                    // }
                    const filename = item.keyframe_id
                    let imgSrc = `${base_folder}/${getFirstPart(filename)}/${getFirstTwoParts(filename)}/${filename}`; // mặc định

                    const imgTitle = `${item.keyframe_id}`;
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
                                    ...(showList[globalIndex]
                                    ? {
                                        bottom: "5px",
                                        right: "5px",
                                        p: "6px"
                                        }
                                    : {
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        }
                                    ),
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
                                    <VisibilityOffIcon sx={{ color: "black", fontSize: 25 }} />
                                )}
                            </IconButton>
                            
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                }}      
                            >
                                {
                                    !showList[globalIndex] && ignoredUsernames[globalIndex] && (
                                        <CustomAvatar name={ignoredUsernames[globalIndex] || "Unknown User"} />
                                    )
                                }
                            </Box>

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

                <FormControlLabel
                    label={`Ignore all page ${currentPage}`}
                    labelPlacement="top"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column", // 👈 label trên, checkbox dưới
                        textAlign: "center",
                        m: 1
                    }}
                    slotProps={{
                        typography: {
                            fontFamily: "monospace",
                            fontSize: "15px",
                            color:'green'
                        }
                    }}
                    control={
                        <Checkbox
                            checked={autoIgnore}
                            onChange={handleAutoIgnoreChange}
                            color="success"
                        />
                    }
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
