import React, { useState, Dispatch, SetStateAction, useRef } from 'react';
import { BaseProduct } from '@/data/inventory';

interface FlowerProps {
  key: string;
  product: BaseProduct;
  setProduct: Dispatch<SetStateAction<BaseProduct>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

function priceArea(prices: number[] | number): string {
    if (typeof prices === 'number') {
        return `$${prices}`
    }
    const result = prices.map(value => `$${value}`);
    return result.join(' ');
}

export function DisplayProduct({ key, product, setProduct, setShowModal }: FlowerProps) {
  const [hover, setHover] = useState(false);
  const hovering = useRef<boolean>(false)

  const showDescription = Boolean(product.description);
  const showPrices = Boolean(product.prices || product.price);

  const handleTouch = () => {
    console.log("in here")
    setHover(true);
    hovering.current = true
    setTimeout(() => {
      if (hovering.current) {
          setProduct(product);
          setShowModal(true);
          setHover(false);
          hovering.current = false
      }
    }, 250);
  };

  const handleEnd = () => {
    hovering.current = false;
    setHover(false);
    setShowModal(false);
  }

  return (
    <div
      key={key}
      className={`product ${hover ? 'hover' : ''}`}
      onTouchStart={handleTouch}
      onTouchEnd={handleEnd}
      onMouseEnter={handleEnd}
      onMouseLeave={handleEnd}
    >
      <div className="product-row">
        <span className="product-name">{product.name}</span>
        {showPrices && <span className="product-price">{priceArea(product.prices || product.price || [])}</span>}
        <span className="product-type">{product.type}</span>
      </div>
      {showDescription && (
        <div className="product-row">
          <span className="product-description">{product.description}</span>
        </div>
      )}
    </div>
  );
}
