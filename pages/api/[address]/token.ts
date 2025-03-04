import type { NextApiRequest, NextApiResponse } from "next";
import { Address } from "viem";

interface GeckoTerminalResponse {
  "data": {
    "attributes": {
      "address": Address;
      "name": string;
      "symbol": string;
      "decimals": number;
      "total_supply": string;
      "price_usd": string;
      "fdv_usd": string;
      "total_reserve_in_usd": string;
      "volume_usd": {
        "h24": string;
      },
      "market_cap_usd": string | null;
    },
  }
}

interface TokenPricingErrorResponse {
  error: string;
}

export interface TokenPricingResponse {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  price: number;
  fdv: number;
  volume_24h: number;
  market_cap: number;
}

export const revalidate = 86400; // Cache for 24 hours

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TokenPricingResponse | TokenPricingErrorResponse>,
) {
  const { address } = req.query;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Address parameter is missing or invalid" });
  }

  const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/base/tokens/${address}`, {
    method: "GET",
  });

  if (response.status !== 200) {
    console.error("Failed to fetch token data", await response.json());

    return res.status(400).json({ error: "Failed to fetch token data" });
  }
  
  const { data } = await response.json() as GeckoTerminalResponse;
  const { attributes } = data;

  const { name, symbol, decimals } = attributes;

  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=86400");
  return res.status(200).json({
    address: address as Address,
    name,
    symbol,
    decimals,
    price: parseFloat(attributes.price_usd),
    fdv: parseFloat(attributes.fdv_usd),
    volume_24h: parseFloat(attributes.volume_usd.h24),
    market_cap: parseFloat(attributes.market_cap_usd || "0"),
  });
}

export default handler;
