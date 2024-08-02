import React, { useState, Dispatch, SetStateAction, useRef } from 'react';
import { BaseProduct } from '@/data/inventory';

interface FlowerProps {
  key: string;
  product: BaseProduct;
  setProduct: Dispatch<SetStateAction<BaseProduct | undefined>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

function priceArea(price: number | number[]): string {
  if (Array.isArray(price) && price.length > 0) {
    return price.map(value => `$${value}`).join(', ');
  }
  return `$${price}`;
}

export function DisplayProduct({ key, product, setProduct, setShowModal }: FlowerProps) {
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
      }
    }, 250);
  };

  const handleEnd = () => {
    hovering.current = false;
    setHover(false);
    setShowModal(false);
  };

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
          <span className="product-price">
            {priceArea(product.price || [])}
          </span>
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
