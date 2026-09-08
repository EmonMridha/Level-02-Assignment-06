import { Router } from "express";
import { userController } from "./users.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { googleLoginSchema, LoginZodSchema, registerSchema } from "./user.validation";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.post('/register', validateRequest(registerSchema), userController.createUser)
router.post('/login', validateRequest(LoginZodSchema), userController.loginUser)
router.get('/me', auth("ADMIN", "TECHNICIAN", "CUSTOMER"), userController.getMe)
router.post('/refresh-token', userController.refreshToken)
router.post("/logout", userController.logoutUser);
router.post('/google-login', validateRequest(googleLoginSchema), userController.googleLogin)
export const userRoutes = router