import { Router } from "express";
import { userController } from "./users.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { LoginZodSchema, registerSchema } from "./user.validation";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.post('/register', validateRequest(registerSchema), userController.createUser)
router.post('/login', validateRequest(LoginZodSchema),userController.loginUser)
router.get('/me', auth("ADMIN","OPERATOR","CUSTOMER"),userController.getMe)
router.post('/refresh-token', userController.refreshToken)
router.post("/logout", userController.logoutUser);
export const userRoutes = router