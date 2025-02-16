import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
  max?: string;
}

export const InputField = ({ id, label, value, onChange, min, max }: InputFieldProps) => {
  return (
    <div>
      <label className="block text-blue-700 mb-1" htmlFor={id}>
        {label}
      </label>
      <input
        type="number"
        id={id}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};