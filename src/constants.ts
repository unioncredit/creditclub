import { arbitrum, base, Chain, optimism } from "viem/chains";
import { Address } from "viem";
import { mainnet } from "wagmi/chains";
import { IToastStatus } from "@/providers/types.ts";

export const supportedChains: readonly [Chain, ...Chain[]] = [base];

export const rpcChains: readonly [Chain, ...Chain[]] = [base, mainnet];

const RPCS: Record<number, string> = {
  [base.id]: "https://base-mainnet.g.alchemy.com/v2",
  [optimism.id]: "https://opt-mainnet.g.alchemy.com/v2",
  [mainnet.id]: "https://eth-mainnet.g.alchemy.com/v2",
  [arbitrum.id]: "https://arb-mainnet.g.alchemy.com/v2"
};

export const RPC_URL = (chainId: number) =>
  `${RPCS[chainId]}/${import.meta.env.VITE_ALCHEMY_API_KEY}`;

export const DEFAULT_CHAIN = base;
export const DEFAULT_CHAIN_ID = DEFAULT_CHAIN.id;

export const CREDITCLUB_SAFE_ADDRESS: Record<number, Address> = {
  [base.id]: "0x09760178c77Ee967DC1F36d29A6D17C481ecA728",
  [optimism.id]: "0x87349040756ed552f3ba7e2fcc3d11ec66475156",
};
export const CREDITCLUB_GRAPH_URL: Record<number, string> = {
  [base.id]: "https://subgraph.satsuma-prod.com/acb7db829580/union--11085/creditclub-base/api",
  [optimism.id]: "https://api.studio.thegraph.com/query/78581/credit-club/version/latest",
};

export const DUST_THRESHOLD = {
  DAI: 10000000000000000n,
  USDC: 10000n,
  UNION: 10000000000000000n,
};

export const MIN_REQUIRED_BID_BUCKET_BALANCE = 5000000000000000000000n;
export const PRO_RATA_MIN_MEMBER_NUM = 10n;
export const PRO_RATA_DENOMINATOR = 10000n;
export const UNION_TOKEN_PRICE_USD = 0.015;
export const BLOCKS_PER_YEAR = 31540000n;
export const SECONDS_PER_DAY = 86400;
export const BLOCK_SPEED = 1e3;

export type IToken = "DAI" | "USDC" | "UNION";

export const TOKENS: Record<IToken, IToken> = {
  DAI: "DAI",
  USDC: "USDC",
  UNION: "UNION",
};

export const WAD: Record<IToken, bigint> = {
  DAI: 1000000000000000000n,
  UNION: 1000000000000000000n,
  USDC: 1000000n,
};

export const UNIT: Record<IToken, number> = {
  DAI: 18,
  UNION: 18,
  USDC: 6,
};

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

export const ActivityTypes = {
  LOADING: "LOADING",
  JOINED_CLUB: "JOINED_CLUB",
  UPDATED_TRUST: "UPDATED_TRUST",
  BORROWED: "BORROWED",
  REPAID: "REPAID",
  ROUND_WON: "ROUND_WON",
  INVITATION_EVENT: "INVITATION_EVENT",
  BID_PLACED: "BID_PLACED",
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

export const FormErrors = {
  INSUFFICIENT_BALANCE: "Insufficient balance",
  INSUFFICIENT_CREDIT_LIMIT: "Insufficient credit limit",
  INSUFFICIENT_FUNDS: "Insufficient funds in protocol",
  MIN_BORROW: (amount: string) => `Amount less than minimum borrow (${amount})`,
  IS_OVERDUE: "You cannot borrow with an overdue balance",
};