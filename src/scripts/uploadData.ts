import mongoose from 'mongoose';
import { productData } from '../data/inventory';
import connect from '../utils/db';
import Product from '../models/Product';


async function insertMockData() {
  await connect();

  try {
    await Product.deleteMany(); // Clear existing data
    await Product.insertMany(productData);
    console.log('Mock data inserted successfully');
  } catch (error) {
    console.error('Error inserting mock data:', error);
  } finally {
    mongoose.connection.close();
  }
}

insertMockData();
