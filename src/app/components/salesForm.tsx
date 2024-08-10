import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Autocomplete } from '@mui/material';
import { DataBaseProduct } from '@/data/inventory';

interface SalesFormProps {
  products: DataBaseProduct[];
  telephoneOptions: string[];
  onSave: (data: any) => Promise<boolean>;
}

const SalesForm = ({ products, telephoneOptions, onSave }: SalesFormProps) => {
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      telephone: '',
      products: [],
    },
  });

  const productOptions = products.map((product: any) => product.name);

  const onSubmit = async (data: any) => {
    const success = await onSave(data);
    if (success) {
      setValue('telephone', '');
      setValue('products', []);
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
          name="products"
          control={control}
          render={({ field }) => (
            <Autocomplete
              multiple
              options={productOptions}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField {...params} {...field} placeholder="Select products" fullWidth />
              )}
              onChange={(event, value) => field.onChange(value)}
            />
          )}
        />
      </div>
      <Button type="submit">Save Sale</Button>
    </form>
  );
};

export default SalesForm;
