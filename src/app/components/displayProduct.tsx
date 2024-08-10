import React, { useState, Dispatch, SetStateAction, useRef, useEffect } from 'react';
import { BaseProduct } from '@/data/inventory';

interface FlowerProps {
  product: BaseProduct;
  setProduct: Dispatch<SetStateAction<BaseProduct | undefined>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const frontEndTypeMap = {
  'sativa': 'SAT',
  'indica': 'IND',
  'hybrid': 'HYB',
  'indicadominant': 'IH',
  'sativadominant': 'SH'
}

function priceArea(price: number | number[]): string {
  if (Array.isArray(price) && price.length > 0) {
    return price.map(value => `$${value}`).join(', ');
  }
  return `$${price}`;
}

export function DisplayProduct({ product, setProduct, setShowModal }: FlowerProps) {
  const [hover, setHover] = useState(false);
  const hovering = useRef<boolean>(false);

  const showDescription = Boolean(product.description);

  const handleTouch = () => {
    setHover(true);
    hovering.current = true;
    
    setTimeout(() => {
      if (hovering.current) {
        setProduct(product);
        setShowModal(true);
      } else {
        setProduct(undefined);
        setShowModal(false);
        setHover(false);
      }
    }, 500);
  };

  useEffect(() => {
    setTimeout(() => {
      if (hover) {
        setHover(false)
        hovering.current = false
      }
    }, 600)
   
  }, [hover])

  return (
    <div
      key={product.name}
      className={`product ${hover ? 'hover' : ''}`}
    >
      <div className="touch-response" onTouchStart={handleTouch}></div>
      <div className="hover-bg"></div>
      <div className="product-row">
        <span className="product-name">{product.name}</span>
        <span className="product-price">
          {priceArea(product.price || [])}
        </span>
        {product.amount !== undefined && (
          <span className="product-type">{product.amount}</span>
        )}
        {product.type !== undefined && (
          <span className="product-type">{frontEndTypeMap[product.type]}</span>
        )}
      </div>
      {showDescription && (
        <div className="product-row">
          <span className="product-description">{product.description}</span>
        </div>
      )}
    </div>
  );
}

export default DisplayProduct
