export type IRepayType = "min" | "max" | "custom"

export interface IRepayOption {
  paymentType: IRepayType;
  amount?: bigint;
  value?: string;
  token?: string;
  title?: string;
  content?: string;
  inputProps?: any;
  tooltip?: {
    title: string;
    content: string;
    position: "left" | "right";
  } | false
}