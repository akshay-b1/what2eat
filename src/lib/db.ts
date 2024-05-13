const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
        try {
            // can y see?, which part do i change? after .net/put a db name // like that?
            // Now your db will be changed and new db will not have any data, so start testing again and check this db if
            // data is being saved or not....ok will do u do the testing let me see your other code
            // await mongoose.connect('mongodb+srv://akshay:ankitlovesfood@meals.il3tlrl.mongodb.net/when2eat?retryWrites=true&w=majority&appName=meals');
            // console.log(`MongoDB Connected`);
            await mongoose.connect(process.env.MONGO_URL)
            // set debug to true to see the operations on the database
            mongoose.set('debug', true);
        } catch (error) {
            console.error(`Error: ${(error as Error).message}`);
            // process.exit(1);
        }
    };

export default connectDB;