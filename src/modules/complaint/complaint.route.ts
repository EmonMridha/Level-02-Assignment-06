import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { complaintController } from "./complaint.controller";
import { createComplaintSchema } from "./complaint.validation";

const router = Router();

router.post('/', auth('ADMIN', 'CUSTOMER', 'OPERATOR'), validateRequest(createComplaintSchema), complaintController.createComplaint)
router.get('/', auth('ADMIN', 'CUSTOMER', 'OPERATOR'), complaintController.getAllComplaints)
router.get('/:id', auth('ADMIN', 'CUSTOMER', 'OPERATOR'), complaintController.getComplaintById)

export const complaintRoutes = router