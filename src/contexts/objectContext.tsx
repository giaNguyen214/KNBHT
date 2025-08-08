"use client"


import { createContext, useContext, useState, ReactNode } from "react";
import { ObjectContextType, CustomObject } from "@/types/Object";

const ObjectContext = createContext< ObjectContextType| undefined>(undefined);

export function ObjectProvider({ children }: { children: ReactNode }) {
    const [shapesOnCanvas, setShapesOnCanvas] = useState<CustomObject[]>([]);

    return (
        <ObjectContext.Provider value={{shapesOnCanvas, setShapesOnCanvas}}>
        {children}
        </ObjectContext.Provider>
    );
}

export function useObjectContext() {
  const ctx = useContext(ObjectContext);
  if (!ctx) {
    throw new Error("useObjectContext must be used within a ObjectProvider");
  }
  return ctx;
}