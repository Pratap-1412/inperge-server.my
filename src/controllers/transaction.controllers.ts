import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Transaction from '../models/transaction.model';
import User from '../models/user.model';

// Create a new transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { user_id, transaction_type, amount, transaction_date, description, asset } = req.body;
    const transaction = await Transaction.create({ user_id, transaction_type, amount, transaction_date, description, asset });
    res.status(201).json(transaction);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to create transaction', failed: true });
  }
};

// Get all transactions for a user
export const getUserTransactions = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const transactions = await Transaction.findAll({
      where: { user_id },
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }],
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Update a transaction
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, transaction_date, description, asset } = req.body;
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    transaction.amount = amount;
    transaction.transaction_date = transaction_date;
    transaction.description = description;
    transaction.asset = asset;
    await transaction.save();
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

// Delete a transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    await transaction.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

// Get transactions for a date range
export const getTransactionsByDateRange = async (req: Request, res: Response) => {
  try {
    const { user_id, startDate, endDate } = req.query;
    const transactions = await Transaction.findAll({
      where: {
        user_id,
        transaction_date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};