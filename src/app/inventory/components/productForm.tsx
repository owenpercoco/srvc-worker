import React, { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BaseProduct, categoryEnum } from '@/data/inventory';
import { TextField, Select, MenuItem, Button } from '@mui/material';

interface ProductFormProps {
  product: BaseProduct;
  onInputChange: (field: string, value: any) => void;
  onSave: (data: any) => Promise<boolean>;
  onDelete?: () => void;
  expanded?: boolean;
}

function ProductForm({ product, onInputChange, onSave, onDelete, expanded = false }: ProductFormProps) {
  const { handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      name: product.name,
      subtitle: product.subtitle || '',
      description: product.description || '',
      price: product.price !== undefined ? product.price.toString() : '',
      amount: product.amount || '',
      category: product.category,
      type: product.type || '',
      quantity: product.quantity,
    },
  });

  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isSaved, setIsSaved] = useState<null | boolean>(null);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleQuantityChange = (increment: number) => {
    const newQuantity = watch('quantity') + increment;
    setValue('quantity', newQuantity);
    onInputChange('quantity', newQuantity);
  };

  const handlePriceChange = (value: string) => {
    const prices = value.split(',').map(v => v.trim()).map(Number);
    if (prices.length === 1 && !isNaN(prices[0])) {
      setValue('price', value);
      onInputChange('price', prices[0]);
      onInputChange('prices', undefined);
    } else {
      setValue('price', value);
      onInputChange('price', undefined);
      onInputChange('prices', prices.filter(v => !isNaN(v)));
    }
  };

  const handleCategoryChange = (value: categoryEnum) => {
    setValue('category', value);
    onInputChange('category', value);
    if (value === 'sungrown') {
      setValue('price', '60,200');
      onInputChange('price', undefined);
      onInputChange('prices', [60, 200]);
    } else if (value === 'premium') {
      setValue('price', '50,80,160,300');
      onInputChange('price', undefined);
      onInputChange('prices', [50, 80, 160, 300]);
    } else {
      setValue('price', '');
      onInputChange('price', undefined);
      onInputChange('prices', undefined);
    }
  };

  const onSubmit = async (data: any) => {
    const success = await onSave(data);
    setIsSaved(success);
    setTimeout(() => setIsSaved(null), 2000);
  };

  return (
    <div>
      <div className="accordion-header" onClick={toggleAccordion}>
        <h2>{watch('name')}</h2>
        <span className="expand-arrow">{isExpanded ? '▲' : '▼'}</span>
      </div>
      {isExpanded && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="field-container">
            <label>Name</label>
            <TextField
              value={watch('name')}
              onChange={(e) => {
                setValue('name', e.target.value);
                onInputChange('name', e.target.value);
              }}
              placeholder="Name"
              fullWidth
            />
          </div>
          <div className="field-container description">
            <label>Description</label>
            <TextField
              value={watch('description')}
              onChange={(e) => {
                setValue('description', e.target.value);
                onInputChange('description', e.target.value);
              }}
              placeholder="Description"
              fullWidth
              multiline
              rows={4}
            />
          </div>
          <div className="field-container">
            <label>Image</label>
            <TextField
              type="file"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files[0]) {
                  onInputChange('image', e.target.files[0]);
                }
              }}
              fullWidth
            />
          </div>
          <div className="field-container">
            <label>Category</label>
            <Select
              value={watch('category')}
              onChange={(e) => handleCategoryChange(e.target.value as categoryEnum)}
              fullWidth
            >
              <MenuItem value="sungrown">Sungrown</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
              <MenuItem value="edible">Edible</MenuItem>
              <MenuItem value="preroll">Preroll</MenuItem>
              <MenuItem value="concentrate">Concentrate</MenuItem>
              <MenuItem value="psychadelic">Psychadelic</MenuItem>
            </Select>
          </div>
          {(watch('category') === 'sungrown' || watch('category') === 'premium' || watch('category') === 'preroll') && (
            <div className="field-container">
              <label>Type</label>
              <Select
                value={watch('type')}
                onChange={(e) => {
                  setValue('type', e.target.value);
                  onInputChange('type', e.target.value);
                }}
                fullWidth
              >
                <MenuItem value="">Select Type</MenuItem>
                <MenuItem value="indica">Indica</MenuItem>
                <MenuItem value="sativa">Sativa</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
              </Select>
            </div>
          )}
            <div className="field-container">
              <label>Price</label>
              <TextField
                value={watch('price')}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="Price"
                fullWidth
              />
            </div>
          {(watch('category') === 'concentrate' || watch('category') === 'edible' || watch('category') === 'psychadelic') && (
            <div className="field-container">
              <label>Amount</label>
              <TextField
                value={watch('amount')}
                onChange={(e) => {
                  setValue('amount', e.target.value);
                  onInputChange('amount', e.target.value);
                }}
                placeholder="Amount"
                fullWidth
              />
            </div>
          )}
          <div className="field-container">
            <div className="quantity-control">
              <Button type="button" onClick={() => handleQuantityChange(-1)}>-</Button>
              <span>{watch('quantity')}</span>
              <Button type="button" onClick={() => handleQuantityChange(1)}>+</Button>
            </div>
          </div>
          <Button type="submit">Save</Button>
          {isSaved !== null && (
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isSaved ? 'green' : 'red',
                marginLeft: '10px',
              }}
            ></span>
          )}
          <Button type="button" onClick={onDelete}>Delete</Button>
        </form>
      )}
    </div>
  );
}

export default ProductForm;
