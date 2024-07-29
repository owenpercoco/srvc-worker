"use client"
import { useEffect, useState } from 'react';
import { returnData, BaseProduct } from '@/data/inventory';
import { SrvcFooter, Logo, Modal, TelegramLink } from './components/';
import { Area } from './components/area';

export default function Home() {
  const [data, setData] = useState<returnData>()
  const [showModal, setShowModal] = useState<boolean>(false);
  const [product, setProduct] = useState<BaseProduct | undefined>()

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/inventory');
      const result = await response.json()
      setData(result.data);
      console.log(data)
    };

    fetchData();
  }, []);
  if (!data) {
    return <Logo />;
  }

  return (
    <div className="wrapper">
      <div className="container">
      <div className="column-container">
        <div className="left-column">
            <Logo />
            {/* Render Sungrown Products */}
            <hr/>
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
              product={data.psychedelic}
              setProduct={setProduct} 
              setShowModal={setShowModal}
            />
        </div>
        <div className='middle-seperator'></div>
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

    <Modal show={showModal} setShowModal={setShowModal} product={product}/>
  </div>
);
};
