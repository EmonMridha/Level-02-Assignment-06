import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { adminController } from "./admin.controller";
import { updateUserStatusSchema } from "./admin.validate";


const router = Router();

router.patch('/:id/status', auth('ADMIN', 'CUSTOMER', 'OPERATOR'), validateRequest(updateUserStatusSchema), adminController.updateUserStatus)


export const adminRoutes = router