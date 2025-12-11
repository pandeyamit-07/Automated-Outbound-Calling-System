// src/routes/callLogs.routes.js

import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as callLogsController from '../controllers/callLogs.controller.js';
import { verifyAdmin } from "../middleware/admin/adminAuthMiddleware.js";

const router = express.Router();

// ADMIN PROTECTED ROUTES
router.get('/status-count', verifyAdmin, asyncHandler(callLogsController.getStatusCount));
router.get('/completed-by-userinput', verifyAdmin, asyncHandler(callLogsController.getCompletedByUserInput));
router.get('/duration', verifyAdmin, asyncHandler(callLogsController.getByDuration));
router.get('/', verifyAdmin, asyncHandler(callLogsController.list));

export default router;
