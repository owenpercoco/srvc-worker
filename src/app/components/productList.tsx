"use client";
import { Dispatch, SetStateAction } from "react";
import { BaseProduct, DataBaseProduct } from "@/data/inventory";
import { ProductForm } from "../components";
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
    
    
      const handleSaveProduct = async (index: number, data?: any) => {
        const product = products[index];
        console.log("attempting save of ", {
          ...product,
          ...data
        })

        try {
          if (product._id) {
            await fetch(`/api/products/${product._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({...product, ...data}),
            });
          } else {
            const response = await fetch("/api/products", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(product),
            });
            const newProduct = await response.json();
            const newProducts = [...products];
            newProducts[index] = newProduct.data;
            setProducts(newProducts);
          }
          return true; // Indicate success
        } catch (error) {
          console.error("Failed to save product:", error);
          return false; // Indicate failure
        }
      };

    
      const handleDeleteProduct = async (id: string | undefined) => {
        if (!id) return
        const product = products.find(item => item._id === id)
        const _id = product!._id
        console.log(product);
        if (id) {
          await fetch(`/api/products/${product!._id}`, {
            method: "DELETE",
          });
          const newProducts = products.filter((product, i) => product._id !== id);
          console.log('settings new product', newProducts);
          setProducts(newProducts);
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
            <ProductForm
              key={index}
              product={product}
              onInputChange={(field, value) => handleInputChange(index, field, value)}
              onSave={(data) => handleSaveProduct(index, data)}
              onDelete={() => handleDeleteProduct(product._id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
