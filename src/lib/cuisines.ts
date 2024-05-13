import mongoose from "mongoose";

const CuisinesSchema = new mongoose.Schema({
    items : { type: Array, required: true },
});

const Cuisines = mongoose.models.Cuisines || mongoose.model('Cuisines', CuisinesSchema);

export default Cuisines;