import { Chain, optimism } from "viem/chains";
import { Address } from "viem";
import { mainnet } from "wagmi/chains";
import { IToastStatus } from "@/providers/types.ts";

export const supportedChains: readonly [Chain, ...Chain[]] = [optimism];

export const rpcChains: readonly [Chain, ...Chain[]] = [optimism, mainnet];

const RPCS: Record<number, string> = {
  [optimism.id]: "https://opt-mainnet.g.alchemy.com/v2",
  [mainnet.id]: "https://eth-mainnet.g.alchemy.com/v2",
};

export const RPC_URL = (chainId: number) =>
  `${RPCS[chainId]}/${import.meta.env.VITE_ALCHEMY_API_KEY}`;

export const CREDITCLUB_SAFE_ADDRESS: Address = "0x87349040756ed552f3ba7e2fcc3d11ec66475156";
export const CREDITCLUB_GRAPH_URL = "https://api.studio.thegraph.com/proxy/78581/credit-club/v0.0.1";

export const DUST_THRESHOLD = 10000000000000000n;
export const MIN_REQUIRED_BID_BUCKET_BALANCE = 5000000000000000000000n;
export const PRO_RATA_MIN_MEMBER_NUM = 10n;
export const PRO_RATA_DENOMINATOR = 10000n;
export const UNION_TOKEN_PRICE_USD = 0.015;
export const BLOCKS_PER_YEAR = 31536000n;

export const SortOrder = {
  ASC: "asc",
  DESC: "desc",
};

export const ToastStatus: Record<string, IToastStatus> = {
  SUCCESS: "success",
  FAILED: "error",
  PENDING: "pending",
};

export const MultiStep = {
  SELECTED: "selected",
  PENDING: "pending",
  COMPLETE: "complete",
};

export const TransactionTypes = {
  JOINED_CLUB: "JOINED_CLUB",
  UPDATED_TRUST: "UPDATED_TRUST",
  BORROWED: "BORROWED",
  REPAID: "REPAID",
  ROUND_WON: "ROUND_WON",
};

export const WagmiErrors: Record<string, { title: string; content: string; }> = {
  ConnectorNotConnectedError: {
    title: "Not Connected",
    content: "Please connect a wallet",
  },
  TransactionExecutionError: {
    title: "Transaction failed",
    content: "User rejected the request",
  }
};