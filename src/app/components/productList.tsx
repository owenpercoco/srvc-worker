"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { BaseProduct, categoryEnum, DataBaseProduct } from "@/data/inventory";
import { ProductForm, Accordion } from "../components";
import { useMemo } from 'react';

interface ProductListProps {
    products: DataBaseProduct[]
    setProducts: Dispatch<SetStateAction<DataBaseProduct[]>>
}


export default function ProductList({ products, setProducts }: ProductListProps) {
  const groupedProducts = useMemo(() => {
    return products.reduce((acc: any, product: any) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});
  }, [products]);

  useEffect(() => {
    console.log("Grouped Products:", groupedProducts);
  }, [groupedProducts]);

  let currentCategory = '';
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

    
      const handleDeleteProduct = async (index: number) => {
        const product = products[index];
        if (product._id) {
          await fetch(`/api/products/${product._id}`, {
            method: "DELETE",
          });
          const newProducts = products.filter((_, i) => i !== index);
          setProducts(newProducts);
        }
      };
    
  
    return (
    <div className="inventory-container">
      <h2>Inventory</h2>
      {Object.entries(groupedProducts).map(([category, products] : [any, any]) => (
        <div key={category} title={category}>
          <span className="text-lg font-semibold text-zinc-600 rounded-md">
            {category}
          </span>
          {products.map((product: BaseProduct, index: number) => (
            <ProductForm
              key={index}
              product={product}
              onInputChange={(field, value) => handleInputChange(index, field, value)}
              onSave={(data) => handleSaveProduct(index, data)}
              onDelete={() => handleDeleteProduct(index)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
