import React from "react";
import { CustomObject } from "./Object";

export type ColorPalletePickerProps = {
    color: string;
    setColor: React.Dispatch<React.SetStateAction<string>>
    shapesOnCanvas: CustomObject[];
    circleMode: boolean;
    setCircleMode: React.Dispatch<React.SetStateAction<boolean>>;
}