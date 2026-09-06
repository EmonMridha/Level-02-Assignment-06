import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { outageController } from "./outage.contorller";

const router = Router();

router.post('/', auth('ADMIN'), outageController.createOutage)
router.get('/', auth('ADMIN', 'CUSTOMER', 'OPERATOR'),outageController.getAllOutages)
router.get('/:id', auth('ADMIN', 'CUSTOMER', 'OPERATOR'),outageController.getOutageById)

export const outageRoutes = router