import React, { ReactNode, useState } from 'react';
import { BaseProduct } from '@/data/inventory';
import { Edit } from "@mui/icons-material";
import Modal from './modal';


interface ProductFormProps {
  product: Partial<BaseProduct>;
  expanded?: boolean;
  children: ReactNode;
}

function ProductFormWrapper({ product, expanded = false, children }: ProductFormProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(expanded);

  

  return (
    <>
      {/* Product Info Bar */}
        <div className="flex items-center justify-between w-full p-3 border-b border-gray-300 bg-gray-100">
        {/* Stock Status Indicator */}
        <div className={`w-3 h-3 rounded-full ${product.is_in_stock ? "bg-green-500" : "bg-red-500"}`} />

        {/* Product Name */}
        <span className="text-lg font-medium">{product.name}</span>

        {/* Amount in Stock */}
        <span className="text-gray-600">{product.amount_in_stock} in stock</span>

        {/* Edit Button */}
        <button onClick={() => setIsModalOpen(true)} className="text-gray-600 hover:text-gray-800">
          <Edit />
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {children}
      </Modal>
    </>
  );
}

export default ProductFormWrapper;
