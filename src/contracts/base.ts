import { Address, erc20Abi } from "viem";

import { userManagerAbi } from "@/abis/userManager";
import { unionLensAbi } from "@/abis/unionLens";
import { uTokenAbi } from "@/abis/uToken";
import { clubPluginAbi } from "@/abis/clubPlugin";
import { clubNftAbi } from "@/abis/clubNft";
import { comptrollerAbi } from "@/abis/comptroller.ts";
import { assetManagerAbi } from "@/abis/assetManager.ts";
import { unionAbi } from "@/abis/union.ts";
import { rewardsManagerAbi } from "@/abis/rewardsManager.ts";

export const userManagerContract = {
  address: "0xfd745A1e2A220C6aC327EC55d2Cb404CD939f56b" as Address,
  abi: userManagerAbi,
};

export const usdcContract = {
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as Address,
  abi: erc20Abi,
};

export const unionLensContract = {
  address: "0x97F8903177300aDDF7b92431DE104ce610768B19" as Address,
  abi: unionLensAbi,
};

export const uTokenContract = {
  address: "0xc2447f36FfdA08E278D25D08Ea91D942f0C2d6ea" as Address,
  abi: uTokenAbi,
};

export const clubPluginContract = {
  address: "0xf2fcfc7364c8ccda3272974be62d53dffbd04815" as Address,
  abi: clubPluginAbi,
};

export const clubNftContract = {
  address: "0xf5604a3d88333dc6c0c21586743f75f64b314895" as Address,
  abi: clubNftAbi,
};

export const comptrollerContract = {
  address: "0x37C092D275E48e3c9001059D9B7d55802CbDbE04" as Address,
  abi: comptrollerAbi,
};

export const assetManagerContract = {
  address: "0x393d7299c2caA940b777b014a094C3B2ea45ee2B" as Address,
  abi: assetManagerAbi,
}

export const unionContract = {
  address: "0x946A2C918F3D928B918C01D813644f27Bcd29D96" as Address,
  abi: unionAbi,
}

export const rewardsManagerContract = {
  address: "0x0bea69fac75fc8c4a5b648421b916d1ba3a11894" as Address,
  abi: rewardsManagerAbi,
};