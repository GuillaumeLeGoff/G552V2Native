import React from "react";
import { TextInputProps } from "react-native";
import { Input } from "./input";

interface NumericInputProps extends TextInputProps {
  value: string;
  onChangeValue: (value: number) => void;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChangeValue,
  ...props
}) => {
  const handleChangeText = (text: string) => {
    const numericValue = parseFloat(text);
    if (!isNaN(numericValue)) {
      onChangeValue(numericValue);
    }
  };

  return (
    <Input
      {...props}
      value={value}
      onChangeText={handleChangeText}
      keyboardType="numeric"
    />
  );
};
