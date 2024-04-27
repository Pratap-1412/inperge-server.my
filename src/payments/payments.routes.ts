import express from 'express';
import { createOrder } from './payment.controller';

const router = express.Router();

router.post('/orders', createOrder);

export default router;