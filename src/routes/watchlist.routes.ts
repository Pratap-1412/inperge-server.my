import express from 'express';
import { createWatchlist, updateWatchlist, deleteFromWatchlist, addSymbolToWatchlist, getstocksByUserId } from '../controllers/watchlist.controllers';

const watchlistRouter = express.Router();

// Define routes
watchlistRouter.post('/', createWatchlist);
watchlistRouter.put('/stocks/:user_id', updateWatchlist);
watchlistRouter.get('/stocks/:user_id', getstocksByUserId);
watchlistRouter.delete('/remove-stocks/:user_id', deleteFromWatchlist);
watchlistRouter.patch('/add-stocks/:user_id', addSymbolToWatchlist);

export default watchlistRouter;
