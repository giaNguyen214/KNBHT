export type SearchPayload = {
    text_query: string,
    mode: string,
    object_filters: string[],
    color_filters: string[],
    ocr_query: string,
    asr_query: string,
    top_k: number
}