import { Address, erc20Abi } from "viem";

import { userManagerAbi } from "@/abis/userManager";
import { unionLensAbi } from "@/abis/unionLens";
import { uTokenAbi } from "@/abis/uToken";
import { clubPluginAbi } from "@/abis/clubPlugin";
import { clubNftAbi } from "@/abis/clubNft";
import { comptrollerAbi } from "@/abis/comptroller.ts";

export const userManagerContract = {
  address: "0x8E195D65b9932185Fcc76dB5144534e0f3597628" as Address,
  abi: userManagerAbi,
};

export const daiContract = {
  address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1" as Address,
  abi: erc20Abi,
};

export const unionLensContract = {
  address: "0x376F47C5966dcDA5c3d54B8cBF8B918777b8FF13" as Address,
  abi: unionLensAbi,
};

export const uTokenContract = {
  address: "0xE478b5e7A423d7CDb224692d0a816CA146A744b2" as Address,
  abi: uTokenAbi,
};

export const clubPluginContract = {
  address: "0x5ed1532de62bc0492a1868cf5523ff248252a646" as Address,
  abi: clubPluginAbi,
};

export const clubNftContract = {
  address: "0x27be7878ec75291b84e36f2d17f5b47f0dab211b" as Address,
  abi: clubNftAbi,
};

export const comptrollerContract = {
  address: "0x06a31efa04453C5F9C0A711Cdb96075308C9d6E3" as Address,
  abi: comptrollerAbi,
};