import { Request, Response } from 'express';
import Plans from '../models/plans.model';
import Sequelize from 'sequelize';

// Create a new plan
export const createPlan = async (req: Request, res: Response) => {
  try {
    const plan = await Plans.create(req.body, { fields: Object.keys(req.body) });
    res.status(201).json(plan);
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      return res.status(400).json({ error: error.errors.map((err) => err.message) });
    }
    res.status(500).json({ error: 'Internal Server Error' , err:error});
  }
};

// Get all plans
export const getAllPlans = async (req: Request, res: Response) => {
  try {
    const plans = await Plans.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } });
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a plan by ID
export const getPlanById = async (req: Request, res: Response) => {
  try {
    const plan = await Plans.findByPk(req.params.id, { attributes: { exclude: ['createdAt', 'updatedAt'] } });
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a plan
export const updatePlan = async (req: Request, res: Response) => {
  try {
    const plan = await Plans.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    await plan.update(req.body, { fields: Object.keys(req.body) });
    res.status(200).json(plan);
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      return res.status(400).json({ error: error.errors.map((err) => err.message) });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a plan
export const deletePlan = async (req: Request, res: Response) => {
  try {
    const plan = await Plans.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    await plan.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};