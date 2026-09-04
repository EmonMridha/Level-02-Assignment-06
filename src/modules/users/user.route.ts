import { Router } from "express";
import { userController } from "./users.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { LoginZodSchema, registerSchema } from "./user.validation";

const router = Router();

router.post('/register', validateRequest(registerSchema), userController.createUser)
router.post('/login', validateRequest(LoginZodSchema),userController.loginUser)

export const userRoutes = router