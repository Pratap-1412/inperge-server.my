// routes/fundsTransactionRoutes.ts
import express, { Router } from 'express';
import { createFundsTransaction, deleteFundsTransactionById, getAllFundsTransactions, getFundsTransactionById, getFundsTransactionsByUserId } from '../controllers/funds.transactions.contollers';
import checkSecuritySignature from '../middlewares/signature-all-api.middleware';
import { verifyToken } from '../middlewares/verify-jwt-token.middleware';

const fundsTransactionRouter: Router = express.Router();

fundsTransactionRouter.use(checkSecuritySignature,verifyToken); // Middleware to verify email for all auth routes


// Get all funds transactions
fundsTransactionRouter.get('/', getAllFundsTransactions);

// Create a new funds transaction
fundsTransactionRouter.post('/', createFundsTransaction);

// Get a single funds transaction by ID
fundsTransactionRouter.get('/:id', getFundsTransactionById);

// Delete a funds transaction by ID
fundsTransactionRouter.delete('/:id', deleteFundsTransactionById);

// Get a funds transaction by user ID
fundsTransactionRouter.get('/userid/:user_id', getFundsTransactionsByUserId);

export default fundsTransactionRouter;
