import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const checkSecuritySignature = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { signature } = req.headers;

        // Ensure security signature is provided
        if (!signature) {
            throw new Error('Security signature is missing.');
        }
        // Check if the security signature matches the predefined value
        if (signature !== process.env.SECURITY_SIGNATURE) {
            throw new Error('Invalid security signature.');
        }

        // Signature is valid, proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle errors
        res.status(401).json({ error: (error as Error).message }); // Cast 'error' to Error type
    }
};

export default checkSecuritySignature;
