import React, { ChangeEvent } from 'react';

interface TextInputProps {
  value: string;
  setValue: (value: string) => void;
}

export function TextInput({ value, setValue }: TextInputProps) {
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
        className="invisible-input" 
      />
      <span className="styled-span">{value}</span>
    </div>
  );
}

export default TextInput
