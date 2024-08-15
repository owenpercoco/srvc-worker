import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { BaseProduct, categoryEnum, Price } from '@/data/inventory';
import { TextField, Select, MenuItem, Button } from '@mui/material';
import Accordion from './accordion';
import ImageUploader from './ImageUploader'; // Import the new component

interface ProductFormProps {
  product: Partial<BaseProduct>;
  onInputChange: (field: string, value: any) => void;
  onSave: (data: any, imageUrl?: string) => Promise<boolean>;
  onDelete?: () => void;
  expanded?: boolean;
}

function ProductForm({ product, onInputChange, onSave, onDelete, expanded = false }: ProductFormProps) {

  const { handleSubmit, watch, setValue, control } = useForm({
    defaultValues: {
      name: product.name,
      subtitle: product.subtitle || '',
      description: product.description || '',
      price: (() => {
        if (Array.isArray(product.price)) {
          // Check if it's the old array format (array of numbers)
          if (product.price.every(p => typeof p === 'number')) {
            // Convert array of numbers to array of Price objects
            return product.price.map((p, index) => {
              let description = `pack`;
              let quantity = 1
              if (product.category === 'sungrown') {
                const sungrownDescriptions : [number, string][] = [[.25, '¼'], [1, 'oz']] ;
                description = sungrownDescriptions[index][1]
                quantity = sungrownDescriptions[index][0]
              } else if (product.category === 'premium') {
                const premiumDescriptions : [number, string][] = [[.125, '⅛'], [.25, '¼'], [.5, '½'], [1, 'oz']];
                description = premiumDescriptions[index][1]
                quantity = premiumDescriptions[index][0]
              }
              return {
                amount: p,
                quantity: quantity,
                description: description,
              };
            });
          } else if (product.price.every(p => typeof p === 'object' && p.amount !== undefined)) {
            return product.price;
          }
        } else if (typeof product.price === 'number') {
          // Old format with single number price
          return [{
            amount: product.price,
            quantity: 1,
            description: product.amount || '',
          }];
        }
        // If none of the above, return an empty array
        return [];
      })(),
      category: product.category || '',
      type: product.type || '',
      quantity: product.quantity,
      image: product.image,
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'price',
  });
  

 
  const [isSaved, setIsSaved] = useState<null | boolean>(null);

  const handleQuantityChange = (increment: number) => {
    const newQuantity = (watch('quantity') || 1) + increment;
    setValue('quantity', newQuantity);
    onInputChange('quantity', newQuantity);
  };

  const handleCategoryChange = (value?: categoryEnum) => {
    if (value === undefined) return;
    setValue('category', value || '');
    onInputChange('category', value || '');

    if (value === 'sungrown') {
      setValue('price', [
        { amount: 60, quantity: .25, description: '¼ oz' },
        { amount: 200, quantity: 1, description: '1 oz' },
      ]);
    } else {
      setValue('price', []);
    }
  };

  const onSubmit = async (data: any) => {
    const imageUrl = watch('image');
    const category = watch('category');
    const success = await onSave({ ...data, image: imageUrl, category });
    setIsSaved(success);
    setTimeout(() => setIsSaved(null), 2000);
  };

  return (
    <Accordion title={watch('name') || 'Product Form'} expanded={expanded}>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
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
            size="small"
          />
        </div>
        <div className="field-container">
          <label>Subtitle</label>
          <TextField
            value={watch('subtitle')}
            onChange={(e) => {
              setValue('subtitle', e.target.value);
              onInputChange('subtitle', e.target.value);
            }}
            placeholder="Subtitle"
            fullWidth
            size="small"
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
            rows={2}
          />
        </div>
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
            value={watch('category')}
            onChange={(e) => handleCategoryChange(e.target.value as categoryEnum)}
            fullWidth
            defaultValue=""
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
              <div key={field.id} className="field-container">
                <div style={{ display: 'flex', gap: '10px' }}>
                  <TextField
                    label="Quantity"
                    value={field.quantity}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setValue(`price.${index}.quantity`, value);
                      onInputChange(`prices.${index}.quantity`, value);
                    }}
                    placeholder="Quantity"
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Price ($)"
                    value={field.amount}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setValue(`price.${index}.amount`, value);
                      onInputChange(`prices.${index}.amount`, value);
                    }}
                    placeholder="Price"
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Description"
                    value={field.description}
                    onChange={(e) => {
                      setValue(`price.${index}.description`, e.target.value);
                      onInputChange(`prices.${index}.description`, e.target.value);
                    }}
                    placeholder="Description"
                    fullWidth
                    size="small"
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
            <span>{watch('quantity')}</span>
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
