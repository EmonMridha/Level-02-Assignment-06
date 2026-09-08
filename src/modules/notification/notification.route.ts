import { Router } from "express";
import { notificationController } from "./notification.controller";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.get('/', notificationController.getNotification)

router.patch("/read-all", auth('ADMIN', 'CUSTOMER', 'OPERATOR'), notificationController.markAllAsRead
);

router.patch("/:id/read", auth('ADMIN', 'CUSTOMER', 'OPERATOR'), notificationController.markAsRead
);

export const notificationRoutes = router