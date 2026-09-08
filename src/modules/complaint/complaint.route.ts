import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { complaintController } from "./complaint.controller";
import { createComplaintSchema, updateComplaintSchema } from "./complaint.validation";

const router = Router();

router.post('/', auth('ADMIN', 'CUSTOMER', 'TECHNICIAN'), validateRequest(createComplaintSchema), complaintController.createComplaint)
router.get('/', auth('ADMIN', 'CUSTOMER', 'TECHNICIAN'), complaintController.getAllComplaints)
router.get('/:id', auth('ADMIN', 'CUSTOMER', 'TECHNICIAN'), complaintController.getComplaintById)
router.patch('/:id', auth('ADMIN', 'CUSTOMER', 'TECHNICIAN'), validateRequest(updateComplaintSchema), complaintController.updateComplaint)


export const complaintRoutes = router