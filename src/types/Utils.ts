export type PopupAlertProps = {
    severity: "success" | "info" | "warning" | "error";
    message: string;
    closeModal: () => void;
};


export type LoginProps = {
    closeModal: () => void;
};