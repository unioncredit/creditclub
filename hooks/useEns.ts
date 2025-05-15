import { useEnsAvatar, useEnsName } from "wagmi";
import { Address } from "viem";
import { normalize } from "viem/ens";
import { mainnet } from "wagmi/chains";

export const useEns = (address: Address) => {
  const { data: name, isLoading: nameLoading, isError: nameError } = useEnsName({
    chainId: mainnet.id,
    address,
    query: {
      staleTime: Infinity,
    }
  });
  const { data: avatar, isLoading: avatarLoading, isError: avatarError } = useEnsAvatar({
    chainId: mainnet.id,
    name: name ? normalize(name) : undefined,
    query: {
      staleTime: Infinity,
    }
  });

  return {
    name,
    avatar,
    isLoading: nameLoading || avatarLoading,
    isError: nameError || avatarError,
  };
};