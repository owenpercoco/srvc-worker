import mongoose from 'mongoose';
import { productData } from '../data/inventory';
import connect from '../utils/db';
import Product from '../models/Product';


async function insertMockData() {
  await connect();

  try {
    // Fetch all products
    const products = await Product.find({});

    for (const product of products) {
      // Ensure amount_in_stock is set to the product's quantity
      product.amount_in_stock = product.quantity;
      await product.save();
    }
    console.log('products updated successfully successfully');
  } catch (error) {
    console.error('Error inserting mock data:', error);
  } finally {
    mongoose.connection.close();
  }
}

insertMockData();
