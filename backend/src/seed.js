import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from './models/Subject.js';
import connectDB from './config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    // If running from command line locally, might need to override MONGO_URI
    // checking if we are inside docker or local.
    // However, if we run this via 'docker exec', the env vars are already set correctly.
    
    await connectDB();

    console.log('Checking for existing subjects...');
    const count = await Subject.countDocuments();

    if (count === 0) {
      console.log('No subjects found. Seeding...');
      const subjects = [
        { name: 'Matemàtiques', totalHours: 120 },
        { name: 'Català', totalHours: 90 },
        { name: 'Anglès', totalHours: 90 },
        { name: 'Història', totalHours: 60 },
        { name: 'Física i Química', totalHours: 80 },
        { name: 'Educació Física', totalHours: 40 },
      ];

      await Subject.insertMany(subjects);
      console.log('Subjects seeded successfully!');
    } else {
      console.log('Subjects already exist. Skipping seed.');
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
