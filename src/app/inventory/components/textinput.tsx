import React, { ChangeEvent } from 'react';

interface TextInputProps {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
}

export function TextInput({ value, setValue, placeholder }: TextInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const lowerCaseValue = e.target.value.toLowerCase();
    setValue(lowerCaseValue);
  };

  return (
    <div className="text-input-container">
      <input 
        type="text" 
        value={value} 
        onChange={handleChange} 
        className="text-input" 
        placeholder={placeholder}
      />
    </div>
  );
}

export default TextInput
