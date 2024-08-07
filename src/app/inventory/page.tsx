"use client";
import { useState, useEffect } from "react";
import { BaseProduct, categoryEnum } from "@/data/inventory";
import { ProductForm, TextInput, ProductList } from "./components/";
import { Logo, Modal} from "../components";

interface DataBaseProduct extends BaseProduct {
  _id: string;
  id: number;
}
const SRVCpermissedkey = 'SRVC-permissed'
if (typeof window === 'undefined' ) {
  const localStorage = {}
}
export default function Inventory() {
  const [permissed, setPermissed] = useState(localStorage.getItem(SRVCpermissedkey) === 'allowed');
  const [passKey, setPassKey] = useState('');
  const [products, setProducts] = useState<DataBaseProduct[]>([]);
  const [newProduct, setNewProduct] = useState<BaseProduct>({
    name: "",
    description: "",
    subtitle: "",
    type: undefined,
    price: undefined,
    amount: "",
    quantity: 1,
    category: categoryEnum.sungrown,
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
    await fetch(`/api/passKey`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ passKey }),
    }).then(data => {
      if (data.status === 200) {
        setPermissed(true)

      }
    });
  }

  const handleNewProductChange = (field: string, value: any) => {
    setNewProduct({ ...newProduct, [field]: value });
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
        category: categoryEnum.sungrown,
      });
      setIsModalOpen(false);
      return true;
    } catch (error) {
      console.error("Failed to add new product:", error);
      return false;
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

  useEffect(() => {
    if (typeof window === 'undefined' ) return
    localStorage.setItem(SRVCpermissedkey, permissed ? 'allowed' : 'false');
  }, [permissed]);

  if (isLoading) return <div>Loading...</div>;
  if (!permissed) return (
    <div className="logo-container pass-key-container">
      <Logo/>
      this area is protected
      <TextInput
        value={passKey}
        setValue={setPassKey}
        placeholder="password"
        />
      <button type="submit" onClick={handlePassKey}>enter</button>
    </div>
  )
  return (
    <div className="inventory-container">
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
          onSave={handleSaveNewProduct}
          expanded
        />
      </Modal>
    </div>
  );
}
