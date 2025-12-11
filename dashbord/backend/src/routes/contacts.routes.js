// src/routes/contacts.routes.js
import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as contactsController from '../controllers/contacts.controller.js';

const router = express.Router();

router.get('/status-count', asyncHandler(contactsController.getStatusCount));

export default router;
