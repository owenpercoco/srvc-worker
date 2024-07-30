import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/db';
import Product from '../../models/Product';
import { returnData, BaseProduct, SungrownProduct, PremiumProduct, EdiblesProduct, PsychedelicProduct, PrerollProduct, ConcentrateProduct } from '../../data/inventory';

type Data = {
  success: boolean;
  data?: any;
  error?: string;
};

function checkType(type: string | undefined) {
  if (type === undefined) return false;
  return ['indica', 'sativa', 'hybrid'].includes(type);
}

// Type guard to check if a product is a SungrownProduct
function isSungrownProduct(product: any) {
  return product.category === 'sungrown' && checkType(product.type) && product.prices !== undefined;
}

// Type guard to check if a product is a PremiumProduct
function isPremiumProduct(product: any) {
  return product.category === 'premium' && checkType(product.type) && product.prices !== undefined;
}

// Type guard to check if a product is an EdiblesProduct
function isEdiblesProduct(product: any) {
  return product.category === 'edible' && product.price !== undefined;
}

// Type guard to check if a product is a PsychedelicProduct
function isPsychedelicProduct(product: any) {
  return product.category === 'psychadelic' && product.price !== undefined && product.amount !== undefined;
}

// Type guard to check if a product is a PrerollProduct
function isPrerollProduct(product: any) {
  return product.category === 'preroll' && product.type !== undefined && product.price !== undefined;
}

// Type guard to check if a product is a ConcentrateProduct
function isConcentrateProduct(product: any) {
  return product.category === 'concentrate' && product.price !== undefined && product.amount !== undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    console.log("Connecting to database...");
    await connect();
    console.log("Connected to database");

    console.log("Fetching products from database...");
    const products = await Product.find({ quantity: { $gt: 0 } }).lean();
    console.log("Fetched products:", products);

    console.log("Filtering products into categories...");
    const sungrown = products.filter(isSungrownProduct);
    const premium = products.filter(isPremiumProduct);
    const edibles = products.filter(isEdiblesProduct);
    const psychedelic = products.filter(isPsychedelicProduct);
    const prerolls = products.filter(isPrerollProduct);
    const concentrates = products.filter(isConcentrateProduct);

    console.log("Filtered categories:", {
      sungrown,
      premium,
      edibles,
      psychedelic,
      prerolls,
      concentrates,
    });

    const data = {
      sungrown,
      premium,
      edibles,
      psychedelic,
      prerolls,
      concentrates,
    };

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ success: false, error: 'Failed to load data from the database' });
  }
}
