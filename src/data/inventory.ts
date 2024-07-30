export interface BaseProduct {
    // id database fields
    // uuid database fields
    // name of the product
    name: string; 
    // optional description
    description?: string;
    // usually candy, appears small after title
    subtitle?: string;
    // strain typeing
    type?: 'indica' | 'sativa' | 'hybrid';
    // price of a single object
    price?: number;
    // objects with multiple sizes get this
    prices?: number[];
    // front end value for the amount
    amount?: string; 
    // back end value for the amount we have
    quantity: number
    // category of product, controls where it shows on the menu
    category: 'sungrown' | 'premium' | 'edible' | 'preroll' | 'concentrate' | 'psychadelic'
}


export interface FlowerProduct extends BaseProduct {
    type: 'indica' | 'sativa' | 'hybrid';
    // usually 3 or 4
    prices: number[];
}

export interface SungrownProduct extends FlowerProduct {}
export interface PremiumProduct extends FlowerProduct {}
export interface EdiblesProduct extends BaseProduct {
    price: number;
}
export interface PrerollProduct extends BaseProduct {
    price: number;
    type: 'indica' | 'sativa' | 'hybrid';
}
export interface ConcentrateProduct extends BaseProduct {
  price: number;
  // usually '1 gram'
  amount: string; 
}
export interface PsychedelicProduct extends BaseProduct {
  price: number;
  // usually '1 gram'
  amount: string; 
}
export interface returnData {
    sungrown: SungrownProduct[]
    premium: PremiumProduct[]
    edibles: EdiblesProduct[]
    psychedelic: PsychedelicProduct[]
    prerolls: PrerollProduct[]
    concentrates: ConcentrateProduct[]
}
const sungrownProducts: SungrownProduct[] = [
  {
    name: "Sour Diesel",
    description: "Top effects: energetic and uplifted",
    type: "hybrid",
    prices: [60, 200],
    quantity: 1,
    category: "sungrown",
  },
  {
    name: "Tyson",
    description: "Top effects: relaxed and hungry",
    type: "hybrid",
    prices: [60, 200],
    quantity: 1,
    category: "sungrown",
  },
  {
    name: "Purple Cream",
    description: "Top effects: hungry and sleepy",
    type: "hybrid",
    prices: [60, 200],
    quantity: 1,
    category: "sungrown",
  },
  {
    name: "Gary Payton",
    description: "Top effects: euphoric and giggly",
    type: "hybrid",
    prices: [60, 200],
    quantity: 1,
    category: "sungrown",
  },
  {
    name: "Bobcat",
    description: "Top effects: happy and creative",
    type: "hybrid",
    prices: [60, 200],
    quantity: 1,
    category: "sungrown",
  },
  {
    name: "Lemon Cherry Gelato",
    description: "Top effects: relaxed and giggly",
    type: "hybrid",
    prices: [60, 200],
    quantity: 1,
    category: "sungrown",
  },
];

const premiumProducts: PremiumProduct[] = [
  {
    name: "Haze",
    description: "Top effects: uplifted and creative",
    type: "sativa",
    prices: [45, 85, 160, 320],
    quantity: 1,
    category: "premium",
  },
  {
    name: "Guava Runts",
    description: "Top effects: giggly and aroused",
    type: "hybrid",
    prices: [45, 85, 160, 320],
    quantity: 1,
    category: "premium",
  },
  {
    name: "Gelotti",
    description: "Top effects: talkative and focused",
    type: "hybrid",
    prices: [45, 85, 160, 320],
    quantity: 1,
    category: "premium",
  },
  {
    name: "WH Bubble Gum",
    description: "Top effects: happy and giggly",
    type: "hybrid",
    prices: [50, 90, 170, 330],
    quantity: 1,
    category: "premium",
  },
  {
    name: "Gelato 33",
    subtitle: "candy",
    description: "Top effects: aroused and uplifted",
    type: "hybrid",
    prices: [50, 90, 170, 330],
    quantity: 1,
    category: "premium",
  },
  {
    name: "Wagyu",
    subtitle: "candy",
    description: "Top effects: relaxed and sleepy",
    type: "hybrid",
    prices: [55, 100, 190, 330],
    quantity: 1,
    category: "premium",
  },
  {
    name: "Bazookalato",
    subtitle: "candy",
    type: "hybrid",
    prices: [55, 100, 190],
    quantity: 1,
    category: "premium",
  },
];

const ediblesProducts: EdiblesProduct[] = [
  {
    name: "ya hemi gummies",
    description: "flavor: sour watermelon",
    price: 25,
    quantity: 1,
    category: "edible",
  },
  {
    name: "jelly wizards",
    description: "flavor: assorted",
    price: 25,
    quantity: 1,
    category: "edible",
  },
  {
    name: "lola gummies",
    description: "flavor: assorted",
    price: 25,
    quantity: 1,
    category: "edible",
  },
];

const psychedelicProducts: PsychedelicProduct[] = [
  {
    name: "raw mushrooms penis envy",
    price: 35,
    amount: "3.5 grams",
    quantity: 1,
    category: "psychadelic",
  },
];

const preRollProducts: PrerollProduct[] = [
  {
    name: "Premium Preroll",
    price: 10,
    amount: "1 gram",
    type: "indica",
    quantity: 1,
    category: "preroll",
  },
];

const concentrateProducts: ConcentrateProduct[] = [
  {
    name: "friendly farms cured resin vape",
    price: 50,
    amount: "1 gram",
    quantity: 1,
    category: "concentrate",
  },
  {
    name: "waka disposable/live resin",
    price: 50,
    amount: "1 gram",
    quantity: 1,
    category: "concentrate",
  },
  {
    name: "batter",
    price: 50,
    amount: "1 gram",
    quantity: 1,
    category: "concentrate",
  },
  {
    name: "sugar",
    price: 50,
    amount: "1 gram",
    quantity: 1,
    category: "concentrate",
  },
];

  
export const productData = [...sungrownProducts,
    ...premiumProducts, ...ediblesProducts, ...psychedelicProducts, ...preRollProducts, ...concentrateProducts]
export const mockData: returnData = {
    sungrown:  sungrownProducts,
    premium: premiumProducts,
    edibles: ediblesProducts,
    psychedelic: psychedelicProducts,
    prerolls: preRollProducts,
    concentrates: concentrateProducts,
  };
  

