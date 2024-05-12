// pages/api/addEater.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/db';
import Meal from '../../lib/meal';


// Connect to the MongoDB database
connectDB();

interface EaterData {
  user: string;
  pass: string;
  // Add any other required fields for the eater
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { mealId, eaterData } = req.body;

    try {
      // Find the meal by its ID
      const meal = await Meal.findOne({id : mealId});

      if (!meal) {
        return res.status(404).json({ error: 'Meal not found' });
      }
      
      // Create a new eater object
      const newEater: EaterData = {
        user: eaterData.user,
        pass: eaterData.pass,
        // Add any other required fields for the eater
      };

      // Check if the eaters field exists and is an array
      if (!Array.isArray(meal.eaters)) {
        meal.eaters = [];
      }
      // Add the new eater to the meal's eaters array
      meal.eaters.push({ user: newEater.user, pass: newEater.pass });

      meal.markModified('eaters');
      
      // Save the updated meal
      await meal.save();

      res.status(200).json({ message: 'Eater added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding eater' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}