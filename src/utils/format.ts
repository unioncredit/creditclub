import { DUST_THRESHOLD } from "@/constants";
import { formatUnits } from "viem";

export const formattedNumber = (value: bigint, digits = 2, rounded = true) => {
  return parseFloat(format(value, digits, rounded, false, false).replace(",", ""));
};

export const format = (
  value: bigint,
  digits = 2,
  rounded = true,
  stripTrailingZeros = false,
  formatDust = true
) => {
  if (!value) value = 0n;
  if (formatDust && value < DUST_THRESHOLD && value > 0n) return "<0.01";
  return commify(Number(formatUnits(value, 18)), digits, rounded, stripTrailingZeros);
};

export function commify(value: number, digits: number, rounded = true, stripTrailingZeros = false) {
  value = Number(value);
  value = value <= 0 ? 0 : value;

  if (!value) return `0${digits > 0 ? "." : ""}${"".padEnd(digits, "0")}`;

  let numStr = Number(value).toLocaleString("en", {
    useGrouping: false,
    minimumFractionDigits: rounded ? digits : 18,
    maximumFractionDigits: rounded ? digits : 18,
  });

  if (!rounded) {
    const pattern = new RegExp("^-?\\d+(?:\\.\\d{0," + digits + "})?");
    numStr = numStr.match(pattern)![0];
  }

  const parts = numStr.split(".");
  const lhs = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  let rhs = parts[1];

  if (digits > 0 && stripTrailingZeros) {
    if (rhs) {
      rhs = rhs.padEnd(digits, "0");
      rhs = rhs.replace(/0+$/, "");
    } else {
      rhs = "".padEnd(digits, "0");
    }

    return `${lhs}${rhs.length > 0 ? "." : ""}${rhs}`;
  }

  return rhs ? `${lhs}.${rhs}` : lhs;
}

export const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

export const truncateEns = (ens: string, cutoff = 16) => {
  if (!ens || ens.length <= cutoff) {
    return ens;
  }

  const parts = ens.split(".");
  const name = parts.slice(0, -1).join(".");

  return `${name.slice(0, 4)}...${name.slice(-4)}.${parts.slice(-1)}`;
};
