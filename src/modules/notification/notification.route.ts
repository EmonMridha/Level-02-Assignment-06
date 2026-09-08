import { Router } from "express";
import { notificationController } from "./notification.controller";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { createNotificationSchema } from "./notification.validate";

const router = Router();

router.post('/', auth('ADMIN'), validateRequest(createNotificationSchema), notificationController.createNotification)

router.get('/', notificationController.getNotification)

router.patch("/read-all", auth('ADMIN', 'CUSTOMER', 'OPERATOR'), notificationController.markAllAsRead
);

router.patch("/:id/read", auth('ADMIN', 'CUSTOMER', 'OPERATOR'), notificationController.markAsRead
);

export const notificationRoutes = router