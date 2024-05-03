// controllers/balance.controller.ts
import { Request, Response } from 'express';
import Balance from '../models/funds.model';
import User from '../models/user.model';
import Plans from '../models/plans.model';

// Create a new balance
export const addBalance = async (req: Request, res: Response) => {
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
    });
    if (!balance) {
      return res.status(404).json({ error: 'Balance not found' });
    }
    res.status(200).json(balance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch balance', err:error });
  }
};

// Update balance for a user
export const updateBalance = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    let { funds } = req.body;
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const planId = user.plan_id;
    if (!planId) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    const plan = await Plans.findByPk(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    const balance = await Balance.findOne({ where: { user_id } });
    if (!balance) {
      return res.status(404).json({ error: 'Balance not found' });
    }
    funds = Number(funds);
    balance.current_balance = Number(balance.current_balance);
    if ((balance.current_balance + funds) <= plan.amount) {
      balance.current_balance += funds;
    } else {
      return res.status(400).json({ error: 'Entered amount is greater than available funds' });
    }
    balance.updatedAt = new Date();
    await balance.save();
    res.status(200).json(balance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update balance' });
  }
};
