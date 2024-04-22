import express from 'express';
import {
  createTransaction,
  getUserTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionsByDateRange,
} from '../controllers/transaction.controllers';
import checkSecuritySignature from '../middlewares/signature-all-api.middleware';
import { verifyToken } from '../middlewares/verify-jwt-token.middleware';

const transactionRouter = express.Router();

transactionRouter.use(checkSecuritySignature,verifyToken ); 
transactionRouter.post('/', createTransaction);
transactionRouter.get('/:user_id', getUserTransactions);
transactionRouter.put('/:id', updateTransaction);
transactionRouter.delete('/:id', deleteTransaction);
transactionRouter.get('/', getTransactionsByDateRange);

export default transactionRouter;