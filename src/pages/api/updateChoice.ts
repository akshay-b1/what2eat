// pages/api/updateChoice.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/db';
import Meal from '../../lib/meal';

// Connect to the MongoDB database
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { mealId, name, choices } = req.body;
    try {
      const meal = await Meal.findOne({ id: mealId });

      if (!meal) {
        console.log("meal",meal)
        return res.status(404).json({ error: 'Meal not found' });
      }

      const index = meal.eaters.findIndex((eater: {user: string}) => eater.user === name)
      console.log("INDEX => ", index)
      if (index === -1) {
        return res.status(404).json({ error: 'Eater not found' });
      }

      meal.eaters[index].choices = choices

      await meal.save();

      res.status(200).json({ message: 'Choices updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating choices' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}