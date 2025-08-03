import { axiosClient } from "./axiosClient";
import { API_CONFIG } from "@/constants/api";
import { SearchPayload} from "@/types/Search";


export const simpleSearch = async (searchPayload: SearchPayload) => {
    const payload = {
        text_query: searchPayload.text_query,
        mode: "hybrid",
        object_filters: searchPayload.object_filters || [],
        color_filters: searchPayload.color_filters || [],
        ocr_query: searchPayload.ocr_query,
        asr_query: searchPayload.asr_query,
        top_k: searchPayload.top_k
    };

    const response = await axiosClient.post(API_CONFIG.ENDPOINTS.SEARCH.SIMPLE, payload)
    
    // const response = await axiosClient.get("https://685aaeb59f6ef9611157681f.mockapi.io/dientoangroup/search")
    return response.data
}

export const temporalSearch = async (searchPayload: SearchPayload) => {
    const response = await axiosClient.post(API_CONFIG.ENDPOINTS.SEARCH.TEMPORAL, {
        searchPayload
    })
    return response.data
}