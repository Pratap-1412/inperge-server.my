// controllers/fundsTransaction.controller.ts
import { Request, Response } from 'express';
import FundsTransaction  from '../models/funds.transactions.model';
import User from '../models/user.model';
import Plan from '../models/plans.model'

// Get all funds transactions
export const getAllFundsTransactions = async (req: Request, res: Response) => {
  try {
    const fundsTransactions = await FundsTransaction.findAll({
      include: [
        { model: User, as: 'user' }, // Include associated user
        { model: Plan, as: 'plan' }  // Include associated plan
      ]
    });
    res.json(fundsTransactions);
  } catch (error) {
    console.error('Error getting funds transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new funds transaction
export const createFundsTransaction = async (req: Request, res: Response) => {
  const { user_id, plan_id, razorpay_order_id, razorpay_payment_id, description } = req.body;
  try {
    const fundsTransaction = await FundsTransaction.create({
      user_id,
      plan_id,
      razorpay_order_id,
      razorpay_payment_id,
      description
    });
    res.status(201).json(fundsTransaction);
  } catch (error) {
    console.error('Error creating funds transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single funds transaction by ID
export const getFundsTransactionById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const fundsTransaction = await FundsTransaction.findByPk(id, {
      include: [
        { model: User, as: 'user' }, // Include associated user
        { model: Plan, as: 'plan' }  // Include associated plan
      ]
    });
    if (!fundsTransaction) {
      return res.status(404).json({ error: 'Funds transaction not found' });
    }
    res.json(fundsTransaction);
  } catch (error) {
    console.error('Error getting funds transaction by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a funds transaction by ID
export const deleteFundsTransactionById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const fundsTransaction = await FundsTransaction.findByPk(id);
    if (!fundsTransaction) {
      return res.status(404).json({ error: 'Funds transaction not found' });
    }
    await fundsTransaction.destroy();
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    console.error('Error deleting funds transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all funds transactions by user_id
export const getFundsTransactionsByUserId = async (req: Request, res: Response) => {
  const user_id = req.params.user_id; 
  try {
    const fundsTransactions = await FundsTransaction.findAll({
      where: { user_id }, // Filter by user_id
      include: [
        { model: User, as: 'user' }, // Include associated user
        { model: Plan, as: 'plan' }  // Include associated plan
      ]
    });
    if (!fundsTransactions || fundsTransactions.length === 0) {
      return res.status(404).json({ error: 'No funds transactions found for this user' });
    }
    res.json(fundsTransactions);
  } catch (error) {
    console.error('Error getting funds transactions by user_id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

