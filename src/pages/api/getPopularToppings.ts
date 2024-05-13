// pages/api/getPopularToppings.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/db';
import Meal from '../../lib/meal';

// Connect to the MongoDB database
connectDB();

interface ChoicePopularity {
  name: string;
  count: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChoicePopularity[]>
) {
  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      // Find the meal by its ID
      const meal = await Meal.findOne({ id: id });

      if (!meal) {
        return res.status(404).json([]);
      }

      // Calculate choice popularity
      const choicePopularity: { [name: string]: number } = {};
      meal.eaters.forEach((eater: any) => {
        eater.choices.forEach((choice: any) => {
          if (choice.selected) {
            choicePopularity[choice.name] = (choicePopularity[choice.name] || 0) + 1;
          }
        });
      });

      // Convert choice popularity to array of objects
      const choicePopularityArray: ChoicePopularity[] = Object.keys(choicePopularity).map(name => ({
        name,
        count: choicePopularity[name]
      }));

      // Sort the choices by count in descending order
      choicePopularityArray.sort((a, b) => b.count - a.count);

      res.status(200).json(choicePopularityArray);
    } catch (error) {
      console.error(error);
      res.status(500).json([]);
    }
  } else {
    res.status(405).json([]);
  }
}
