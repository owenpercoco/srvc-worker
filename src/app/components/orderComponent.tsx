import React, { useState, useEffect } from "react";
import { BaseProduct, Order, Price } from "@/data/inventory";
import { Dispatch, SetStateAction } from "react";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface OrderComponentProps {
  product: BaseProduct;
  order: Order;
  setOrder: Dispatch<SetStateAction<Order>>;
}

const OrderComponent: React.FC<OrderComponentProps> = ({ product, order, setOrder }) => {
  // Initialize selectedIndex with the index of the first price in the product.price array
  const [selectedIndex, setSelectedIndex] = useState<number>(
    Array.isArray(product.price) ? 0 : -1
  );

  useEffect(() => {
    // Update selectedIndex if the product or price array changes
    if (Array.isArray(product.price) && product.price.length > 0) {
      setSelectedIndex(0);
    }
  }, [product]);

  const handleAmountChange = (event: SelectChangeEvent<number>) => {
    setSelectedIndex(event.target.value as number);
  };

  const handleAddToOrder = () => {
    if (Array.isArray(product.price) && selectedIndex !== -1) {
      const selectedPrice = product.price[selectedIndex];
      setOrder((prevOrder) => ({
        ...prevOrder,
        orders: [
          ...prevOrder.orders,
          {
            amount: selectedPrice.amount,
            quantity: selectedPrice.quantity,
            description: selectedPrice.description,
            name: product.name,
          }
        ]
      }));
    }
  };

  return (
    <div className="order-container">
      <Select
        value={selectedIndex}
        onChange={handleAmountChange}
        variant="outlined"
        size="small"
        className="compact-select"
      >
        {Array.isArray(product.price) &&
          product.price.map((price, index) => (
            <MenuItem key={index} value={index}>
              {`${price.description} - $${price.amount}`}
            </MenuItem>
          ))}
      </Select>
      <span
        className="add-button"
        onClick={handleAddToOrder}
        role="button"
      >
        +
      </span>
    </div>
  );
};

export default OrderComponent;
