/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";
// import { CookieUtils } from "../../utils/cookie";
// import AppError from "../../errorHelpers/appError";
// import status from "http-status";
// import { jwtUtils } from "../../utils/jwt";
// import { envVars } from "../../config/env";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { SpecialtyValidation } from "./specialty.validation";

const router = Router();

// router.post('/specialties',SpecialtyController.createSpecialty);
router.post('/', 
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
multerUpload.single("file"),
validateRequest(SpecialtyValidation.createSpecialtyZodSchema),
SpecialtyController.createSpecialty);

router.get('/', SpecialtyController.getAllSpecialty);

// router.get('/', async (req:Request, res: Response, next: NextFunction) => {
//     try {
//         const accessToken = CookieUtils.getCookie(req, 'accessToken');

//         if (!accessToken) {
//             throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No access token provided.');
//         }

//         const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

//         if (!verifiedToken.success) {
//             throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! Invalid access token.');
//         }

//         if (verifiedToken.data!.role !== 'ADMIN') {
//             throw new AppError(status.FORBIDDEN, 'Forbidden access! you do not have permission to access this resource');
//         }

//         next();
//     } catch (error: any) {
//         next(error)
// }
// },SpecialtyController.getAllSpecialty);

router.delete('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialtyController.deleteSpecialty);

export const SpecialtyRoute = router