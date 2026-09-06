import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { createZoneSchema } from "./zone.validation";
import { zoneController } from "./zone.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.post('/', auth('ADMIN'), validateRequest(createZoneSchema), zoneController.createZone)
router.get('/', auth('ADMIN'), zoneController.getAllZones)

export const zoneRoutes = router