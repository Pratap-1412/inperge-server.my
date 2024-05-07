import express from 'express';
import {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
} from '../controllers/plans.controllers'
import checkSecuritySignature from '../middlewares/signature-all-api.middleware';
import { verifyToken } from '../middlewares/verify-jwt-token.middleware';

const planRouter = express.Router();
// planRouter.use(checkSecuritySignature,verifyToken); // Middleware to verify email for all auth routes


// Create a new plan
planRouter.post('/', createPlan);

// Get all plans
planRouter.get('/', getAllPlans);

// Get a plan by ID
planRouter.get('/:id', getPlanById);

// Update a plan
planRouter.put('/:id', updatePlan);

// Delete a plan
planRouter.delete('/:id', deletePlan);

export default planRouter;