import React from 'react';

interface FormInputProps {
className?: string;
};

export function FormInput({className}: FormInputProps) {
  return (
    <div className={className}></div>
  );
}