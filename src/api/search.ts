import { axiosClient } from "./axiosClient";
import { API_CONFIG } from "@/constants/api";
import { SearchPayload} from "@/types/Search";

export const simpleSearch = async (searchPayload: SearchPayload) => {
    // const response = await axiosClient.post(API_CONFIG.ENDPOINTS.SEARCH.SIMPLE, {
    //    searchPayload
    // })
    
    const response = await axiosClient.get("https://685aaeb59f6ef9611157681f.mockapi.io/dientoangroup/search")
    return response.data
}

export const temporalSearch = async (searchPayload: SearchPayload) => {
    const response = await axiosClient.post(API_CONFIG.ENDPOINTS.SEARCH.TEMPORAL, {
        searchPayload
    })
    return response.data
}