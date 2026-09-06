import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { outageController } from "./outage.contorller";
import { validateRequest } from "../../middleware/validateRequest";
import { createOutageSchema, updateOutageSchema } from "./outage.validate";

const router = Router();

router.post('/', auth('ADMIN'),validateRequest(createOutageSchema), outageController.createOutage)
router.get('/', auth('ADMIN', 'CUSTOMER', 'OPERATOR'), outageController.getAllOutages)
router.get('/:id', auth('ADMIN', 'CUSTOMER', 'OPERATOR'), outageController.getOutageById)
router.patch('/:id', auth('ADMIN', 'CUSTOMER', 'OPERATOR'),validateRequest(updateOutageSchema), outageController.updateOutage)

export const outageRoutes = router