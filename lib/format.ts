import { DUST_THRESHOLD, IToken, UNIT } from "@/constants";
import { formatUnits } from "viem";

export const formattedNumber = (value: bigint, token: IToken, digits = 2, rounded = true) => {
  return parseFloat(format(value, token, digits, rounded, false, false).replace(",", ""));
};

export const format = (
  value: bigint,
  token: IToken,
  digits = 2,
  rounded = true,
  stripTrailingZeros = false,
  formatDust = true
) => {
  if (!value) value = 0n;
  if (formatDust && value < DUST_THRESHOLD[token] && value > 0n) return "<0.01";
  return commify(Number(formatUnits(value, UNIT[token])), digits, rounded, stripTrailingZeros);
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

  // @ts-ignore
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

export const truncateAddress = (address: string) => address ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;

export const truncateEns = (ens: string, cutoff = 16) => {
  if (!ens || ens.length <= cutoff) {
    return ens;
  }

  const parts = ens.split(".");
  const name = parts.slice(0, -1).join(".");

  return `${name.slice(0, 4)}...${name.slice(-4)}.${parts.slice(-1)}`;
};

export const parseMilliseconds = (milliseconds: number) => {
  return {
    days: Math.trunc(milliseconds / 86400000),
    hours: Math.trunc(milliseconds / 3600000) % 24,
    minutes: Math.trunc(milliseconds / 60000) % 60,
    seconds: Math.trunc(milliseconds / 1000) % 60,
    milliseconds: Math.trunc(milliseconds) % 1000,
    microseconds: Math.trunc(milliseconds * 1000) % 1000,
    nanoseconds: Math.trunc(milliseconds * 1e6) % 1000,
  };
};

export const formatTimestamp = (milliseconds: number) => {
  if (!milliseconds) {
    return null;
  }

  const { days, hours, minutes } = parseMilliseconds(milliseconds);

  return days > 0
    ? `${days} days`
    : hours > 0
      ? `${hours} hours`
      : minutes > 0
        ? `${minutes} minutes`
        : null;
};

export const toPercent = (number: string | bigint, digits = 0) =>
  Number(number).toLocaleString(undefined, {
    style: "percent",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });

export const getClubSymbol = (name: string): string => {
  if (!name) return "";
  const words = name.split(' ');
  const symbol = words.map(word => word.charAt(0).toUpperCase()).join('');
  return symbol;
}