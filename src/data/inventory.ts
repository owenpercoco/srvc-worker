export enum categoryEnum { 
  sungrown = 'sungrown', 
  premium = 'premium', 
  edible = 'edible', 
  preroll = 'preroll', 
  concentrate = 'concentrate', 
  psychadelic = 'psychadelic'
}

export enum TypeEnum { 
  indica = 'indica', 
  sativa = 'sativa', 
  hybrid = 'hybrid', 
  indicadominant = 'indicadominant', 
  sativadominant = 'sativadominant'
}

export interface BaseProduct {
  name: string; 
  description?: string;
  long_description?: string;
  subtitle?: string;
  type?: TypeEnum;
  price: Price | Price[];
  amount?: string; // deprecated field
  quantity: number;
  category: categoryEnum;
  image?: string;
}

export interface DataBaseProduct extends BaseProduct {
  _id: string;
  id: number;
}

export interface Sale {
  telephone?: string;
  address?: string;
  orders: Price[];
  total?: number;
  amount_paid?: number;
  description?: string;

}

export interface Price {
  amount: number; // the number in dollars charged
  quantity: number; // the amount of product it represents
  description: string; // a visual representation
  name?: string // the name of the product I guess
}

export interface FlowerProduct extends BaseProduct {
  type: TypeEnum;
}

export interface SungrownProduct extends FlowerProduct {}
export interface PremiumProduct extends FlowerProduct {}
export interface EdiblesProduct extends BaseProduct {}
export interface PrerollProduct extends BaseProduct {
  type: TypeEnum;
}
export interface ConcentrateProduct extends BaseProduct {}
export interface PsychedelicProduct extends BaseProduct {}

export interface returnData {
  sungrown: SungrownProduct[];
  premium: PremiumProduct[];
  edibles: EdiblesProduct[];
  psychedelics: PsychedelicProduct[];
  prerolls: PrerollProduct[];
  concentrates: ConcentrateProduct[];
}

const sungrownPrice: Price[] = [
  { amount: 60, description: 'quarter', quantity: .25 },
  { amount: 200, description: 'oz', quantity: 1 }
];

const premiumPrice: Price[] = [
  { amount: 45, description: 'eighth', quantity:.125 },
  { amount: 85, description: 'quarter', quantity: .25 },
  { amount: 160, description: 'half', quantity: .5 },
  { amount: 320, description: 'oz', quantity: 1 }
];

const concentratePrice: Price = { amount: 50, description: '1 gram', quantity: 1 };

// Sungrown Products
const sungrownProducts: SungrownProduct[] = [
  {
    name: "Sour Diesel",
    description: "Top effects: energetic and uplifted",
    type: TypeEnum.hybrid,
    price: sungrownPrice,
    quantity: 1,
    category: categoryEnum.sungrown,
  },
  {
    name: "Tyson",
    description: "Top effects: relaxed and hungry",
    type: TypeEnum.hybrid,
    price: sungrownPrice,
    quantity: 1,
    category: categoryEnum.sungrown,
  },
  {
    name: "Purple Cream",
    description: "Top effects: hungry and sleepy",
    type: TypeEnum.hybrid,
    price: sungrownPrice,
    quantity: 1,
    category: categoryEnum.sungrown,
  },
  {
    name: "Gary Payton",
    description: "Top effects: euphoric and giggly",
    type: TypeEnum.hybrid,
    price: sungrownPrice,
    quantity: 1,
    category: categoryEnum.sungrown,
  },
  {
    name: "Bobcat",
    description: "Top effects: happy and creative",
    type: TypeEnum.hybrid,
    price: sungrownPrice,
    quantity: 1,
    category: categoryEnum.sungrown,
  },
  {
    name: "Lemon Cherry Gelato",
    description: "Top effects: relaxed and giggly",
    type: TypeEnum.hybrid,
    price: sungrownPrice,
    quantity: 1,
    category: categoryEnum.sungrown,
  },
];

// Premium Products
const premiumProducts: PremiumProduct[] = [
  {
    name: "Haze",
    description: "Top effects: uplifted and creative",
    type: TypeEnum.sativa,
    price: premiumPrice,
    quantity: 1,
    category: categoryEnum.premium,
  },
  {
    name: "Guava Runts",
    description: "Top effects: giggly and aroused",
    type: TypeEnum.hybrid,
    price: premiumPrice,
    quantity: 1,
    category: categoryEnum.premium,
  },
  {
    name: "Gelotti",
    description: "Top effects: talkative and focused",
    type: TypeEnum.hybrid,
    price: premiumPrice,
    quantity: 1,
    category: categoryEnum.premium,
  },
  {
    name: "WH Bubble Gum",
    description: "Top effects: happy and giggly",
    type: TypeEnum.hybrid,
    price: premiumPrice,
    quantity: 1,
    category: categoryEnum.premium,
  },
  {
    name: "Gelato 33",
    subtitle: "candy",
    description: "Top effects: aroused and uplifted",
    type: TypeEnum.hybrid,
    price: premiumPrice,
    quantity: 1,
    category: categoryEnum.premium,
  },
  {
    name: "Wagyu",
    subtitle: "candy",
    description: "Top effects: relaxed and sleepy",
    type: TypeEnum.hybrid,
    price: premiumPrice,
    quantity: 1,
    category: categoryEnum.premium,
  },
  {
    name: "Bazookalato",
    subtitle: "candy",
    type: TypeEnum.hybrid,
    price: [
      { amount: 55, description: 'eighth', quantity:.125  },
      { amount: 100, description: 'quarter', quantity:.25 },
      { amount: 190, description: 'half', quantity:.5 }
    ],
    quantity: 1,
    category: categoryEnum.premium,
  },
];

// Edibles Products
const ediblesProducts: EdiblesProduct[] = [
  {
    name: "ya hemi gummies",
    description: "flavor: sour watermelon",
    price: { amount: 25, description: "per pack", quantity: 1 },
    quantity: 1,
    category: categoryEnum.edible,
  },
  {
    name: "jelly wizards",
    description: "flavor: assorted",
    price: { amount: 25, description: "per pack", quantity: 1 },
    quantity: 1,
    category: categoryEnum.edible,
  },
  {
    name: "lola gummies",
    description: "flavor: assorted",
    price: { amount: 25, description: "per pack", quantity: 1 },
    quantity: 1,
    category: categoryEnum.edible,
  },
];

// Psychedelic Products
const psychedelicProducts: PsychedelicProduct[] = [
  {
    name: "raw mushrooms penis envy",
    price: { amount: 35, description: "3.5 grams", quantity: 1 },
    quantity: 1,
    category: categoryEnum.psychadelic,
  },
];

// Preroll Products
const preRollProducts: PrerollProduct[] = [
  {
    name: "Premium Preroll",
    price: { amount: 10, description: "1 gram", quantity: 1 },
    type: TypeEnum.indica,
    quantity: 1,
    category: categoryEnum.preroll,
  },
];

// Concentrate Products
const concentrateProducts: ConcentrateProduct[] = [
  {
    name: "friendly farms cured resin vape",
    price: concentratePrice,
    quantity: 1,
    category: categoryEnum.concentrate,
  },
  {
    name: "waka disposable/live resin",
    price: concentratePrice,
    quantity: 1,
    category: categoryEnum.concentrate,
  },
  {
    name: "batter",
    price: concentratePrice,
    quantity: 1,
    category: categoryEnum.concentrate,
  },
  {
    name: "sugar",
    price: concentratePrice,
    quantity: 1,
    category: categoryEnum.concentrate,
  },
];

// Combined Data
export const productData = [
  ...sungrownProducts,
  ...premiumProducts,
  ...ediblesProducts,
  ...psychedelicProducts,
  ...preRollProducts,
  ...concentrateProducts,
];

export const mockData: returnData = {
  sungrown: sungrownProducts,
  premium: premiumProducts,
  edibles: ediblesProducts,
  psychedelics: psychedelicProducts,
  prerolls: preRollProducts,
  concentrates: concentrateProducts,
};
