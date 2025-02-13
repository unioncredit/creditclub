import React, { useState } from "react";
import { formatUnits, parseUnits } from "viem";

import { format } from "@/lib/format";
import { useToken } from "@/hooks/useToken";

export interface IFormField {
  raw: bigint;
  display: string;
  formatted: string;
}
export type IFormValues = Record<string, IFormField | string>;
export type IFormErrors = Record<string, string | void>;
export type ISetNumberFunc = {
  (name: string, value: string, type: "display", rounded: boolean): void;
  (name: string, value: bigint, type: "raw", rounded: boolean): void;
};

export const useForm = ({
  validate,
}: {
  validate: (inputs: IFormValues) => void;
}) => {
  const [values, setValues] = useState<IFormValues>({});
  const [errors, setErrors] = useState<IFormErrors>({});

  const { token, unit } = useToken();

  const empty = {
    raw: 0n,
    display: "",
    formatted: "",
  };

  const formatValue = (value: bigint, rounded: boolean) =>
    format(value, token, 2, rounded).replace(/,/g, "");

  const setNumber: ISetNumberFunc = (
    name: string,
    value: bigint | string,
    type: "display" | "raw",
    rounded: boolean,
  ) => {
    let newValues: IFormValues;

    if (!value) {
      // If the value is empty set the raw value to 0 and
      // the display value to an empty string
      newValues = {
        ...values,
        [name]: { raw: 0n, display: "", formatted: "" },
      };
    } else {
      const parsed =
        type === "display"
          ? {
            raw: parseUnits(value as string, unit),
            display: value as string,
            formatted: value as string,
          }
          : {
            raw: value as bigint,
            display: formatValue(value as bigint, rounded),
            formatted: formatUnits(value as bigint, unit),
          };

      newValues = { ...values, [name]: parsed };
    }

    const validationErrors = validate && validate(newValues);
    setErrors((err: any) => ({ ...err, [name]: validationErrors }));
    setValues(newValues);
  };

  const setSimple = (name: string, value: string) => {
    const newValues = { ...values, [name]: value };
    const validationErrors = validate && validate(newValues);

    setErrors((err: any) => ({ ...err, [name]: validationErrors }));
    setValues(newValues);
  };

  const setValue = (name: string, display: string, type: string, rounded = true) => {
    if (type === "number") {
      setNumber(name, display, "display", rounded);
    } else {
      setSimple(name, display);
    }
  };

  const setRawValue = (name: string, raw: bigint, rounded = true) => {
    setNumber(name, raw, "raw", rounded);
  };

  const register = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(name, event.target.value, event.target.type);
  };

  const reset = () => {
    setValues({});
    setErrors({});
  };

  return {
    values,
    errors,
    setValue,
    setNumber,
    setRawValue,
    setSimple,
    register,
    reset,
    empty,
    isErrored: Object.values(errors || {}).filter(Boolean).length > 0,
  };
}
