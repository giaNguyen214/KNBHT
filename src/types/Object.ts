import { DraggableData } from "react-rnd";

export type CustomObject = {
    id: number;
    name: string;
    x_min: number;
    x_max: number;
    y_min: number;
    y_max: number;
    color: string;    
    width: number;
    height: number;
}

export type ObjectListProps = {
    objects: CustomObject[];
    handleAddShape: (shapeTemplate: any) => void;
    shapesOnCanvas: CustomObject[];
}

export type ObjectContextType = {
    shapesOnCanvas: CustomObject[];
    setShapesOnCanvas: React.Dispatch<React.SetStateAction<CustomObject[]>>;
}

export type CanvasEditorProps = {
    shapesOnCanvas: CustomObject[];
    setShapesOnCanvas: React.Dispatch<React.SetStateAction<CustomObject[]>>;
    handleDragStop: (
        data: DraggableData, 
        shape: CustomObject,
        setShapesOnCanvas: React.Dispatch<React.SetStateAction<CustomObject[]>>
    ) => void;
    handleResizeStop: (
        ref: HTMLElement, 
        position: { x: number; y: number }, 
        shape:CustomObject
    ) => void
    handleDeleteShape: (shape: CustomObject) => void, 
}