import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { DoctorService } from "./doctor.service";
import { Request, Response } from "express";

const getAllDoctor = catchAsync(
    async (req: Request, res: Response) => {
 
        const result = await DoctorService.getAllDoctors();

        sendResponse(res,{
            httpStatusCode: status.OK,
            success: true,      
            message: 'Doctor fetched successfully',
            data: result
        });
    }
)

export const DoctorController = {
    getAllDoctor
}