import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { createZoneSchema } from "./zone.validation";
import { zoneController } from "./zone.controller";

const router = Router();

router.post('/', validateRequest(createZoneSchema), zoneController.createZone)

export const zoneRoutes = router