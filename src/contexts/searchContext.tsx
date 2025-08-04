"use client"

import { createContext, useContext, useState, ReactNode } from "react";
import { SearchContextType, SearchResultContextType } from "@/types/Query";
import { useSearch } from "@/hooks/search"
import { SearchPayload } from "@/types/Search"
import { useEffect } from "react";
const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("clip");
  const [queryName, setQueryName] = useState("")

  const [dataSource, setDataSource] = useState("");
  // Lấy localStorage khi chạy ở client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const username = localStorage.getItem("username") ?? "";
      setDataSource(username);
    }
  }, []);
  
  

  return (
    <SearchContext.Provider value={{ query, setQuery, mode, setMode, queryName, setQueryName, dataSource, setDataSource }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return ctx;
}



const SearchResultContext = createContext<SearchResultContextType | undefined>(undefined);

export function SearchResultProvider({ children }: { children: ReactNode }) {
    const { results, searching, search } = useSearch();
    const handleSearch = (searchPayload: SearchPayload) => {
        search("simple", searchPayload);
    };
    const [cols, setCols] = useState<number | "">("")
    return (
    <SearchResultContext.Provider value={{ results, searching, handleSearch, cols, setCols }}>
      {children}
    </SearchResultContext.Provider>
  );
}

export function useSearchResultContext() {
  const ctx = useContext(SearchResultContext);
  if (!ctx) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return ctx;
}