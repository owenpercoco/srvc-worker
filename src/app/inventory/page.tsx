"use client";
import { useState, useEffect } from "react";
import { BaseProduct  } from "@/data/inventory";
import { TextInput } from "./components";
interface DataBaseProduct extends BaseProduct {
  id: number;
}

export default function Inventory() {
  const [products, setProducts] = useState<DataBaseProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.data);
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        name: "",
        description: "",
        subtitle: "",
        type: undefined,
        price: undefined,
        prices: [],
        amount: "",
        quantity: 1,
        category: "sungrown",
      },
    ]);
  };

  const handleInputChange = (index: number, field: string, value: any) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setProducts(newProducts);
  };

  const handleSaveProduct = async (index: number) => {
    const product = products[index];
    if (product.id) {
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
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
  };

  const handleDeleteProduct = async (index: number) => {
    const product = products[index];
    if (product.id) {
      await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      const newProducts = products.filter((_, i) => i !== index);
      setProducts(newProducts);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="inventory-container">
      <button onClick={handleAddProduct}>+ Add Product</button>
      {products.map((product, index) => (
        <ProductForm
          key={product.id || index}
          product={product}
          onInputChange={(field, value) => handleInputChange(index, field, value)}
          onSave={() => handleSaveProduct(index)}
          onDelete={() => handleDeleteProduct(index)}
        />
      ))}
    </div>
  );
}

interface ProductFormProps {
  product: BaseProduct;
  onInputChange: (field: string, value: any) => void;
  onSave: () => void;
  onDelete: () => void;
}

function ProductForm({ product, onInputChange, onSave, onDelete }: ProductFormProps) {
  return (
    <div>
      <form>
          <TextInput
            value={product.name}
            setValue={(value) => onInputChange("name", value)}
          />
        <button type="button" onClick={onSave}>Save</button>
        <button type="button" onClick={onDelete}>Delete</button>
      </form>
    </div>
  );
}
