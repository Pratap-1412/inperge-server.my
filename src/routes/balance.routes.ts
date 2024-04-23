// routes/balance.routes.ts
import express, { Router } from 'express';
import {
  addBalance,
  getUserBalance,
  updateBalance,
} from '../controllers/balance.controllers';
import { verifyToken } from '../middlewares/verify-jwt-token.middleware';
import checkSecuritySignature from '../middlewares/signature-all-api.middleware';

const balanceRouter: Router = express.Router();

balanceRouter.use(checkSecuritySignature,verifyToken); // Middleware to verify email for all auth routes
balanceRouter.post('/', addBalance);
balanceRouter.get('/:user_id', getUserBalance);
balanceRouter.put('/:user_id', updateBalance);

export default balanceRouter;