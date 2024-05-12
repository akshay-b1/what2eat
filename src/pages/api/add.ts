// pages/api/add.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import connectDB from '../../lib/db';
import Meal from '../../lib/meal';

// Connect to the MongoDB database
connectDB();

interface MealData {
  id: string;
  date: string;
  surveyUsing: string;
  eventName: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { date, surveyUsing, eventName } = req.body;

    try {
      const meal: MealData = {
        id: nanoid(15),
        date,
        surveyUsing,
        eventName,
      };

      const newMeal = new Meal(meal);
      await newMeal.save();

      res.status(201).json({ message: 'Meal created successfully', id: meal.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating meal' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}