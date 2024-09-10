/**
 * useForm()
 */
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

