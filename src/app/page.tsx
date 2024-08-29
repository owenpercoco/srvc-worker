"use client"
import { useEffect, useState } from 'react';
import { returnData, BaseProduct, Price, mockData } from '@/data/inventory';
import { Typography } from '@mui/material';
import { SrvcFooter, Logo, Modal, TelegramLink, Area, } from './components/';
import Image from 'next/image';

export default function Home() {
  const [data, setData] = useState<returnData>()
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/inventory');
      const result = await response.json()
      console.log(result)
      setData(result.data);
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
    <div className="wrapper">
      <div className="container column">
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
              product={data.edibles}
              setProduct={setProduct} 
              setShowModal={setShowModal}
            />

            {/* Render Psychedelic Products */}
            <hr/>
            <Area
              title='psychedelics'
              product={data.psychedelics}
              setProduct={setProduct} 
              setShowModal={setShowModal}
            />
        </div>
        <div className='middle-seperator grow-down'></div>
        <div className="right-column column">
            {/* Render Premium Products */}
            <Area
              title='premium'
              premium
              product={data.premium}
              setProduct={setProduct}
              setShowModal={setShowModal}
            />

            {/* Render Preroll Products */}
            <hr/>
            <Area
              title='preroll'
              product={data.prerolls}
              setProduct={setProduct} 
              setShowModal={setShowModal}/>

            {/* Render Concentrate Products */}
            <Area 
              title='concentrates'
              premium
              product={data.concentrates}
              setProduct={setProduct} 
              setShowModal={setShowModal}
            />
            <TelegramLink url={"https://t.me/+5pVSJoetozdiZDNh"} />
            <div className="delivery-info-container info-container column">
              <span>delivery minimums are:</span>
              <span>Manhattan: $50</span>
              <span>Upper Manhattan: $100</span>
              <span>Brooklyn & Queens: $100</span>
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
