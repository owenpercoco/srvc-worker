import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BaseProduct } from '@/data/inventory';
import TextInput from './TextInput';

interface ProductFormProps {
  product: BaseProduct;
  onInputChange: (field: string, value: any) => void;
  onSave: (data: any) => Promise<boolean>;
  onDelete: () => void;
}

function ProductForm({ product, onInputChange, onSave, onDelete }: ProductFormProps) {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      name: product.name,
      description: product.description || '',
      price: product.price !== undefined ? product.price.toString() : '',
      quantity: product.quantity,
    },
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState<null | boolean>(null); // null indicates no save attempt

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

  const onSubmit = async (data: any) => {
    const success = await onSave(data);
    setIsSaved(success);
    setTimeout(() => setIsSaved(null), 2000); // Reset after 2 seconds
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
            <TextInput
              value={watch('name')}
              setValue={(value) => {
                setValue('name', value);
                onInputChange('name', value);
              }}
              placeholder="Name"
            />
          </div>
          <div className="field-container description">
            <label>Description</label>
            <TextInput
                value={watch('description')}
                setValue={(value) => {
                setValue('description', value);
                onInputChange('description', value);
                }}
                placeholder="Description"
            />
          </div>
          <div className="field-container">
            <label>Price</label>
            <TextInput
              value={watch('price')}
              setValue={handlePriceChange}
              placeholder=""
            />
          </div>
          <div className='field-container'>
            <div className="quantity-control">
                <button type="button" onClick={() => handleQuantityChange(-1)}>-</button>
                <span>{watch('quantity')}</span>
                <button type="button" onClick={() => handleQuantityChange(1)}>+</button>
            </div>
          </div>
          <button type="submit">Save</button>
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
          <button type="button" onClick={onDelete}>Delete</button>
        </form>
      )}
    </div>
  );
}

export default ProductForm;
