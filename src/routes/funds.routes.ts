// routes/balance.routes.ts
import express, { Router } from 'express';
import {
  addBalance,
  getUserBalance,
  updateBalance,
} from '../controllers/funds.controllers';
import { verifyToken } from '../middlewares/verify-jwt-token.middleware';
import checkSecuritySignature from '../middlewares/signature-all-api.middleware';

const fundsRouter: Router = express.Router();

fundsRouter.use(checkSecuritySignature,verifyToken); // Middleware to verify email for all auth routes
fundsRouter.post('/', addBalance);
fundsRouter.get('/:user_id', getUserBalance);
fundsRouter.patch('/:user_id', updateBalance);

export default fundsRouter;