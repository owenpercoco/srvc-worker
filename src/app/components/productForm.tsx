import React, { useEffect, useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { BaseProduct, categoryEnum, Price, DataBaseProduct } from '@/data/inventory';
import { TextField, Select, MenuItem, Button, SelectChangeEvent, Autocomplete } from '@mui/material';
import { Delete, Edit } from "@mui/icons-material";
import Modal from './modal';
import { StockToggle } from './stockForm';
import ProductFormWrapper from './productFormWrapper';
import ImageUploader from './imageUploader';

interface ProductFormProps {
  product: Partial<BaseProduct>;
  onInputChange: (field: string, value: any) => void;
  onSave: (data: any, imageUrl?: string) => Promise<boolean>;
  onDelete?: () => void;
  onRestoreSelect?: (id: string | null, product?: Partial<BaseProduct>) => void;
  expanded?: boolean;
}

function ProductForm({ product, onInputChange, onSave, onDelete, onRestoreSelect, expanded = false }: ProductFormProps) {
  const premiumDescriptions: [string, string][] = [['45', '⅛'], ['85', '¼'], ['160', '½'], ['320', 'oz']];
  const sungrownDescriptions: [string, string][] = [['60', '¼'], ['200', 'oz']];
  const [isModalOpen, setIsModalOpen] = useState<boolean>(expanded);

  const { handleSubmit, watch, setValue, control, register } = useForm({
    defaultValues: {
      name: product.name,
      subtitle: product.subtitle || '',
      description: product.description || '',
      long_description: product.long_description || '',
      price: product.price || [],
      category: product.category || '',
      type: product.type || '',
      image: product.image,
      is_in_stock: product.is_in_stock ?? true,
    },
  });

  const nameValue = watch('name');

  // Update form values when product prop changes (useful for autofill from suggestions)
  React.useEffect(() => {
    if (!product) return;
    setValue('name', product.name || '');
    setValue('subtitle', product.subtitle || '');
    setValue('description', product.description || '');
    setValue('long_description', product.long_description || '');
    // Only set price from product prop when the form doesn't already have price entries.
    try {
      const currentPrices = (watch('price') as any) || [];
      if (!Array.isArray(currentPrices) || currentPrices.length === 0) {
        setValue('price', (product.price as any) || []);
      }
    } catch (e) {
      setValue('price', (product.price as any) || []);
    }
    setValue('category', (product.category as any) || '');
    setValue('type', (product.type as any) || '');
    setValue('image', (product as any).image || '');
    setValue('is_in_stock', (product as any).is_in_stock ?? true);
  }, [product, setValue, watch]);

  const { fields, append, remove } : {fields: Price[], append: any, remove: any}= useFieldArray({
    control,
    name: 'price',
  });

  const [isSaved, setIsSaved] = useState<null | boolean>(null);
  const [deletedOptions, setDeletedOptions] = useState<DataBaseProduct[]>([]);

  // Watch specific fields to derive a save-enabled state
  const watched = watch(['name', 'category', 'type', 'price', 'is_in_stock']);

  const isSaveDisabled = useMemo(() => {
    const name = (watched[0] || '').toString().trim();
    const category = watched[1] as string | undefined;
    const type = watched[2] as string | undefined;
    const rawPrice = watched[3];

    if (!name) return true; // always require a name
    if (!category) return true; // category required

    // Normalize price to an array (some products may use single object or array)
    let prices: Array<any> = [];
    if (Array.isArray(rawPrice)) prices = rawPrice;
    else if (rawPrice) prices = [rawPrice];

  const hasValidPrice = prices.length > 0 && prices.some(p => String(p?.amount).trim() !== '' && String(p?.description).trim() !== '');

    // Category-specific rules
    switch (category) {
      case 'sungrown':
      case 'premium':
        // Flower products require a type and at least one valid price row
        if (!type) return true;
        if (!hasValidPrice) return true;
        return false;
      case 'preroll':
        // prerolls also require a type and a valid price
        if (!type) return true;
        if (!hasValidPrice) return true;
        return false;
      case 'edible':
      case 'concentrate':
      case 'psychadelic':
        // These require at least one valid price entry
        if (!hasValidPrice) return true;
        return false;
      default:
        // Fallback: require a valid price
        return !hasValidPrice;
    }
  }, [watched]);

  // Compute error messages for UI hints
  const validationErrors = useMemo(() => {
    const errs: { [key: string]: string } = {};
    const name = (watched[0] || '').toString().trim();
    const category = watched[1] as string | undefined;
    const type = watched[2] as string | undefined;
    const rawPrice = watched[3];

    if (!name) errs.name = 'Name is required';
    if (!category) errs.category = 'Select a category';

    let prices: Array<any> = [];
    if (Array.isArray(rawPrice)) prices = rawPrice;
    else if (rawPrice) prices = [rawPrice];

  // Description is optional; a valid price must have an amount
  const hasValidPrice = prices.length > 0 && prices.some(p => String(p?.amount).trim() !== '');

  if (!hasValidPrice) errs.price = 'Add at least one price with amount';

    if (category === 'sungrown' || category === 'premium' || category === 'preroll') {
      if (!type) errs.type = 'Select a type (Indica/Sativa/Hybrid)';
    }

    return errs;
  }, [watched]);

  // amount_in_stock removed; quantity controls omitted

  const handleCategoryChange = (value?: categoryEnum) => {
    if (value === undefined) return;
    setValue('category', value || '');
    onInputChange('category', value || '');

    // When changing category, apply category defaults.
    // If there are no existing prices, set the full default list.
    // If there are existing prices, overwrite the last price entry with the first default.
    if (value === 'sungrown') {
      const defaults = sungrownDescriptions.map(([amount, description]) => ({ amount, description }));
      // Replace all previous prices with the default set
      setValue('price', defaults);
    } else if (value === 'premium') {
      const defaults = premiumDescriptions.map(([amount, description]) => ({ amount, description }));
      setValue('price', defaults);
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
    setIsModalOpen(false);
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="field-container">
          <Autocomplete
            freeSolo
            options={deletedOptions.map((d) => d.name)}
            inputValue={String(nameValue ?? '')}
            onOpen={async () => {
              // lazy-load deleted options
              if (deletedOptions.length === 0) {
                try {
                  const resp = await fetch('/api/products?deleted=true');
                  const json = await resp.json();
                  setDeletedOptions(json.data || []);
                } catch (e) {
                  console.error('Failed to load deleted suggestions', e);
                }
              }
            }}
            onInputChange={(_e, value, _reason) => {
              setValue('name', value);
              onInputChange('name', value);
            }}
            onChange={(_e, value: string | null) => {
              if (!value) return;
              // find full product by name
              const prod = deletedOptions.find((d) => d.name === value);
              if (prod) {
                setValue('name', prod.name || '');
                setValue('subtitle', prod.subtitle || '');
                setValue('description', prod.description || '');
                setValue('long_description', prod.long_description || '');
                setValue('price', (prod.price as any) || []);
                setValue('category', (prod.category as any) || '');
                setValue('type', (prod.type as any) || '');
                setValue('image', (prod as any).image || '');
                setValue('is_in_stock', (prod as any).is_in_stock ?? true);
                if (typeof (product as any)._id === 'undefined') {
                  // if this is the add-new-product flow, notify parent via onRestoreSelect if provided
                  onRestoreSelect && onRestoreSelect(String(prod._id), prod as any);
                }
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="name"
                variant="outlined"
                size="small"
                fullWidth
                error={!!validationErrors.name}
                helperText={validationErrors.name}
              />
            )}
          />
        </div>
        {/* subtitle is hidden for now */}
        <div className="field-container description">
          <TextField
            {...register('description')}
            value={watch('description')}
            label="description"
            variant="outlined"
            size="small"
            fullWidth
            helperText="Appears under product in main page"
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
            helperText="Optional — displays on product page"
            onChange={(e) => {
              setValue('long_description', e.target.value);
              onInputChange('long_description', e.target.value);
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
            error={!!validationErrors.category}
            renderValue={(v) => v || 'Select Category'}
            // helper text shown in surrounding label area
          >
            <MenuItem value="">Select Category</MenuItem>
            <MenuItem value="sungrown">Sungrown</MenuItem>
            <MenuItem value="premium">Premium</MenuItem>
            <MenuItem value="edible">Edible</MenuItem>
            <MenuItem value="preroll">Preroll</MenuItem>
            <MenuItem value="concentrate">Concentrate</MenuItem>
            <MenuItem value="psychadelic">Psychadelic</MenuItem>
          </Select>
          <div className="field-helper">{validationErrors.category ?? 'What type of product it is'}</div>
        </div>
        {watch('category') && (
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
            error={!!validationErrors.type}
            // helper text: strain information
          >
            <MenuItem value="indica">Indica</MenuItem>
            <MenuItem value="sativa">Sativa</MenuItem>
            <MenuItem value="hybrid">Hybrid</MenuItem>
            <MenuItem value="indicadominant">Ind Dom</MenuItem>
            <MenuItem value="sativadominant">Sat Dom</MenuItem>
          </Select>
        </div>
        )}
        {watch('category') && (
          <>
            <label>Prices</label>
            <div className="field-helper">Amount and description (e.g. 60 and quarter)</div>
            {fields.map((field, index) => (
              <div key={`${product.name}-${index}`}  className="field-container">
                <div className="flex flex-col gap-4">
                  <TextField
                    className="mt-2"
                    label="Price ($)"
                    {...register(`price.${index}.amount`)}
                    fullWidth
                    size="small"
                    error={!!validationErrors.price}
                    helperText={index === 0 && validationErrors.price}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : String(e.target.value);
                      setValue(`price.${index}.amount`, value);
                      onInputChange(`price.${index}.amount`, value);
                    }}
                  />
                  <TextField
                    className="pt-2"
                    label="Description"
                    {...register(`price.${index}.description`)}
                    fullWidth
                    size="small"
                    onChange={(e) => {
                      setValue(`price.${index}.description`, e.target.value);
                      onInputChange(`price.${index}.description`, e.target.value);
                    }}
                  />
                  <Button variant="outlined" size="small" color="error" startIcon={<Delete/>} onClick={() => remove(index)}> remove price</Button>
                </div>
              </div>
            ))}
            <Button variant="outlined" onClick={() => append({ amount: '', description: '' })}>
              Add Price
            </Button>
          </>
        )}
        <div className="field-container text-center">
          <span>{!watch('is_in_stock') ? 'Not ' : ''}In Stock</span>
          <div className="quantity-control justify-center">
            <StockToggle
              isInStock={watch('is_in_stock')}
              onChange={(value: boolean) => {
                setValue(`is_in_stock`, value);
                onInputChange(`is_in_stock`, value);
              }}
            />
        </div>
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
          <div className="field-helper">Optional image — shown on product page</div>
        </div>
        <div className="save-container">
          <Button type="submit" disabled={isSaveDisabled}>Save</Button>
          {product && (product as any)._id && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={async () => {
                const ok = confirm('Delete this product? This will hide it from the app.');
                if (!ok) return;
                if (!onSave) return;
                try {
                  const success = await onSave({ is_deleted: true });
                  if (success) {
                    setIsSaved(true);
                    onDelete && onDelete();
                  } else {
                    setIsSaved(false);
                  }
                } catch (err) {
                  console.error('Delete (via PUT) failed', err);
                  setIsSaved(false);
                }
              }}
            >
              Delete
            </Button>
          )}
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
        </div>
      </form>
  );
}

export default ProductForm;
