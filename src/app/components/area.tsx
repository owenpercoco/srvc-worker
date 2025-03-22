import React, { Dispatch, SetStateAction } from 'react';
import { ConcentrateProduct, BaseProduct } from '@/data/inventory';
import { DisplayProduct } from './displayProduct'

interface Props {
  title: string;
  premium?: boolean;
  product: BaseProduct[];
  setProduct: Dispatch<SetStateAction<BaseProduct | undefined>>
  setShowModal: Dispatch<SetStateAction<boolean>>
}



function Area({title, premium = false, product, setProduct, setShowModal }: Props) {
    function headerFromTitle(title: string) {
        switch (title) {
            case 'sun grown': {
                return (
                    <>
                        <h2 className="text-[12px]!">sun grown</h2>
                        <span className="text-[8px] font-black uppercase flex items-center">1/4 • oz • type</span>
                    </>
                )
            }
            case 'premium': {

                return (
                <>
                    <h2 className="text-[10px]! text-white">premium</h2>
                    <span className="text-[8px] font-black uppercase flex items-center text-white">1/8 • 1/4 • 1/2 • oz • type</span>
                </>)
            }
            default: {
            return (
                    <>
                        <h2 className="text-[12px]! uppercase">{title}</h2>
                    </>
                )  
            }

        }

    }
  if (product === undefined || product.length == 0) {
    return (
      <div className="area-container flex flex-col pb-1 flex-1 my-auto">
        <div className={`uppercase flex justify-between text-[8px] px-1 mb-1 area-header ${premium ? 'bg-black text-white' : 'text-black border-t border-black pt-1'}`}>
          {headerFromTitle(title)}
        </div>
        <div className="p-4 rounded-lg text-center">
          <span className="text-green-500 font-bold">SOLD OUT</span>
        </div>
      </div>
    );
  }
  return (
    <div className="area-container flex flex-col pb-1 flex-1 my-auto">
      <div className={`uppercase flex justify-between text-[8px] px-1 mb-1 area-header ${premium ? 'bg-black text-white' : 'text-black border-t border-black pt-1'}`}>
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

export default Area;
