import { Address, erc20Abi } from "viem";

import { userManagerAbi } from "@/abis/userManager";
import { uTokenAbi } from "@/abis/uToken";
import { unionAbi } from "@/abis/union";
import { comptrollerAbi } from "@/abis/comptroller";
import { unionLensAbi } from "@/abis/unionLens";

export const userManagerContract = {
  address: "0x0e9052bD9a960E8239c9F447334e7Ff5bbbA9c6b" as Address,
  abi: userManagerAbi,
};

export const usdcContract = {
  address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as Address,
  abi: erc20Abi,
};

export const uTokenContract = {
  address: "0xc7709cE40eed5820916855695706Fc3b5e595573" as Address,
  abi: uTokenAbi,
};

export const unionContract = {
  address: "0x23719ECefD0c3610f7445c0b3a35C2aA15aFF8dB" as Address,
  abi: unionAbi,
};

export const comptrollerContract = {
  address: "0xb5eF84A14cbB6a57c8F614A9EFc75DB7855e3ed1" as Address,
  abi: comptrollerAbi,
};

export const unionLensContract = {
  address: "0x0204b04bC002399bDCD430F64b569c1FE425321A" as Address,
  abi: unionLensAbi,
};
