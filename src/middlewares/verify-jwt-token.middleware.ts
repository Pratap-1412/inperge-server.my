import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel';

// Define a custom interface extending the Express Request interface
interface AuthenticatedRequest extends Request {
    user?: User; // Add a user property to store user information
}

export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authorizationHeader = req.headers.authorization;

    // Check if Authorization header is provided
    if (!authorizationHeader) {
        res.status(401).json({ error: 'Access denied. Token is required.' });
        return;
    }

    // Split the header value by space
    const [scheme, token] = authorizationHeader.split(' ');

    // Check if the scheme is 'Bearer' and if token exists
    if (scheme !== 'Bearer' || !token) {
        res.status(401).json({ error: 'Invalid Authorization header format.' });
        return;
    }


    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || '') as { userId: string };

        // Check if user exists in the database
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            res.status(401).json({ error: 'User not found. Invalid token.' });
            return;
        }

        // Attach the user object to the request for further use
        req.user = user;

        // Token is valid, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Invalid token.' });
    }
};