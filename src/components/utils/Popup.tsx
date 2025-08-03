import { 
    Box
} from "@mui/material";

export default function Popup(Content: any, closeModal: () => void) {
    
    return (
        <Box className="fixed top-0 left-0 w-full h-full vg-[rgba(0, 0, 0, 0.6)] flex justify-center items-center z-9999" onClick={closeModal}>
            <Box className="bg-white p-2 rounded-10 max-w-1000 w-full" onClick={(e) => {e.stopPropagation()}}>
                <Content/>
            </Box>
        </Box>
    )
}