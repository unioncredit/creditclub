import { Address, erc20Abi } from "viem";

import { userManagerAbi } from "@/abis/userManager";
import { uTokenAbi } from "@/abis/uToken";
import { unionAbi } from "@/abis/union";
import { comptrollerAbi } from "@/abis/comptroller";
import { unionLensAbi } from "@/abis/unionLens";
import { rewardsManagerAbi } from "@/abis/rewardsManager";

export const userManagerContract = {
  address: "0xfd745A1e2A220C6aC327EC55d2Cb404CD939f56b" as Address,
  abi: userManagerAbi,
};

export const usdcContract = {
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as Address,
  abi: erc20Abi,
};

export const uTokenContract = {
  address: "0xc2447f36FfdA08E278D25D08Ea91D942f0C2d6ea" as Address,
  abi: uTokenAbi,
};

export const unionContract = {
  address: "0x2c613Ecf0966b84562d3A083227C753B4d5ABF12" as Address,
  abi: unionAbi,
};

export const comptrollerContract = {
  address: "0x37C092D275E48e3c9001059D9B7d55802CbDbE04" as Address,
  abi: comptrollerAbi,
};

export const unionLensContract = {
  address: "0x97F8903177300aDDF7b92431DE104ce610768B19" as Address,
  abi: unionLensAbi,
};

export const rewardsManagerContract = {
  address: "0xfd745A1e2A220C6aC327EC55d2Cb404CD939f56b" as Address,
  abi: rewardsManagerAbi,
};
