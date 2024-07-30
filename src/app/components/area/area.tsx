import React, { Dispatch, SetStateAction } from 'react';
import { ConcentrateProduct, BaseProduct } from '@/data/inventory';
import { DisplayProduct } from './components/displayProduct'

interface Props {
  title: string;
  premium?: boolean;
  product: BaseProduct[];
  setProduct: Dispatch<SetStateAction<BaseProduct | undefined>>
  setShowModal: Dispatch<SetStateAction<boolean>>
}



function ConcentratesArea({title, premium = false, product, setProduct, setShowModal }: Props) {
    function headerFromTitle(title: string) {
        switch (title) {
            case 'sun grown': {
                return (
                    <>
                        <span><h2>sun grown</h2></span>
                        <span className="header-text">1/4 • oz • type</span>
                    </>
                )
            }
            case 'premium': {

                return (
                <>
                    <span><h2>premium</h2></span>
                    <span className="header-text">1/8 • 1/4 • 1/2 • oz • type</span>
                </>)
            }
            default: {
            return (
                    <>
                        <h2>{title}</h2>
                    </>
                )  
            }

        }

    }
  return (
    <div className="product-container">
      <div className={`product-header ${premium ? 'premium' : ''}`}>
        {headerFromTitle(title)}
      </div>
      <div className="product-list">
        {product.map((product) => (
          <DisplayProduct 
            key={product.name}
            product={product}
            setProduct={setProduct}
            setShowModal={setShowModal}/>
        ))}
      </div>
    </div>
  );
}

export default ConcentratesArea;
