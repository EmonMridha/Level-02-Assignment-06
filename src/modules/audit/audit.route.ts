import { Router } from "express";

import { auditLogController } from "./audit.controlle";
import { auth } from "../../middleware/checkAuth";


const router = Router();


router.get('/', auth('ADMIN'), auditLogController.getAuditLogs)


export const auditLogRoutes = router