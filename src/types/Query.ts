import { SearchPayload } from "./Search";

export type Query = {
    query: string;
    object: string;
    color: string;
    ocr: string;
    asr: string;
}

export type Item = {
    img: string;
    title: string
}

export type QueryProps = {  
    handleSearch: (searchPayload: SearchPayload) => void;
    searching: boolean
}


export type ImageGalleryProps = {
  results: any[]; 
  cols: number;
  gap?: number;
  className?: string
};

export type SearchContextType = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
};

export type SearchResultContextType = {
  results: any[];
  searching: boolean;
  handleSearch: (searchPaylod: SearchPayload) => void
};