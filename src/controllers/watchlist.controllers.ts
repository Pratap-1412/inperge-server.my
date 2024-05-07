import { Request, Response } from 'express';
import WatchList from '../models/watchlist.model';

// Controller method for creating a new watchlist
export async function createWatchlist(req: Request, res: Response): Promise<void> {
  try {
    const { user_id, symbols } = req.body;

    // Create a new watchlist
    const watchlist = await WatchList.create({
      user_id,
      symbols,
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
      const { symbols } = req.body;
  
      const watchlist = await WatchList.findOne({ where: { user_id } });
      if (!watchlist) {
        res.status(404).json({ error: 'Watchlist not found' });
        return;
      }
  
      watchlist.symbols = symbols;
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
      const { symbols } = req.body;
  
      const watchlist = await WatchList.findOne({ where: { user_id } });
      if (!watchlist) {
        res.status(404).json({ error: 'Watchlist not found' });
        return;
      }
  
      watchlist.symbols = watchlist.symbols.filter((value: string) => !symbols.includes(value));
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
      const { symbols: symbolArray } = req.body;

      const watchlist = await WatchList.findOne({ where: { user_id } });
      if (!watchlist) {
        res.status(404).json({ error: 'Watchlist not found' });
        return;
      }

      const alreadyAddedSymbols = watchlist.symbols ? watchlist.symbols.filter((symbol: string) => symbolArray.includes(symbol)) : [];
      if (alreadyAddedSymbols.length === symbolArray.length) {
        res.status(200).json({ ...watchlist, message: `All symbols already added: ${alreadyAddedSymbols.join(', ')}` , allSymbolExists:true});
        return;
      }

      const newSymbols = symbolArray.filter((symbol: string) => !alreadyAddedSymbols.includes(symbol));

      watchlist.symbols = [...(watchlist.symbols || []), ...newSymbols];
      await watchlist.save();

      const msg = alreadyAddedSymbols.length > 0
        ? `Symbol(s) already added: ${alreadyAddedSymbols.join(', ')}. Added: ${newSymbols.join(', ')}`
        : `Added: ${newSymbols.join(', ')}`;
      res.status(200).json({ ...watchlist, message: msg });
    } catch (error) {
      console.error('Error adding symbol to watchlist:', error);
      res.status(500).json({ error: 'Error adding symbol to watchlist' });
    }
  }
  


  
  
