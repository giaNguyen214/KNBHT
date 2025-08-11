import { axiosClient } from "./axiosClient";
import { API_CONFIG } from "@/constants/api";
import { SearchPayload} from "@/types/Search";

export const simpleSearch = async (searchPayload: SearchPayload) => {
    const payload = {
        text_query: searchPayload.text_query,
        mode: "hybrid",
        object_filters: {},
        color_filters: searchPayload.color_filters || [],
        ocr_query: searchPayload.ocr_query,
        asr_query: searchPayload.asr_query,
        top_k: searchPayload.top_k
    };

    const username = localStorage.getItem("username") || "Unknown User";


    if (process.env.NEXT_PUBLIC_MODE === "test" && username == "Gia Nguyên") {
        const response = await axiosClient.get("https://68999f23fed141b96ba01c14.mockapi.io/AIC")
        return response.data
    }
    if (process.env.NEXT_PUBLIC_MODE === "test" && username == "Duy Bảo") {
        const response = await axiosClient.get("https://685aaeb59f6ef9611157681f.mockapi.io/dientoangroup/search")
        return response.data
    }
    if (process.env.NEXT_PUBLIC_MODE === "test" && username == "Lê Hiếu") {
        const response = await axiosClient.get("https://685aaeb59f6ef9611157681f.mockapi.io/dientoangroup/gianguyen")
        return response.data
    }

    console.log("payload", payload)
    const response = await axiosClient.post(API_CONFIG.ENDPOINTS.SEARCH.SIMPLE, payload)
    return response.data
}

export const temporalSearch = async (searchPayload: SearchPayload) => {
    const response = await axiosClient.post(API_CONFIG.ENDPOINTS.SEARCH.TEMPORAL, {
        searchPayload
    })
    return response.data
}