/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { SpecialtyService } from './specialty.service';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';



// const createSpecialty = async (req: Request, res: Response) => {
//     try {
//         const payload = req.body;

//     const result = await SpecialtyService.createSpecialty(payload);
//     res.status(201).json({
//         success: true,
//         message: 'Specialty created successfully',
//         data: result
//     });
//     } catch (error: any) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to create specialty',
//             error: error.message
//         });
//     }


// }

const createSpecialty = catchAsync(
    async (req: Request, res: Response) => {
        console.log(req.body);
        console.log(req.file);
        const payload = {
            ...req.body,
            icon: req.file?.path
        };
        const result = await SpecialtyService.createSpecialty(payload);
        // res.status(201).json({
        //     success: true,
        //     message: 'Specialty created successfully',
        //     data: result
        // });
        sendResponse(res,{
            httpStatusCode: 201,
            success: true,
            message: 'Specialty created successfully',
            data: result
        });
    
    }
)

//   const getAllSpecialty = async (req: Request, res: Response) => {
//         try {
//             const specialties = await SpecialtyService.getAllSpecialty();
//             res.status(200).json({
//                 success: true,
//                 message: 'Specialties retrieved successfully',
//                 data: specialties
//             });
//         } catch (error: any) {
//               console.log(error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to create specialty',
//             error: error.message
//         });
//         }
//     }



const getAllSpecialty = catchAsync(
    async (req: Request, res: Response) => {
        const result = await SpecialtyService.getAllSpecialty();
        // res.status(200).json({
        //     success: true,
        //     message: 'Specialties retrieved successfully',
        //     data: result
        // });
        sendResponse(res,{
            httpStatusCode: 200,
            success: true,              
            message: 'Specialties retrieved successfully',
            data: result
        });
    }
)

//   const deleteSpecialty = async (req: Request, res: Response) => {
//         try {
//           const {id} = req.params;

//           const result = await SpecialtyService.deleteSpecialty(id as string);
//             res.status(200).json({
//                 success: true,
//                 message: 'Specialty deleted successfully',
//                 data: result
//             });
//         } catch (error: any) {
//               console.log(error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to create specialty',
//             error: error.message
//         });
//         }
//     }

const deleteSpecialty = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await SpecialtyService.deleteSpecialty(id as string);
        // res.status(200).json({
        //     success: true,
        //     message: 'Specialty deleted successfully',
        //     data: result
        // });
           sendResponse(res,{
            httpStatusCode: 200,
            success: true,              
            message: 'Specialties deleted successfully',
            data: result
        });
    }
)

export const SpecialtyController = {
    createSpecialty,
    getAllSpecialty,
    deleteSpecialty
}