export interface BaseProduct {
    name: string;
    description?: string;
    subtitle?: string;
    type?: 'indica' | 'sativa' | 'hybrid';
    // usually 3 or 4
    price?: number;
    prices?: number[];
    amount?: string; 
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
      prices: [60, 200]
    },
    {
      name: "Tyson",
      description: "Top effects: relaxed and hungry",
      type: "hybrid",
      prices: [60, 200]
    },
    {
      name: "Purple Cream",
      description: "Top effects: hungry and sleepy",
      type: "hybrid",
      prices: [60, 200]
    },
    {
      name: "Gary Payton",
      description: "Top effects: euphoric and giggly",
      type: "hybrid",
      prices: [60, 200]
    },
    {
      name: "Bobcat",
      description: "Top effects: happy and creative",
      type: "hybrid",
      prices: [60, 200]
    },
    {
      name: "Lemon Cherry Gelato",
      description: "Top effects: relaxed and giggly",
      type: "hybrid",
      prices: [60, 200]
    }
  ];

 const premiumProducts: PremiumProduct[] = [
      {
        name: "Haze",
        description: "Top effects: uplifted and creative",
        type: "sativa",
        prices: [45, 85, 160, 320]
      },
      {
        name: "Guava Runts",
        description: "Top effects: giggly and aroused",
        type: "hybrid",
        prices: [45, 85, 160, 320]
      },
      {
        name: "Gelotti",
        description: "Top effects: talkative and focused",
        type: "hybrid",
        prices: [45, 85, 160, 320]
      },
      {
        name: "WH Bubble Gum",
        description: "Top effects: happy and giggly",
        type: "hybrid",
        prices: [50, 90, 170, 330]
      },
      {
        name: "Gelato 33",
        subtitle: "candy",
        description: "Top effects: aroused and uplifted",
        type: "hybrid",
        prices: [50, 90, 170, 330]
      },
      {
        name: "Wagyu",
        subtitle: "candy",
        description: "Top effects: relaxed and sleepy",
        type: "hybrid",
        prices: [55, 100, 190, 330]
      },
      {
        name: "Bazookalato",
        subtitle: "candy",
        type: "hybrid",
        prices: [55, 100, 190]
      }
    ];
  const ediblesProducts: EdiblesProduct[] = [
    {
      name: "ya hemi gummies",
      description: "flavor: sour watermelon",
      price: 25,
    },
    {
      name: "jelly wizards",
      description: "flavor: assorted",
      price: 25,
    },
    {
      name: "lola gummies",
      description: "flavor: assorted",
      price: 25,
    }
  ]
  const psychedelicProducts: PsychedelicProduct[] = [
    {
      name: "raw mushrooms penis envy",
      price: 35,
      amount: "3.5 grams"
    }
  ]
  
  
export const mockData: returnData = {
    sungrown:  sungrownProducts,
    premium: premiumProducts,
    edibles: ediblesProducts,
    psychedelic: psychedelicProducts,
    prerolls: [
      {
        name: "Premium Preroll",
        price: 10,
        amount: "1 gram",
        type: "indica"
      },
    ],
    concentrates: [
      {
        name: "friendly farms cured resin vape",
        price: 50,
        amount: "1 gram"
      },
      {
        name: "waka disposable/live resin",
        price: 50,
        amount: "1 gram"
      },
      {
        name: "batter",
        price: 50,
        amount: "1 gram"
      },
      {
        name: "sugar",
        price: 50,
        amount: "1 gram"
      }
    ]
  };
  

