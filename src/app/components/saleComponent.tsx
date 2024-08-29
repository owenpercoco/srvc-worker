import React, { useState } from 'react';
import { ISale } from '@/models/Sale'
import { Button, Card, Chip, CardContent, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
interface SaleCardProps {
  sale: Partial<ISale>;
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
        onSaleConfirmed();
      } else {
        console.error('Failed to confirm sale:', await response.text());
      }
    } catch (error) {
      console.error('Failed to confirm sale:', error);
    }
  };

  return (
    <Card variant="outlined"  sx={{ borderRadius: '35px', p: 1, m: 1 }}>
      <div className='column'>
        <CardContent>
            <div className="row">
              <Grid container spacing={1} sx={{m:1}}>
                <Grid xs={12} sx={{my:1}}>
                  <TextField label="telephone" value={sale.telephone} variant="outlined" size="small"/>
                </Grid>
                <Grid xs={12}>
                  <Grid container spacing={1}>
                    <Grid xs={6}>
                      <TextField label="total" value={sale.total} variant="outlined" size="small"/>
                    </Grid>
                    <Grid xs={6}>
                      <TextField label="amount paid" value={sale.amount_paid} variant="outlined" size="small"/>
                    </Grid>
                  </Grid>
                  
                </Grid>
              </Grid>
                <Button variant="outlined" sx={{my:1, height: 3/4}} onClick={confirmSale}>Edit</Button>
            </div>
            
        <div className='row'>
             {!sale.confirmed && (
          <Button variant="contained" onClick={confirmSale}>Confirm Sale</Button>
        )}
        </div>
       
        <div>
          <Grid container spacing={1} rowSpacing={2}>
            {sale.orders!.map((order, index) => (
              <Grid xs={12} sm={6} key={index}>
               <Chip
                    label={`${order.name} - ${order.quantity} - $${order.amount}`}
                    
                  />
              </Grid>
              ))}
          </Grid>
          <span>{sale.description}</span>
        </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default SaleComponent;
