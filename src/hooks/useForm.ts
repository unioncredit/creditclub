import React, { useState } from "react";
import { format } from "@/utils/format.ts";
import { formatEther, parseUnits } from "viem";
import { IFormErrors, IFormValues, ISetNumberFunc } from "@/hooks/useForm.types.ts";

export const useForm = ({
  validate,
}: {
  validate: (inputs: IFormValues) => void;
}) => {
  const [values, setValues] = useState<IFormValues>({});
  const [errors, setErrors] = useState<IFormErrors>({});

  const empty = {
    raw: 0n,
    display: "",
    formatted: "",
  };

  const formatValue = (value: bigint, rounded: boolean) =>
    format(value, 2, rounded).replace(/,/g, "");

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
            raw: parseUnits(value as string, 18),
            display: value as string,
            formatted: value as string,
          }
          : {
            raw: value as bigint,
            display: formatValue(value as bigint, rounded),
            formatted: formatEther(value as bigint),
          };

      newValues = { ...values, [name]: parsed };
    }

    const validationErrors = validate && validate(newValues);
    setErrors((err) => ({ ...err, [name]: validationErrors }));
    setValues(newValues);
  };

  const setSimple = (name: string, value: string) => {
    const newValues = { ...values, [name]: value };
    const validationErrors = validate && validate(newValues);

    setErrors((err) => ({ ...err, [name]: validationErrors }));
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
