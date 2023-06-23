import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
mongoose.connect(process.env.MONGO_DB_URI || "");

const db = mongoose.connection;

export default db;
