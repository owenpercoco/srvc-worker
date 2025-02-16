"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { BaseProduct, categoryEnum, DataBaseProduct } from "@/data/inventory";
import { Accordion, Logo, Modal, ProductForm, ProductList, SettingsForm } from "../components";
import { TextField } from "@mui/material";


const SRVCpermissedkey = 'SRVC-permissed';

export default function Inventory() {
  const [permissed, setPermissed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SRVCpermissedkey) === 'allowed';
    }
    return false;
  });
  const [passKey, setPassKey] = useState('');
  const [passCheck, setPassCheck] = useState(false)
  const [products, setProducts] = useState<DataBaseProduct[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<BaseProduct>>({
    name: "",
    description: "",
    subtitle: "",
    type: undefined,
    price: undefined,
    quantity: 1,
    category: undefined,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.data);
      setIsLoading(false);
    }

    fetchProducts();
  }, []);

  const handlePassKey = async () => {
    setPassCheck(true);
    await fetch(`/api/passKey`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ passKey }),
    }).then(data => {
      if (data.status === 200) {
        setPermissed(true);
      }
    });
    setPassCheck(false)
  }

  const handleNewProductChange = (field: string, value: any) => {
    setNewProduct({ ...newProduct, [field]: value });
  };

  const handleSaveNewProduct = async (data: any) => {
    console.log(data)
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
        category: categoryEnum.sungrown,
      });
      setIsModalOpen(false);
      return true;
    } catch (error) {
      console.error("Failed to add new product:", error);
      return false;
    }
  };


  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SRVCpermissedkey, permissed ? 'allowed' : 'false');
    }
  }, [permissed]);

  if (isLoading) return <div>Loading...</div>;
  if (!permissed) return (
    <div className="logo-container pass-key-container column">
      <Logo />
      {passCheck && (<span>checking pass key</span>)}
      {!passCheck && <span>this area is protected</span>}

      <TextField
        value={passKey}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setPassKey(event?.target.value)}
        placeholder="password"
      />
      <button type="submit" onClick={handlePassKey} onTouchStart={handlePassKey}>enter</button>
    </div>
  );

  return (
    <div className="inventory-wrapper">
      <div className="settings-container">
        <SettingsForm />
      </div>
      <div className="inventory-container">
      <h2 className="text-3xl font-bold text-center bg-gray-100 p-4 rounded-lg">
        Current Products
      </h2>
        <ProductList products={products} setProducts={setProducts} />

        <button
          className="add-product-button"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Add New Product</h2>
          <ProductForm
            product={newProduct}
            onInputChange={handleNewProductChange}
            onSave={(data: any) => handleSaveNewProduct(data)}
            expanded
          />
        </Modal>
      </div>
    </div>
  );
}
