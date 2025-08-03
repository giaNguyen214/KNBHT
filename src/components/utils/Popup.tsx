import { 
    Box,
    Alert
} from "@mui/material";
import { PopupAlertProps } from "@/types/Utils";

export default function PopupAlert({
  severity,
  message,
  closeModal,
}: PopupAlertProps) {
    
    return (
        <Box className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.6)] flex justify-center items-center z-[9999]" onClick={closeModal}>
            {/* <Box className="bg-white p-2 rounded-10 max-w-[200px] w-full" onClick={(e) => {e.stopPropagation()}}>
                <Alert severity={severity}>{message}</Alert>
            </Box> */}
            <Alert severity={severity}>{message}</Alert>
        </Box>
    )
}