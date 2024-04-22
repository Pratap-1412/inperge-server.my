// controllers/balance.controller.ts
import { Request, Response } from 'express';
import Balance from '../models/balance.model';
import User from '../models/user.model';

// Create a new balance
export const createBalance = async (req: Request, res: Response) => {
  try {
    const { user_id, current_balance } = req.body;
    const balance = await Balance.create({ user_id, current_balance });
    res.status(201).json(balance);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create balance' });
  }
};

// Get balance for a user
export const getUserBalance = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const balance = await Balance.findOne({
      where: { user_id },
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }],
    });
    if (!balance) {
      return res.status(404).json({ error: 'Balance not found' });
    }
    res.status(200).json(balance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
};

// Update balance for a user
export const updateBalance = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const { current_balance } = req.body;
    const balance = await Balance.findOne({ where: { user_id } });
    if (!balance) {
      return res.status(404).json({ error: 'Balance not found' });
    }
    balance.current_balance = current_balance;
    balance.updatedAt = new Date();
    await balance.save();
    res.status(200).json(balance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update balance' });
  }
};