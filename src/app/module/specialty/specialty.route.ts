import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";

const router = Router();

// router.post('/specialties',SpecialtyController.createSpecialty);
router.post('/',SpecialtyController.createSpecialty);
router.get('/',SpecialtyController.getAllSpecialty);
router.delete('/:id',SpecialtyController.deleteSpecialty);

export const SpecialtyRoute = router