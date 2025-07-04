import { base, baseSepolia, Chain } from "viem/chains";

import { IToastStatus } from "@/providers/types";

export const DEFAULT_CHAIN = base;
export const DEFAULT_CHAIN_ID = DEFAULT_CHAIN.id;

export const BLOCKS_PER_YEAR = 31540000n;
export const SECONDS_PER_DAY = 86400;
export const WAD_1E18 = 1000000000000000000n;
export const BLOCK_SPEED = 1e3;

export const rpcChains: readonly [Chain, ...Chain[]] = [base, baseSepolia];

const RPCS: Record<number, string> = {
  [base.id]: "https://base-mainnet.g.alchemy.com/v2",
  [baseSepolia.id]: "https://base-sepolia.g.alchemy.com/v2",
};

export const RPC_URL = (chainId: number) => 
  `${RPCS[chainId]}/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`;

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

export const DUST_THRESHOLD = {
  DAI: 10000000000000000n,
  USDC: 10000n,
  UNION: 10000000000000000n,
};

export const ActivityTypes = {
  CLUB_CREATED: "CLUB_CREATED",
  LOADING: "LOADING",
  JOINED_CLUB: "JOINED_CLUB",
  UPDATED_TRUST: "UPDATED_TRUST",
  BORROWED: "BORROWED",
  REPAID: "REPAID",
  ROUND_WON: "ROUND_WON",
  INVITATION_EVENT: "INVITATION_EVENT",
  BID_PLACED: "BID_PLACED",
  MINT: "MINT",
  REDEEM: "REDEEM",
};

export const ToastStatus: Record<"SUCCESS" | "FAILED" | "PENDING", IToastStatus> = {
  SUCCESS: "success",
  FAILED: "error",
  PENDING: "pending",
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

export const MultiStep: Record<"SELECTED" | "PENDING" | "COMPLETE", string> = {
  SELECTED: "selected",
  PENDING: "pending",
  COMPLETE: "complete",
};

export const TOTAL_PERCENT = 10000;

export const GATING_TOKEN_TYPE: Record<"ERC20" | "ERC721", number> = {
  ERC20: 0,
  ERC721: 1,
};