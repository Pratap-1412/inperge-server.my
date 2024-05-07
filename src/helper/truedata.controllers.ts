import { Request, Response } from 'express';
import axios from 'axios';
const getSuggestions = async (req: Request<{}, {}, {}, { q?: string | undefined }>, res: Response) => {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Missing query' });
    }
  
    try {
      const response = await axios.get<{ Records: any[] }>(`https://api.truedata.in/getAllSymbols?segment=eq&user=FYERS2018&password=Ngj1VZmn&search=${query}`);
      const suggestions = response.data.Records.filter(record => record[1].toLowerCase().includes(query.toLowerCase()) ||
        record[2].toLowerCase().includes(query.toLowerCase()) ||
        record[3].toLowerCase().includes(query.toLowerCase()) ||
        record[4].toLowerCase().includes(query.toLowerCase()) ||
        record[5].toLowerCase().includes(query.toLowerCase()) ||
        record[6].toLowerCase().includes(query.toLowerCase()) ||
        record[7].toLowerCase().includes(query.toLowerCase()) ||
        record[8].toLowerCase().includes(query.toLowerCase()) ||
        record[9].toLowerCase().includes(query.toLowerCase())).map((record) => ({
          instrument_token: record[0],
          symbol: record[1],
          segment: record[2],
          exchange: record[4],
        }));
  
      res.json(suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
  };


export default getSuggestions;

