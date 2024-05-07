// routes/balance.routes.ts
import express, { Router } from 'express';
import getSuggestions from './truedata.controllers';

const trueDataRouter: Router = express.Router();

trueDataRouter.get('/get-suggestions', getSuggestions);

export default trueDataRouter;