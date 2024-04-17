import { Request, Response, NextFunction } from 'express';

export const handleBadJSONRequest = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
        // Bad request due to invalid JSON
        return res.status(400).json({ error: 'Bad request. Invalid JSON.' });
    }
    
    // Pass the error to the next middleware or default error handler
    next(err);
};
