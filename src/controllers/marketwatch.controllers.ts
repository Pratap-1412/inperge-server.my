import { Request, Response } from 'express';
import { DestroyOptions } from 'sequelize';
import { ValidationError } from 'sequelize';
import MarketWatch from '../models/marketwatch.model';

// Create a new MarketWatch instance
export const addMarketWatch = async (req: Request, res: Response) => {
    try {
        const { stocks, company_name, instrument_type, isin_code, exchange, symbol, name, industry, series } = req.body;
        const marketWatch = await MarketWatch.create({ stocks, company_name, instrument_type, isin_code, exchange, symbol, name, industry, series });
        res.status(201).json(marketWatch);
    } catch (error: unknown) {
        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.errors });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};

// Get all MarketWatch instances
export const getAllMarketWatches = async (req: Request, res: Response) => {
    try {
        const marketWatches = await MarketWatch.findAll();
        res.status(200).json(marketWatches);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};

// Get a single MarketWatch instance by ID
export const getMarketWatchById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const marketWatch = await MarketWatch.findByPk(id);
        if (!marketWatch) {
            return res.status(404).json({ error: 'MarketWatch not found' });
        }
        res.status(200).json(marketWatch);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};

// Update a MarketWatch instance by ID
export const updateMarketWatchById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { company_name, instrument_type, isin_code, exchange, symbol, name, industry, series } = req.body;
        const [updated] = await MarketWatch.update(
            { company_name, instrument_type, isin_code, exchange, symbol, name, industry, series },
            { where: { id }, returning: true }
        );
        if (updated === 0) {
            return res.status(404).json({ error: 'MarketWatch not found' });
        }
        res.status(200).json(updated);
    } catch (error: unknown) {
        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.errors });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};

// Delete a MarketWatch instance by ID
export const deleteMarketWatchById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const options: DestroyOptions<MarketWatch> = {
            where: { id },
        };
        const deleted = await MarketWatch.destroy(options);
        if (deleted === 0) {
            return res.status(404).json({ error: 'MarketWatch not found' });
        }
        res.status(204).json();
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};