export type SearchPayload = {
    text_query: string,
    mode: string,
    object_filters: Record<string, [number[], number[]][]>,
    color_filters: [number, number, number][],
    ocr_query: string,
    asr_query: string,
    top_k: number,
    user_query: string
}