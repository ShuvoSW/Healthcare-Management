import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createDoctorZodSchema } from "./user.validation";



const router = Router();



router.post("/create-doctor", 
//     (req: Request, res: Response, next: NextFunction) => {
//     // console.log(req.body, "Before zod validation");
//     const parsedResult = createDoctorZodSchema.safeParse(req.body);

//     if (!parsedResult.success) {
//         // console.log("Zod Error", parsedResult.error);
//         next(parsedResult.error)
//     }

//     //sanitizing the data
//     req.body = parsedResult.data;

//     // console.log(req.body, "After zod validation");
//     next()
// }

validateRequest(createDoctorZodSchema)

, UserController.createDoctor);
// router.post("/create-admin", UserController.createDoctor);
// router.post("/create-superadmin", UserController.createDoctor);

export const UserRoutes = router;