"use client";
import { useState, useEffect } from "react";
import { BaseProduct } from "@/data/inventory";
import ProductForm from "./components/productForm";

interface DataBaseProduct extends BaseProduct {
  _id: string;
  id: number;
}

export default function Inventory() {
  const [products, setProducts] = useState<DataBaseProduct[]>([]);
  const [newProduct, setNewProduct] = useState<BaseProduct>({
    name: "",
    description: "",
    subtitle: "",
    type: undefined,
    price: undefined,
    amount: "",
    quantity: 1,
    category: "sungrown",
  });
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

  const handleInputChange = (index: number, field: string, value: any) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setProducts(newProducts);
  };

  const handleNewProductChange = (field: string, value: any) => {
    setNewProduct({ ...newProduct, [field]: value });
  };

  const handleSaveProduct = async (index: number) => {
    const product = products[index];
    try {
      if (product._id) {
        await fetch(`/api/products/${product._id}`, {
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
      return true; // Indicate success
    } catch (error) {
      console.error("Failed to save product:", error);
      return false; // Indicate failure
    }
  };

  const handleSaveNewProduct = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
      const newProductData = await response.json();
      setProducts([...products, newProductData.data]);
      setNewProduct({
        name: "",
        description: "",
        subtitle: "",
        type: undefined,
        price: undefined,
        amount: "",
        quantity: 1,
        category: "sungrown",
      });
      return true
    } catch (error) {
      console.error("Failed to add new product:", error);
      return false
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="inventory-container">
      <h2>Add New Product</h2>
      <ProductForm
        product={newProduct}
        onInputChange={handleNewProductChange}
        onSave={handleSaveNewProduct}
        onDelete={() => setNewProduct({
          name: "",
          description: "",
          subtitle: "",
          type: undefined,
          price: undefined,
          amount: "",
          quantity: 1,
          category: "sungrown",
        })}
      />
      <h2>Inventory</h2>
      {products.map((product, index) => (
        <ProductForm
          key={product._id || index}
          product={product}
          onInputChange={(field, value) => handleInputChange(index, field, value)}
          onSave={() => handleSaveProduct(index)}
          onDelete={() => handleDeleteProduct(index)}
        />
      ))}
    </div>
  );
}
