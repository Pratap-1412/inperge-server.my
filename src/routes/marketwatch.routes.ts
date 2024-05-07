import express from 'express';
import {
  getAllMarketWatches,
  getMarketWatchById,
  updateMarketWatchById,
  deleteMarketWatchById,
  addMarketWatch,
} from '../controllers/marketwatch.controllers';
import { verifyToken } from '../middlewares/verify-jwt-token.middleware';
import checkSecuritySignature from '../middlewares/signature-all-api.middleware';

const marketWatchRouter = express.Router();

// marketWatchRouter.use(checkSecuritySignature,verifyToken );

marketWatchRouter.post('/', addMarketWatch);
marketWatchRouter.get('/', getAllMarketWatches);
marketWatchRouter.get('/:id', getMarketWatchById);
marketWatchRouter.put('/:id', updateMarketWatchById);
marketWatchRouter.delete('/:id', deleteMarketWatchById);

export default marketWatchRouter;