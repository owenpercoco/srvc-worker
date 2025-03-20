"use client"
import { useEffect, useState } from 'react';
import { BaseProduct, Price, DataBaseProduct } from '@/data/inventory';
import { Typography } from '@mui/material';
import { SrvcFooter, Logo, Modal, TelegramLink, Area, PhoneLink } from './components/';
import Image from 'next/image';

export default function Home() {
  const [data, setData] = useState<Record<string, DataBaseProduct[]>>()
  const [settings, setSettings] = useState<any>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [product, setProduct] = useState<BaseProduct | undefined>()
  const defaultPrices: Price[] = [
    {
      amount: 45,
      quantity: .125,
      description: "⅛",
      name: "Sour Diesel",
    },
    {
      amount: 85,
      quantity: .25,
      description: "¼",
      name: "Tyson",
    },
    {
      amount: 160,
      quantity: .5,
      description: "½",
      name: "Purple Cream",
    },
  ];

  const [order, setOrder] = useState(defaultPrices);

  const frontEndTypeMap = {
    'sativa': 'SATIVA',
    'indica': 'INDICA',
    'hybrid': 'HYBRID',
    'indicadominant': 'HYBRID INDICA',
    'sativadominant': 'HYBRID SATIVA'
  }
  const priceDisplay = (priceValue: Price | Price[] | undefined): string => {
    if (priceValue === undefined) return '' 
    let displayString = ''
  
    if (Array.isArray(priceValue)) {
        displayString = priceValue.map((price) => `$${price.amount} ${price.description}`).join(" • ");
    } else {
      displayString = `$${priceValue.amount} ${priceValue.description}`
    }
    return displayString;
  }
  function sortCategories(products: DataBaseProduct[]) {
    const sorted_products: Record<string, DataBaseProduct[]> = {
      psychadelic: [],
      edible: [],
      premium: [],
      sungrown: [],
      concentrate: [],
      preroll: [],
    };
  
    for (let i = 0; i < products.length; i++) {
      const category = products[i].category;
  
      if (!sorted_products[category]) {
        sorted_products[category] = []; // Ensure the category exists
      }
  
      sorted_products[category].push(products[i]);
    }
    console.log(sorted_products);
    return sorted_products; // Return the sorted object
  }
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/products?inStockOnly=true");;
      const settings = await fetch('api/settings');
      const settingsResult = await settings.json()
      setSettings(settingsResult.data);
      const result = await response.json()
      console.log(result);
      setData(sortCategories(result.data));
      console.log("data retrieved and set");
    };

    fetchData();
  }, []);
  if (!data) {
    return (
      <div className="loading-container column">
          <Logo />
      </div> 
    )
  }

  return (
    <div className="wrapper w-[98%]">
      <div className="container column pb-9">
        <div className='info-container'>
          <span className="info-text">hold any menu item for more information</span>
        </div>
        
      <div className="column-container row">
        <div className="left-column column">
            <Logo />
            {/* Render Sungrown Products */}
            <hr className='expand'/>
            <Area
              title='sun grown'
              product={data.sungrown}
              setProduct={setProduct}
              setShowModal={setShowModal}
            />

            {/* Render Edibles */}
            <Area
              title='edibles'
              premium
              product={data.edible}
              setProduct={setProduct} 
              setShowModal={setShowModal}
            />

            {/* Render Psychedelic Products */}
            <Area
              title='psychedelics'
              product={data.psychadelic}
              setProduct={setProduct} 
              setShowModal={setShowModal}
            />
        </div>
        <div className='middle-seperator grow-down'></div>
        <div className="right-column flex flex-col h-full">  
            {/* Render Premium Products */}
            <Area
              title='premium'
              premium
              product={data.premium}
              setProduct={setProduct}
              setShowModal={setShowModal}
            />

            {/* Render Preroll Products */}
            <Area
              title='preroll'
              product={data.preroll}
              setProduct={setProduct} 
              setShowModal={setShowModal}/>

            {/* Render Concentrate Products */}
            <Area 
              title='concentrates'
              premium
              product={data.concentrate}
              setProduct={setProduct} 
              setShowModal={setShowModal}
            />  
            <div className="mt-auto">
              { settings.isPhoneNumberVisisble && (
                <div className="flex-1"><PhoneLink/></div>
              )}
              { settings.isTelegramLinkVisible && (
                <div className="flex-1"><TelegramLink url={"https://t.me/+5pVSJoetozdiZDNh"} /></div>
              )}
          

              <div className="delivery-info-container info-container column ">
                <p>Delivery minimums are:</p>
                {settings.minimums && settings.minimums.length > 0 ? (
                  settings.minimums.map((minimum: any) => (
                    <span key={minimum.name}>
                      {minimum.name}: ${minimum.value}
                    </span>
                  ))
                ) : (
                  <span>Loading delivery minimums...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      <SrvcFooter order={order}/>
    </div>

    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {product !== undefined && (
        <div className='column'>
            <div className="modal-header column">
              <div className='row between'>
                <span><h2>{product?.name}</h2></span>
                {/* <OrderComponent product={product} order={order} setOrder={setOrder}/> */}
              </div>
                {product.type && <span className="modal-text">{frontEndTypeMap[product?.type]}</span>}
                <hr/>
            </div>
            <div className='row detail-row'>
                <span className="modal-prices">{priceDisplay(product.price)}</span>
            </div>
            <div className='row'>
                <span className="modal-text">{product.description}</span>
            </div>
            <div className='row image-row'>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={250} 
                    height={250}
                    objectFit='cover'
                  />
                ) : (
                  <span></span>
                )}
              </div>
            <div className='long-description'>
              <Typography>{product.long_description}</Typography>
            </div>
          </div>
          )}
    </Modal>
  </div>
);
};
