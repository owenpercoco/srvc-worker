"use client"
import { useEffect, useState } from 'react';
import { returnData, BaseProduct } from '@/data/inventory';
import { SrvcFooter, Logo, Modal, TelegramLink } from './components/';
import { Area } from './components/area';

export default function Home() {
  const [data, setData] = useState<returnData>()
  const [showModal, setShowModal] = useState<boolean>(false);
  const [product, setProduct] = useState<BaseProduct | undefined>()

  const priceDisplay = (priceValue: number | number[] | undefined): string => {
    if (priceValue === undefined) return '' 
    let displayString = ''
    let displayAmounts = ['⅛', '¼', '½', 'oz']

    if (typeof priceValue === "number") {
        displayString = `$${priceValue}`
    } else if (Array.isArray(priceValue)) {
        if (priceValue.length === 2) displayAmounts = ['¼', 'oz']
        displayString = priceValue.map((val, index) => `$${val} ${displayAmounts[index]}`).join(" • ");
    }
    return displayString;
}

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/inventory');
      const result = await response.json()
      setData(result.data);
      console.log("data retrieved and set");
    };

    fetchData();
  }, []);
  if (!data) {
    return (
      <div className="loading-container">
          <Logo />
      </div> 
    )
  }

  return (
    <div className="wrapper">
      <div className="container">
        <div className='info-container'>
          <span className="info-text">hold any menu item for more information</span>
        </div>
        
      <div className="column-container">
        <div className="left-column">
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
        <div className="right-column">
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
          </div>
        </div>
      <SrvcFooter />
    </div>

    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {product !== undefined && (
        <div className='modal-wrapper'>
          <div className='modal-row'>
                <div className="modal-header">
                    <h2>{product?.name}</h2>
                    {product.type && <span className="modal-text">{product?.type}</span>}
                    <hr/>
                </div>
            </div>
            <div className='modal-row detail-row'>
                <span className="modal-prices">{priceDisplay(product.price)}</span>
            </div>
            <span className='modal-amount'>{product?.amount}</span>
            <div className='modal-row'>
                <span className="modal-text">{product.description}</span>
            </div>
          </div>
          )}
    </Modal>
  </div>
);
};
