"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { BaseProduct, categoryEnum, DataBaseProduct } from "@/data/inventory";
import { Accordion, Logo, Modal, ProductForm, ProductList, SalesForm } from "../components";
import { TextField } from "@mui/material";
interface Sale {
  _id: string;
  telephone: string;
  products: string[];
  timestamp: string; // or Date, depending on how you manage dates
}

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
  const [sales, setSales] = useState<Sale[]>([]);
  const [telephoneOptions, setTelephoneOptions] = useState<string[]>([]);
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

    async function fetchSales() {
      const response = await fetch("/api/sales");
      const data = await response.json();
      setSales(data.sales);
      const uniqueTelephones: string[] = Array.from(new Set(data.sales.map((sale: any) => sale.telephone)));
      setTelephoneOptions(uniqueTelephones);
    }

    fetchProducts();
    fetchSales();
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

  const handleSaveSale = async (data: any) => {
    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const newSaleData = await response.json();
      setSales([...sales, newSaleData.data]);
      return true;
    } catch (error) {
      console.error("Failed to add new sale:", error);
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
    <div className="inventory-container">
      <Accordion title="Current Products" expanded={true}>
        <ProductList products={products} setProducts={setProducts} />
      </Accordion>

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

      <Accordion title="Sales" expanded={false}>
        <SalesForm onSave={handleSaveSale} products={products} telephoneOptions={telephoneOptions}/>
        <div className="sales-list">
          {sales.map((sale) => (
            <div key={sale._id} className="sale-item">
              <p>Telephone: {sale.telephone}</p>
              <p>Products: {sale.products.join(', ')}</p>
              <p>Date: {new Date(sale.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </Accordion>
    </div>
  );
}
