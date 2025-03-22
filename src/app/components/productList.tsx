"use client";
import { Dispatch, SetStateAction } from "react";
import { DataBaseProduct } from "@/data/inventory";
import { ProductForm, ProductFormWrapper } from "../components";
import { useMemo } from 'react';

interface ProductListProps {
    products: DataBaseProduct[]
    setProducts: Dispatch<SetStateAction<DataBaseProduct[]>>
}


export default function ProductList({ products, setProducts }: ProductListProps) {
  const groupedProducts = useMemo(() => {
    return products.reduce((acc: any, product: DataBaseProduct) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});
  }, [products]);

    const handleInputChange = (index: number, field: string, value: any) => {
        const newProducts = [...products];
        newProducts[index] = { ...newProducts[index], [field]: value };
        setProducts(newProducts);
      };
    
    
      const handleSaveProduct = async (product: DataBaseProduct, data?: Partial<DataBaseProduct>) => {
        try {
          if (product._id) {
            // Update existing product
            const response = await fetch(`/api/products/${product._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ...product, ...data }),
            });
      
            if (!response.ok) {
              throw new Error("Failed to update product");
            }
      
            const updatedProduct = await response.json();
      
            // Update state without altering order
            setProducts((prevProducts) =>
              prevProducts.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
            );
          } else {
            // Add new product
            const response = await fetch("/api/products", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(product),
            });
      
            if (!response.ok) {
              throw new Error("Failed to create product");
            }
      
            const newProduct = await response.json();
      
            // Append new product to the end of the list
            setProducts((prevProducts) => [...prevProducts, newProduct]);
          }
          return true; // Indicate success
        } catch (error) {
          console.error("Failed to save product:", error);
          return false; // Indicate failure
        }
      };
      
    
  
    return (
    <div className="pb-16">
      {Object.entries(groupedProducts).map(([category, products] : [any, any]) => (
        <div key={category} title={category} className="py-6">
          <span className="text-lg font-semibold text-zinc-600 rounded-md block p-[12px]">
            category: {category}
          </span>
          {products.map((product: DataBaseProduct, index: number) => (
            <ProductFormWrapper product={product} key={index}>
              <ProductForm
                key={index}
                product={product}
                onInputChange={(field, value) => handleInputChange(index, field, value)}
                onSave={(data) => handleSaveProduct(product, data)}
              />
            </ProductFormWrapper>
          ))}
        </div>
      ))}
    </div>
  );
}
