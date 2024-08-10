import React, { ChangeEvent, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { BaseProduct, categoryEnum } from '@/data/inventory';
import { TextField, Select, MenuItem, Button } from '@mui/material';
import Accordion from './accordion';
import Image from 'next/image';
import type { PutBlobResult } from '@vercel/blob';

interface ProductFormProps {
  product: Partial<BaseProduct>;
  onInputChange: (field: string, value: any) => void;
  onSave: (data: any, imageUrl?: string) => Promise<boolean>;
  onDelete?: () => void;
  expanded?: boolean;
}

function ProductForm({ product, onInputChange, onSave, onDelete, expanded = false }: ProductFormProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const { handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      name: product.name,
      subtitle: product.subtitle || '',
      description: product.description || '',
      price: product.price !== undefined ? product.price.toString() : '',
      amount: product.amount || '',
      category: product.category || '',
      type: product.type || '',
      quantity: product.quantity,
      image: product.image,
    },
  });

  const [isSaved, setIsSaved] = useState<null | boolean>(null);

  const handleQuantityChange = (increment: number) => {
    const newQuantity = (watch('quantity') || 1) + increment;
    setValue('quantity', newQuantity);
    onInputChange('quantity', newQuantity);
  };

  const handlePriceChange = (value: string) => {
    const prices = value.split(',').map(v => v.trim()).map(Number);
    if (prices.length === 1 && !isNaN(prices[0])) {
      setValue('price', value);
      onInputChange('price', prices[0]);
    } else {
      setValue('price', value);
      onInputChange('price', prices.filter(v => !isNaN(v)));
    }
  };

  const handleCategoryChange = (value?: categoryEnum) => {
    if (value === undefined) return;
    setValue('category', value || '');
    onInputChange('category', value || '');
    if (value === 'sungrown') {
      setValue('price', '60,200');
      onInputChange('price', [60, 200]);
    } else if (value === 'premium') {
      setValue('price', '50,80,160,300');
      onInputChange('price', [50, 80, 160, 300]);
    } else {
      setValue('price', '');
      onInputChange('price', '');
    }
  };

  const handleImageUpload = async () => {
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }
    console.log("in handle image upload")
    const file = inputFileRef.current.files[0];
    setUploading(true);
    
    const response = await fetch(`/api/files?filename=${file.name}`, {
      method: 'POST',
      body: file,
    });
    const newBlob = (await response.json()) as PutBlobResult;
    setUploading(false);
    setBlob(newBlob);

    if (newBlob.url) {
      setValue('image', newBlob.url);
      onInputChange('image', newBlob.url);
    }
    return newBlob.url
  };

  const onSubmit = async (data: any) => {
    let imageUrl = watch('image')
    let category = watch('category')
    const success = await onSave({image:imageUrl, category});
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
          <input
            type="file"
            ref={inputFileRef}
            disabled={uploading}
            onChange={handleImageUpload}
          />
          {uploading && <span>Uploading...</span>}
          {blob?.url || product.image && (
            <Image
              src={blob?.url || product.image}
              alt="Product Image"
              width={250} // Adjust width as needed
              height={250} // Adjust height as needed
              objectFit="cover"
            />
          )}
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
            <div className="field-container">
              <label>Price</label>
              <TextField
                value={watch('price')}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="Price"
                fullWidth
              />
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
          </>
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
    </Accordion>
  );
}

export default ProductForm;
