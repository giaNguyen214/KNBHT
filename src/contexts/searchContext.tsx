import { createContext, useContext, useState, ReactNode } from "react";
import { SearchContextType, SearchResultContextType } from "@/types/Query";
import { useSearch } from "@/hooks/search"
import { SearchPayload } from "@/types/Search"

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("clip");

  return (
    <SearchContext.Provider value={{ query, setQuery, mode, setMode }}>
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
    return (
    <SearchResultContext.Provider value={{ results, searching, handleSearch }}>
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