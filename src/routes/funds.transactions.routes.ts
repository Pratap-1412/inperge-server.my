// routes/fundsTransactionRoutes.ts
import express, { Router } from 'express';
import * as fundsTransactionController from '../controllers/funds.transactions.contollers';
import checkSecuritySignature from '../middlewares/signature-all-api.middleware';
import { verifyToken } from '../middlewares/verify-jwt-token.middleware';

const fundsTransactionRouter: Router = express.Router();

fundsTransactionRouter.use(checkSecuritySignature,verifyToken); // Middleware to verify email for all auth routes


// Get all funds transactions
fundsTransactionRouter.get('/', fundsTransactionController.getAllFundsTransactions);

// Create a new funds transaction
fundsTransactionRouter.post('/', fundsTransactionController.createFundsTransaction);

// Get a single funds transaction by ID
fundsTransactionRouter.get('/:id', fundsTransactionController.getFundsTransactionById);

// Delete a funds transaction by ID
fundsTransactionRouter.delete('/:id', fundsTransactionController.deleteFundsTransactionById);

export default fundsTransactionRouter;
