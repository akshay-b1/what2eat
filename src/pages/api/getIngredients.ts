import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/db';
import Ingredient from '../../lib/ingredients';

// Connect to the MongoDB database
connectDB();

// get all ingredients from ingredients collection in db
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method === 'GET') {
      try {
        const ingredients = await Ingredient.find({});
        const items = ingredients.map(ingredient => ingredient.items);
        
        res.status(200).json(items);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting ingredients' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }