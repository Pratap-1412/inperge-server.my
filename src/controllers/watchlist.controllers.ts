import { Request, Response } from 'express';
import WatchList from '../models/watchlist.model';

// Controller method for creating a new watchlist
export async function createWatchlist(req: Request, res: Response): Promise<void> {
  try {
    const { user_id, stocks } = req.body;

    // Create a new watchlist
    const watchlist = await WatchList.create({
      user_id,
      stocks,
    });

    res.status(201).json(watchlist);
  } catch (error) {
    console.error('Error creating watchlist:', error);
    res.status(500).json({ error: 'Error creating watchlist' });
  }
}

// Controller method for updating the array of instrument IDs in a watchlist
export async function updateWatchlist(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;
      const { stocks } = req.body;
  
      const watchlist = await WatchList.findOne({ where: { user_id } });
      if (!watchlist) {
        res.status(404).json({ error: 'Watchlist not found' });
        return;
      }
  
      watchlist.stocks = stocks;
      await watchlist.save();
  
      res.status(200).json(watchlist);
    } catch (error) {
      console.error('Error updating watchlist:', error);
      res.status(500).json({ error: 'Error updating watchlist' });
    }
  }
  
  export async function deleteFromWatchlist(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;
      const { stocks } = req.body;
  
      const watchlist = await WatchList.findOne({ where: { user_id } });
      if (!watchlist) {
        res.status(404).json({ error: 'Watchlist not found' });
        return;
      }
  
      watchlist.stocks = watchlist.stocks.filter((value: string) => !stocks.includes(value));
      await watchlist.save();
  
      res.status(200).json(watchlist);
    } catch (error) {
      console.error('Error deleting from watchlist:', error);
      res.status(500).json({ error: 'Error deleting from watchlist' });
    }
  }

  export async function addSymbolToWatchlist(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;
      const { stocks: symbolArray } = req.body;

      const watchlist = await WatchList.findOne({ where: { user_id } });
      if (!watchlist) {
        res.status(404).json({ error: 'Watchlist not found' });
        return;
      }

      const alreadyAddedstocks = watchlist.stocks ? watchlist.stocks.filter((symbol: string) => symbolArray.includes(symbol)) : [];
      if (alreadyAddedstocks.length === symbolArray.length) {
        res.status(200).json({ ...watchlist, message: `All stocks already added: ${alreadyAddedstocks.join(', ')}` , allSymbolExists:true});
        return;
      }

      const newstocks = symbolArray.filter((symbol: string) => !alreadyAddedstocks.includes(symbol));

      watchlist.stocks = [...(watchlist.stocks || []), ...newstocks];
      await watchlist.save();

      const msg = alreadyAddedstocks.length > 0
        ? `Symbol(s) already added: ${alreadyAddedstocks.join(', ')}. Added: ${newstocks.join(', ')}`
        : `Added: ${newstocks.join(', ')}`;
      res.status(200).json({ ...watchlist, message: msg });
    } catch (error) {
      console.error('Error adding symbol to watchlist:', error);
      res.status(500).json({ error: 'Error adding symbol to watchlist' });
    }
  }
  
  export async function getstocksByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;

      const watchlist = await WatchList.findOne({ where: { user_id } });
      if (!watchlist) {
        res.status(404).json({ error: 'Watchlist not found' });
        return;
      }

      res.status(200).json({addedstocks:watchlist.stocks});
    } catch (error) {
      console.error('Error getting stocks by user id:', error);
      res.status(500).json({ error: 'Error getting stocks by user id' });
    }
  }



  
  
