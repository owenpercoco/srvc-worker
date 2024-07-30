import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/db';
import Product from '../../models/Product';
import { returnData, SungrownProduct, PremiumProduct, EdiblesProduct, PsychedelicProduct, PrerollProduct, ConcentrateProduct, BaseProduct } from '../../data/inventory';

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
function isSungrownProduct(product: any): product is SungrownProduct {
  return product.category === 'sungrown' && checkType(product.type) && product.prices !== undefined;
}

// Type guard to check if a product is a PremiumProduct
function isPremiumProduct(product: any): product is PremiumProduct {
  return product.category === 'premium' && checkType(product.type) && product.prices !== undefined;
}

// Type guard to check if a product is an EdiblesProduct
function isEdiblesProduct(product: any): product is EdiblesProduct {
  return product.category === 'edible' && product.price !== undefined;
}

// Type guard to check if a product is a PsychedelicProduct
function isPsychedelicProduct(product: any): product is PsychedelicProduct {
  return product.category === 'psychadelic' && product.price !== undefined && product.amount !== undefined;
}

// Type guard to check if a product is a PrerollProduct
function isPrerollProduct(product: any): product is PrerollProduct {
  return product.category === 'preroll' && product.type !== undefined && product.price !== undefined;
}

// Type guard to check if a product is a ConcentrateProduct
function isConcentrateProduct(product: any): product is ConcentrateProduct {
  return product.category === 'concentrate' && product.price !== undefined && product.amount !== undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    console.log("API route called");

    const start = Date.now();
    await connect();
    console.log(`Connected to database in ${Date.now() - start}ms`);

    const fetchStart = Date.now();
    const products: BaseProduct[] = await Product.find({ quantity: { $gt: 0 } }).lean();
    console.log(`Fetched products in ${Date.now() - fetchStart}ms`, products);

    const filterStart = Date.now();
    const sungrown = products.filter(isSungrownProduct);
    const premium = products.filter(isPremiumProduct);
    const edibles = products.filter(isEdiblesProduct);
    const psychedelic = products.filter(isPsychedelicProduct);
    const prerolls = products.filter(isPrerollProduct);
    const concentrates = products.filter(isConcentrateProduct);
    console.log(`Filtered categories in ${Date.now() - filterStart}ms`);

    const data: returnData = {
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
