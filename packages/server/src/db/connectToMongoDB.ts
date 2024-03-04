import mongoose from "mongoose";
import { env } from "../config/env";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(env.MONGO_DB_URL);
        console.log(`Database connected to MongoDB .....`);
    } catch (error) {
        const castedError = error as Error;
        console.error(castedError.message);
        process.exit(1);
    }

    mongoose.connection.once("open", (_) => {
        console.log(`Database Opened .....`);
    });

    mongoose.connection.on("error", (err) => {
        console.error(`Database connection error: ${err}`);
    });
};

export default connectToMongoDB;
