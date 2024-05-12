// pages/api/updateChoice.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/db';
import Meal from '../../lib/meal';

// Connect to the MongoDB database
connectDB();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { mealId, name, choices } = req.body;

    try {
      // Find the meal by its ID
      const meal = await Meal.findOne({ id: mealId });
      console.log("before update",meal);

      if (!meal) {
        return res.status(404).json({ error: 'Meal not found' });
      }

      // Find the eater by its name
      const eaterIndex = meal.eaters.findIndex((eater: { user: string; }) => eater.user === name);
      console.log("eaterIndex",eaterIndex);

      // check if choices exists
      if (!Array.isArray(meal.eaters[eaterIndex].choices)) {
        meal.eaters[eaterIndex].choices = [];
        console.log("choices not found");
      }

      // Update the choices for the eater
      meal.eaters[eaterIndex].choices = choices;

      console.log("Choices after update",meal.eaters[eaterIndex].choices)

      meal.markModified(`eaters.${eaterIndex}.choices`);

      console.log("after update",meal);

      // Save the updated meal
      await meal.save();
      console.log("meal saved");

      res.status(200).json({ message: 'Choices updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating choices' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
