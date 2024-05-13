// models/Meal.ts

import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  surveyUsing: { type: String, required: true },
  eventName: { type: String, required: true },
  eaters: [
    {
      user: String,
      pass: String,
      choices: [
        {
          name: String,
          selected: Boolean,
        }
      ],
    },
  ],
});

const Meal = mongoose.models.Meal || mongoose.model('Meal', MealSchema);

export default Meal;