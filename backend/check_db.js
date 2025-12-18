import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from './src/models/Subject.js';
import connectDB from './src/config/db.js';

dotenv.config();

const checkData = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    const subjects = await Subject.find({});
    console.log('Total subjects:', subjects.length);
    console.log(JSON.stringify(subjects, null, 2));

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkData();
