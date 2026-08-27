import { httpClient } from "@/lib/axios/httpClient";

export interface IRagQueryPayload {
    query: string,
    limit?: number,
    sourceType?: string
}

export const queryRagService = async (payload: IRagQueryPayload) => {
    const response = await httpClient.post("/rag/query", payload);
    return response;
}
export const ingestDoctorServices = async () => {
    const response = await httpClient.post("/rag/query", {});
    return response;
}