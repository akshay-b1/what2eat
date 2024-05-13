// pages/api/checkUser.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/db';
import Meal from '../../lib/meal';

// Connect to the MongoDB database
connectDB();

interface CheckUserResponse {
  exists: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckUserResponse>
) {
  if (req.method === 'GET') {
    const { user, pass, id } = req.query;

    try {
      // Find the meal by its ID
      const meal = await Meal.findOne({ id: id });

      if (!meal) {
        return res.status(404).json({ exists: false });
      }

      // Check if a user with the provided name and password exists in the eaters array
      const userExists = meal.eaters.some(
        (eater:any) => eater.user === user && eater.pass === pass
      );

      res.status(200).json({ exists: userExists });
    } catch (error) {
      console.error(error);
      res.status(500).json({ exists: false });
    }
  } else {
    res.status(405).json({ exists: false });
  }
}