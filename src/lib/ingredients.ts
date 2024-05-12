import mongoose from "mongoose";

const IngredientsSchema = new mongoose.Schema({
    items : { type: Array, required: true },
});

const Ingredients = mongoose.models.Ingredients || mongoose.model('Ingredients', IngredientsSchema);

export default Ingredients;