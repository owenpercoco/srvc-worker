import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/db';
import Product from '../../models/Product';
import { returnData, SungrownProduct, PremiumProduct, EdiblesProduct, PsychedelicProduct, PrerollProduct, ConcentrateProduct, BaseProduct, categoryEnum } from '../../data/inventory';

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
  return product.category === 'sungrown' && checkType(product.type);
}

// Type guard to check if a product is a PremiumProduct
function isPremiumProduct(product: any): product is PremiumProduct {
  return product.category === 'premium' && checkType(product.type);
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
function processData(data: BaseProduct[]): returnData {
  const result: returnData = {
    sungrown: [],
    premium: [],
    concentrates: [],
    edibles: [],
    prerolls: [],
    psychedelics: []
  };

  for (let product of data) {
    if (isSungrownProduct(product)) {
      result.sungrown.push(product);
    } else if (isPremiumProduct(product)) {
      result.premium.push(product);
    } else if (isEdiblesProduct(product)) {
      result.edibles.push(product);
    } else if (isPsychedelicProduct(product)) {
      result.psychedelics.push(product);
    } else if (isPrerollProduct(product)) {
      result.prerolls.push(product);
    } else if (isConcentrateProduct(product)) {
      result.concentrates.push(product);
    }
  }

  return result;
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

    console.log(`Filtered categories in ${Date.now() - filterStart}ms`);

    const data = processData(products);

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ success: false, error: 'Failed to load data from the database' });
  }
}
