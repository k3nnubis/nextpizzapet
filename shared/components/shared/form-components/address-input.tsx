"use client";
import { AddressSuggestions } from "react-dadata";
import "react-dadata/dist/react-dadata.css";
import { Controller, useFormContext } from "react-hook-form";
import { ErrorText } from "./error-text";

interface AddressInputProps {
  name: string;
}

export function AddressInput({ name }: AddressInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="relative">
          <AddressSuggestions
            uid="address_checkout"
            token="72ac35f454911c4a29464d9ee73fe4a061f1ac9d"
            onChange={(data) => {
              field.onChange(data?.value ?? "");
            }}
            inputProps={{
              onBlur: field.onBlur,
              onChange: (event) => field.onChange(event.currentTarget.value),
              className:
                "border-input placeholder:text-muted-foreground flex h-12 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[2px] md:text-sm",
              placeholder: "Адрес доставки",
            }}
            suggestionsClassName="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md"
            suggestionClassName="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 rounded-md w-full text-left"
            highlightClassName="text-primary"
          />
          {fieldState.error?.message && <ErrorText className="mt-2" text={fieldState.error.message} />}
        </div>
      )}
    />
  );
}
