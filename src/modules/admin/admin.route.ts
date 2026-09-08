import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { adminController } from "./admin.controller";
import { updateUserStatusSchema } from "./admin.validate";


const router = Router();

router.patch('/:id/status', auth('ADMIN', 'CUSTOMER', 'TECHNICIAN'), validateRequest(updateUserStatusSchema), adminController.updateUserStatus)

router.get("/users", auth('ADMIN'), adminController.getAllUsers
);


export const adminRoutes = router