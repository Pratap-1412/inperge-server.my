import { Request, Response } from 'express';
import razorpay from './razorpay';

// Create order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const amount = req.body.amount * 100;
    const order = await razorpay.orders.create({ amount, currency: 'INR' });
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating order' });
  }
};