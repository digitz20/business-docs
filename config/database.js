/**
 * database.js
 * Centralizes mongoose (MongoDB) connection for reusability and clarity.
 */

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/stolenData";

/**
 * connectDB - Connects to MongoDB with sensible options and logs status.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error("[DB] MongoDB connection error:", err);
    process.exit(1); // Exit on DB connection error
  }
};

// Register listeners only once
mongoose.connection.on('connected', () => {
  console.log("[DB] MongoDB connected:", MONGO_URI);
});
mongoose.connection.on('error', (err) => {
  console.error("[DB] MongoDB connection error:", err);
});
mongoose.connection.on('disconnected', () => {
  console.warn("[DB] MongoDB disconnected");} );