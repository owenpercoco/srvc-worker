import React from 'react';
import { Button, Card, CardHeader, CardContent } from '@mui/material';
interface SaleCardProps {
  sale: {
    _id: string;
    telephone: string;
    total: number;
    description?: string;
    orders: Array<{
        amount: number;
        quantity: string;
        description?: string;
        name: string;
    }>;
    confirmed: boolean;
  };
  onSaleConfirmed: () => void; // Callback to refresh the sales list after confirmation
}

const SaleComponent = ({ sale, onSaleConfirmed }: SaleCardProps) => {
  const confirmSale = async () => {
    try {
      const response = await fetch(`/api/sales/${sale._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirmed: true }),
      });

      if (response.ok) {
        onSaleConfirmed(); // Trigger a callback to refresh the sales list
      } else {
        console.error('Failed to confirm sale:', await response.text());
      }
    } catch (error) {
      console.error('Failed to confirm sale:', error);
    }
  };

  return (
    <Card key={sale._id} variant="outlined">
      <div className='column'>
        <CardContent>
            <div className="row">
                <h5>Telephone: {sale.telephone}</h5>
                <h5>Total: {sale.total}</h5>
            </div>
            
        <div className='row'>
             {!sale.confirmed && (
          <Button variant="contained" onClick={confirmSale}>Confirm Sale</Button>
        )}
        </div>
       
        <div>
          {sale.orders.map((order, index) => (
            <div key={index}>
                <p>
                  {`${order.quantity}x ${order.name} - $${order.amount}`}
                </p>
            </div>
            
          ))}
          <span>{sale.description}</span>
        </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default SaleComponent;
