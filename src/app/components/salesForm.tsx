import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Autocomplete, Chip } from '@mui/material';
import { DataBaseProduct } from '@/data/inventory';
import { v4 as uuidv4 } from 'uuid';
import { watch } from 'fs';

interface SalesFormProps {
  products: DataBaseProduct[];
  telephoneOptions: string[];
  onSave: (data: any) => Promise<boolean>;
}

const SalesForm = ({ products, telephoneOptions, onSave }: SalesFormProps) => {
  const { handleSubmit, control, setValue, register } = useForm({
    defaultValues: {
      telephone: '',
      orders: [],
      description: '',
    },
  });

  const amountMap = new Map<string, string>([
    ['0.125', '⅛'],
    ['0.25', '¼'],
    ['0.5', '½'],
    ['1', 'oz'],
  ]);

  const productOptions = products.flatMap((product: DataBaseProduct) => {
    if (Array.isArray(product.price)) {
      return product.price.map((price, index) => {
        let quantity: string = String(price.quantity);
        if (product.category === 'sungrown' || product.category === 'premium') {
          quantity = amountMap.get(quantity)!;
        }
        return {
          id: uuidv4(), // Unique identifier for each product option
          label: `${product.name} - ${quantity} - ${price.amount}$`,
          value: product._id,
          price: price.amount,
          quantity: quantity,
          name: product.name,
          category: product.category,
          description: '',
        };
      });
    } else {
      return [{
        id: uuidv4(),
        label: `${product.name} - ${product.amount || '1'} - ${product.price}$`,
        value: product._id,
        price: product.price.amount,
        quantity: product.amount || '1',
        name: product.name,
        category: product.category,
        description: '',
      }];
    }
  });

  const onSubmit = async (data: any) => {

    const formattedData = {
      ...data,
      confirmed: false,
      orders: data.orders.map((selectedProduct: any) => ({
            amount: selectedProduct.price,
            quantity: selectedProduct.quantity,
            name: selectedProduct.name,
      })),
    };
    console.log(formattedData)
    const success = await onSave(formattedData);
    if (success) {
      setValue('telephone', '');
      setValue('orders', []);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="field-container">
        <label>Telephone</label>
        <Controller
          name="telephone"
          control={control}
          render={({ field }) => (
            <Autocomplete
              freeSolo
              options={telephoneOptions}
              renderInput={(params) => (
                <TextField {...params} {...field} placeholder="Enter or select a telephone number" fullWidth />
              )}
              onInputChange={(event, value) => field.onChange(value)}
              onChange={(event, value) => {
                if (typeof value === 'string') {
                  field.onChange(value);
                } else if (value) {
                  field.onChange(value as string);
                }
              }}
            />
          )}
        />
      </div>
      <div className="field-container">
        <label>Products</label>
        <Controller
          name="orders"
          control={control}
          render={({ field }) => (
            <Autocomplete
              multiple
              value={field.value}
              options={productOptions.sort((a, b) => -b.category.localeCompare(a.category))}
              groupBy={(option) => option.category}
              getOptionLabel={(option) => option.label}
              filterSelectedOptions={false} // Important to allow duplicates
              includeInputInList
              isOptionEqualToValue={(option, value) => option.id === value.id} 
              renderInput={(params) => (
                <TextField {...params} placeholder="Select products" fullWidth />
              )}
              onChange={(event, value) => {
                  const newValue = [
                    ...value.map((item: any) => ({ ...item, id: uuidv4() })),
                  ];
                  console.log(newValue)
                  field.onChange(newValue);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={`${option.name} - ${option.quantity} - $${option.price}`}
                    {...getTagProps({ index })}
                    key={option.id} 
                  />
                ))
              }
            />
          )}
        />
      </div>
      <TextField label="notes" variant='outlined' {...register('description')} />

      <Button type="submit">Save Sale</Button>
    </form>
  );
};

export default SalesForm;
