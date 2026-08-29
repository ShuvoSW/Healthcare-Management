import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";

import status from "http-status";
import { RAGService } from "./rag.service";
import { sendResponse } from "../../shared/sendResponse";
import { redisService } from "../../lib/redis";

const ragService = new RAGService()

const getStats = catchAsync(async(req: Request, res: Response) => {
    const result = await ragService.getStats();

     sendResponse(res,{
        success: true,
        httpStatusCode: status.OK,
        message: "RAG stats retrieved successfully",
        data: result
    })
})

const ingestDoctors = catchAsync(async(req: Request, res: Response) => {
    const result = await ragService.ingestDoctorsData();

    sendResponse(res,{
        success: true,
        httpStatusCode: status.OK,
        message: "Doctor data ingestion completed",
        data: result
    })

})

const queryRag = catchAsync(async(req: Request, res: Response)=>{
    const {query, limit, sourceType} = req.body;

    if (!query) {
        return sendResponse(res, {
            success: false,
            httpStatusCode: status.BAD_REQUEST,
            message: "Query is required",
        });
    }

    //generate cache key from query params
    const cacheKey = `rag:query:${query}:${limit??5}:${sourceType || "all"}`;

    try {
        const cachedResult = await redisService.get(cacheKey);

        if(cachedResult){
            // cache-hit
            const parseData = JSON.parse(cachedResult);

            sendResponse(res, {
                success: true,
                httpStatusCode: status.OK,
                message: "Answer retrieved from cache",
                data: parseData,
            });
            return;
        }
    } catch (err) {
        console.warn("Cache read error, proceeding with normal processing: ", err);
    }

    //cache - miss

    const result = await ragService.generateAnswer(query, limit?? 5, sourceType, true);

    try {
        // store cache with 10 min(600 sec) TTL
        await redisService.set(cacheKey, result, 600);
    } catch (error) {
        console.warn("cache write error: ", error);
    }

      sendResponse(res,{
        success: true,
        httpStatusCode: status.OK,
        message: "Doctor data ingestion completed",
        data: result
    })
})

export const RagController = {
    getStats,
    ingestDoctors,
    queryRag
}