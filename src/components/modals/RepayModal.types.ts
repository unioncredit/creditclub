export type IRepayType = "min" | "max" | "balance" | "custom"

export interface IRepayOption {
  paymentType: IRepayType;
  amount?: bigint;
  value?: string;
  token?: string;
  title?: string;
  content?: string | false;
  inputProps?: any;
  tooltip?: {
    title: string;
    content: string;
    position: "left" | "right";
  } | false
}