import express from 'express';
import { createWatchlist, updateWatchlist, deleteFromWatchlist, addSymbolToWatchlist } from '../controllers/watchlist.controllers';

const watchlistRouter = express.Router();

// Define routes
watchlistRouter.post('/', createWatchlist);
watchlistRouter.put('/symbols/:user_id', updateWatchlist);
watchlistRouter.delete('/remove-symbols/:user_id', deleteFromWatchlist);
watchlistRouter.patch('/add-symbols/:user_id', addSymbolToWatchlist);

export default watchlistRouter;
