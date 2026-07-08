"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { RequiredSymbol } from "../required-symbol";
import { Textarea } from "../../ui";
import { ClearButton } from "./clear-button";
import { ErrorText } from "./error-text";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export function FormTextarea({ name, label, required, className, ...props }: FormTextareaProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const value = watch(name);
  const errorText = errors[name]?.message as string;

  const onClickClear = () => setValue(name, "");
  return (
    <div className={className}>
      {label && (
        <p className="mb-2 font-medium">
          {label} {required && <RequiredSymbol />}
        </p>
      )}
      <div className="relative">
        <Textarea className="text-md h-12" {...register(name)} {...props} />
        {value && <ClearButton onClick={onClickClear} />}
      </div>
      {errorText && <ErrorText text={errorText} className="mt-2" />}
    </div>
  );
}
