import React, { useState, Dispatch, SetStateAction, useRef, useEffect } from 'react';
import { BaseProduct, Price } from '@/data/inventory';

interface FlowerProps {
  product: BaseProduct;
  setProduct: Dispatch<SetStateAction<BaseProduct | undefined>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const frontEndTypeMap = {
  'sativa': 'SAT',
  'indica': 'IND',
  'hybrid': 'HYB',
  'indicadominant': 'HYB/I',
  'sativadominant': 'HYB/S'
}

const priceDisplay = (priceValue: Price | Price[] | undefined): string => {
  if (priceValue === undefined) return '' 
  let displayString = ''

  if (Array.isArray(priceValue)) {
      displayString = priceValue.map((price) => `$${price.amount}`).join(" ");
  } else {
    displayString = `$${priceValue.amount} ${priceValue.description}`
  }
  return displayString;
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
      className={`product flex flex-col pt-[10px] px-[4px] pb-0 ${hover ? 'hover' : ''}`}
    >
      <div className="touch-response" onTouchStart={handleTouch}></div>
      <div className="hover-bg"></div>
      <div className="product-row flex flex-row justify-between">
        <span className="text-[9px] uppercase font-semibold mr-auto shrink">{product.name}</span>
        <span className="text-[9px] uppercase font-semibold shrink-0">
          {priceDisplay(product.price)}
        </span>
        {product.type && (
          <span className="text-[9px] font-semibold pl-1">{frontEndTypeMap[product.type]}</span>
        )}
      </div>
      {showDescription && (
        <div className="flex flex-1 gap-1 justify-between pb-2">
          <span className="text-[10px] font-medium lowercase">{product.description}</span>
        </div>
      )}
    </div>
  );
}

export default DisplayProduct
