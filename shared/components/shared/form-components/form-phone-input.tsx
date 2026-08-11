"use client";

import { IMaskInput } from "react-imask";
import { Controller, useFormContext } from "react-hook-form";

import { cn } from "@/shared/lib/utils";

import { ClearButton } from "./clear-button";
import { ErrorText } from "./error-text";

interface FormPhoneInputProps {
  name: string;
  className?: string;
  placeholder?: string;
}

export function FormPhoneInput({ name, className, placeholder }: FormPhoneInputProps) {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();

  const errorText = errors[name]?.message as string;

  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <IMaskInput
              mask="+{7} (000) 000-00-00"
              value={field.value ?? ""}
              onAccept={(value) => field.onChange(value)}
              inputRef={field.ref}
              onBlur={field.onBlur}
              placeholder={placeholder}
              className={cn(
                "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-12 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[2px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              )}
            />

            {field.value && <ClearButton onClick={() => setValue(name, "", { shouldValidate: true })} />}
          </div>
        )}
      />

      {errorText && <ErrorText text={errorText} className="mt-2" />}
    </div>
  );
}
