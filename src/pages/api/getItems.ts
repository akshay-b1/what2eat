import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/db';
import Ingredient from '../../lib/ingredients';
import Cuisine from '../../lib/cuisines'; // Import the Cuisine model

// Connect to the MongoDB database
connectDB();

// get all items from the appropriate collection in db
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { type } = req.query; // Extract the type parameter from the query parameters

    try {
      let items;

      // Determine which collection to fetch based on the type parameter
      if (type === 'ingredients') {
        const ingredients = await Ingredient.find({});
        items = ingredients.map(ingredient => ingredient.items);
      } else if (type === 'cuisines') {
        const cuisines = await Cuisine.find({}); // Fetch from the Cuisine collection
        items = cuisines.map(cuisine => cuisine.items);
      } else {
        return res.status(400).json({ error: 'Invalid type parameter' });
      }

      res.status(200).json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `Error getting ${type}` });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}