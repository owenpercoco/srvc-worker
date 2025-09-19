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
  is_in_stock?: boolean;
  category: categoryEnum;
  image?: string;
}

export interface DataBaseProduct extends BaseProduct {
  _id: string;
  id: number;
}

export interface Price {
  amount: string; // display amount, e.g. "$60" or "60"
  description?: string; // optional visual representation (e.g. "quarter", "oz")
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
  { amount: '60', description: 'quarter' },
  { amount: '200', description: 'oz' }
];

const premiumPrice: Price[] = [
  { amount: '45', description: 'eighth' },
  { amount: '85', description: 'quarter' },
  { amount: '160', description: 'half' },
  { amount: '320', description: 'oz' }
];

const concentratePrice: Price = { amount: '50', description: '1 gram' };

// Sungrown Products
const sungrownProducts: SungrownProduct[] = [
  {
    name: "Sour Diesel",
    description: "Top effects: energetic and uplifted",
    type: TypeEnum.hybrid,
  price: sungrownPrice,
    category: categoryEnum.sungrown,
    is_in_stock: true,
  },
  {
    name: "Tyson",
    description: "Top effects: relaxed and hungry",
    type: TypeEnum.hybrid,
    price: sungrownPrice,
    category: categoryEnum.sungrown,
    is_in_stock: true,
  },
  {
    name: "Purple Cream",
    description: "Top effects: hungry and sleepy",
    type: TypeEnum.hybrid,
    price: sungrownPrice,
    category: categoryEnum.sungrown,
    is_in_stock: true,
  },
  {
    name: "Gary Payton",
    description: "Top effects: euphoric and giggly",
    type: TypeEnum.hybrid,
    price: sungrownPrice,
    category: categoryEnum.sungrown,
    is_in_stock: true,
  },
  {
    name: "Bobcat",
    description: "Top effects: happy and creative",
    type: TypeEnum.hybrid,
    price: sungrownPrice,
    category: categoryEnum.sungrown,
    is_in_stock: true,
  },
  {
    name: "Lemon Cherry Gelato",
    description: "Top effects: relaxed and giggly",
    type: TypeEnum.hybrid,
    price: sungrownPrice,
    category: categoryEnum.sungrown,
    is_in_stock: true,
  },
];

// Premium Products
const premiumProducts: PremiumProduct[] = [
  {
    name: "Haze",
    description: "Top effects: uplifted and creative",
    type: TypeEnum.sativa,
    price: premiumPrice,
    category: categoryEnum.premium,
    is_in_stock: true,
  },
  {
    name: "Guava Runts",
    description: "Top effects: giggly and aroused",
    type: TypeEnum.hybrid,
    price: premiumPrice,
    category: categoryEnum.premium,
    is_in_stock: true,
  },
  {
    name: "Gelotti",
    description: "Top effects: talkative and focused",
    type: TypeEnum.hybrid,
    price: premiumPrice,
    category: categoryEnum.premium,
    is_in_stock: true,
  },
  {
    name: "WH Bubble Gum",
    description: "Top effects: happy and giggly",
    type: TypeEnum.hybrid,
    price: premiumPrice,
    category: categoryEnum.premium,
    is_in_stock: true,
  },
  {
    name: "Gelato 33",
    subtitle: "candy",
    description: "Top effects: aroused and uplifted",
    type: TypeEnum.hybrid,
    price: premiumPrice,
    category: categoryEnum.premium,
    is_in_stock: true,
  },
  {
    name: "Wagyu",
    subtitle: "candy",
    description: "Top effects: relaxed and sleepy",
    type: TypeEnum.hybrid,
    price: premiumPrice,
    category: categoryEnum.premium,
    is_in_stock: true,
  },
  {
    name: "Bazookalato",
    subtitle: "candy",
    type: TypeEnum.hybrid,
    price: [
      { amount: '55', description: 'eighth' },
      { amount: '100', description: 'quarter' },
      { amount: '190', description: 'half' }
    ],
    category: categoryEnum.premium,
    is_in_stock: true,
  },
];

// Edibles Products
const ediblesProducts: EdiblesProduct[] = [
  {
    name: "ya hemi gummies",
    description: "flavor: sour watermelon",
    price: { amount: '25', description: "per pack" },
    category: categoryEnum.edible,
    is_in_stock: true,
  },
  {
    name: "jelly wizards",
    description: "flavor: assorted",
    price: { amount: '25', description: "per pack" },
    category: categoryEnum.edible,
    is_in_stock: true,
  },
  {
    name: "lola gummies",
    description: "flavor: assorted",
    price: { amount: '25', description: "per pack" },
    category: categoryEnum.edible,
    is_in_stock: true,
  },
];

// Psychedelic Products
const psychedelicProducts: PsychedelicProduct[] = [
  {
    name: "raw mushrooms penis envy",
    price: { amount: '35', description: "3.5 grams" },
    category: categoryEnum.psychadelic,
    is_in_stock: true,
  },
];

// Preroll Products
const preRollProducts: PrerollProduct[] = [
  {
    name: "Premium Preroll",
    price: { amount: '10', description: "1 gram" },
    type: TypeEnum.indica,
    category: categoryEnum.preroll,
    is_in_stock: true,
  },
];

// Concentrate Products
const concentrateProducts: ConcentrateProduct[] = [
  {
    name: "friendly farms cured resin vape",
    price: concentratePrice,
    category: categoryEnum.concentrate,
    is_in_stock: true,
  },
  {
    name: "waka disposable/live resin",
    price: concentratePrice,
    category: categoryEnum.concentrate,
    is_in_stock: true,
  },
  {
    name: "batter",
    price: concentratePrice,
    category: categoryEnum.concentrate,
    is_in_stock: true,
  },
  {
    name: "sugar",
    price: concentratePrice,
    category: categoryEnum.concentrate,
    is_in_stock: true,
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
