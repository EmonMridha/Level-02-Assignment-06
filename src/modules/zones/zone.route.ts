import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { createZoneSchema, updateZoneSchema } from "./zone.validation";
import { zoneController } from "./zone.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.post('/', auth('ADMIN'), validateRequest(createZoneSchema), zoneController.createZone)
router.get('/', auth('ADMIN'), zoneController.getAllZones)
router.get('/:id', auth('ADMIN'), zoneController.getZoneById)
router.patch('/:id', auth('ADMIN'), validateRequest(updateZoneSchema), zoneController.updateZone)
router.delete(
    "/:id",
    auth("ADMIN"),
    zoneController.deleteZone
);

export const zoneRoutes = router