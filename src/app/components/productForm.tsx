import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { BaseProduct, categoryEnum, Price } from '@/data/inventory';
import { TextField, Select, MenuItem, Button, SelectChangeEvent } from '@mui/material';
import Accordion from './accordion';
import ImageUploader from './imageUploader';

interface ProductFormProps {
  product: Partial<BaseProduct>;
  onInputChange: (field: string, value: any) => void;
  onSave: (data: any, imageUrl?: string) => Promise<boolean>;
  onDelete?: () => void;
  expanded?: boolean;
}

function ProductForm({ product, onInputChange, onSave, onDelete, expanded = false }: ProductFormProps) {
  const premiumDescriptions: [number, string][] = [[0.125, '⅛'], [0.25, '¼'], [0.5, '½'], [1, 'oz']];
  const sungrownDescriptions: [number, string][] = [[0.25, '¼'], [1, 'oz']];

  const { handleSubmit, watch, setValue, control, register } = useForm({
    defaultValues: {
      name: product.name,
      subtitle: product.subtitle || '',
      description: product.description || '',
      long_description: product.long_description || '',
      price: product.price || [],
      category: product.category || '',
      type: product.type || '',
      quantity: product.quantity,
      image: product.image,
    },
  });

  const { fields, append, remove } : {fields: Price[], append: any, remove: any}= useFieldArray({
    control,
    name: 'price',
  });

  const [isSaved, setIsSaved] = useState<null | boolean>(null);

  const handleQuantityChange = (increment: number) => {
    const newQuantity = Number(watch('quantity') || 1) + increment;
    setValue('quantity', newQuantity);
    onInputChange('quantity', newQuantity);
  };

  const handleCategoryChange = (value?: categoryEnum) => {
    if (value === undefined) return;
    setValue('category', value || '');
    onInputChange('category', value || '');

    if (value === 'sungrown') {
      setValue('price', sungrownDescriptions.map(([quantity, description]) => ({ amount: 0, quantity, description })));
    } else if (value === 'premium') {
      setValue('price', premiumDescriptions.map(([quantity, description]) => ({ amount: 0, quantity, description })));
    } else {
      setValue('price', []);
    }
  };

  const onSubmit = async (data: any) => {
    const imageUrl = watch('image');
    const category = watch('category');
    const long_description = watch('long_description');
    const success = await onSave({ ...data, image: imageUrl, category, long_description });
    setIsSaved(success);
    setTimeout(() => setIsSaved(null), 2000);
  };

  return (
    <Accordion title={watch('name') || 'Product Form'} expanded={expanded}>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="field-container">
          <TextField
            {...register('name')}
            label="name"
            variant="outlined"
            size="small"
            fullWidth
            onChange={(e) => {
              setValue('name', e.target.value);
              onInputChange('name', e.target.value);
            }}
          />
        </div>
        <div className="field-container">
          <TextField
            {...register('subtitle')}
            fullWidth
            label="subtitle"
            variant="outlined"
            size="small"
            onChange={(e) => {
              setValue('subtitle', e.target.value);
              onInputChange('subtitle', e.target.value);
            }}
          />
        </div>
        <div className="field-container description">
          <TextField
            {...register('description')}
            value={watch('description')}
            label="description"
            variant="outlined"
            size="small"
            fullWidth
            onChange={(e) => {
              setValue('description', e.target.value);
              onInputChange('description', e.target.value);
            }}
          />
        </div>
        <div className="field-container description">
          <TextField
            {...register('long_description')}
            value={watch('long_description')}
            label="long description"
            multiline
            rows={2}
            variant="outlined"
            size="small"
            fullWidth
            onChange={(e) => {
              setValue('long_description', e.target.value);
              onInputChange('long_description', e.target.value);
            }}
          />
        </div>
        <div className="field-container">
        <label>Indica/Sativa/Hybrid</label>
          <Select
            {...register('type')}
            value={watch('type')}
            size="small"
            fullWidth
            onChange={(e: SelectChangeEvent<string>) => {
              setValue('type', e.target.value);
              onInputChange('type', e.target.value);
            }}
          >
            <MenuItem value="indica">Indica</MenuItem>
            <MenuItem value="sativa">Sativa</MenuItem>
            <MenuItem value="hybrid">Hybrid</MenuItem>
            <MenuItem value="indicadominant">Ind Dom</MenuItem>
            <MenuItem value="sativadominant">Sat Dom</MenuItem>
          </Select>
        </div>
        <div className="field-container">
          <label>Image</label>
          <ImageUploader
            imageUrl={watch('image')}
            onImageUpload={(url) => {
              setValue('image', url);
              onInputChange('image', url);
            }}
            onImageDelete={() => {
              setValue('image', '');
              onInputChange('image', '');
            }}
          />
        </div>
        <div className="field-container">
          <label>Category</label>
          <Select
            {...register('category')}
            value={watch('category')}
            fullWidth
            onChange={(e) => handleCategoryChange(e.target.value as categoryEnum)}
          >
            <MenuItem value="">Select Category</MenuItem>
            <MenuItem value="sungrown">Sungrown</MenuItem>
            <MenuItem value="premium">Premium</MenuItem>
            <MenuItem value="edible">Edible</MenuItem>
            <MenuItem value="preroll">Preroll</MenuItem>
            <MenuItem value="concentrate">Concentrate</MenuItem>
            <MenuItem value="psychadelic">Psychadelic</MenuItem>
          </Select>
        </div>
        {watch('category') && (
          <>
            <label>Prices</label>
            {fields.map((field, index) => (
              <div key={`${product.name}-${field.quantity}`}  className="field-container">
                <div className="row">
                  <TextField
                    label="Quantity"
                    {...register(`price.${index}.quantity`)}
                    placeholder="Quantity"
                    fullWidth
                    size="small"
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setValue(`price.${index}.quantity`, value);
                      onInputChange(`price.${index}.quantity`, value);
                    }}
                  />
                  <TextField
                    label="Price ($)"
                    {...register(`price.${index}.amount`)}
                    placeholder="Price"
                    fullWidth
                    size="small"
                    onChange={(e) => {
                      let value;
                      if (e.target.value === '') value=0
                      else value = parseFloat(e.target.value);
                      setValue(`price.${index}.amount`, value);
                      onInputChange(`price.${index}.amount`, value);
                    }}
                  />
                  <TextField
                    label="Description"
                    {...register(`price.${index}.description`)}
                    placeholder="Description"
                    fullWidth
                    size="small"
                    onChange={(e) => {
                      setValue(`price.${index}.description`, e.target.value);
                      onInputChange(`price.${index}.description`, e.target.value);
                    }}
                  />
                  <Button onClick={() => remove(index)}>-</Button>
                </div>
              </div>
            ))}
            <Button onClick={() => append({ amount: 0, quantity: 0, description: '' })}>
              Add Price
            </Button>
          </>
        )}
        <div className="field-container">
          <div className="quantity-control">
            <Button type="button" onClick={() => handleQuantityChange(-1)}>-</Button>
            <TextField 
              label="quantity in stock"
              {...register('quantity')}
              fullWidth
              size="small"
              />
            <Button type="button" onClick={() => handleQuantityChange(1)}>+</Button>
          </div>
        </div>
        <div className="save-container">
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
        </div>
      </form>
    </Accordion>
  );
}

export default ProductForm;
