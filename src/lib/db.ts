const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
        try {
            await mongoose.connect('mongodb+srv://akshay:ankitlovesfood@meals.il3tlrl.mongodb.net/?retryWrites=true&w=majority&appName=meals');
            // console.log(`MongoDB Connected`);
        } catch (error) {
            // console.error(`Error: ${(error as Error).message}`);
            process.exit(1);
        }
    };

export default connectDB;