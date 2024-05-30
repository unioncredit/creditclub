import { useEnsName, useNetwork } from "wagmi";
import { mainnet, optimismGoerli } from "wagmi/chains";

import { truncateAddress, truncateEns } from "utils/truncateAddress";
import useLabels from "hooks/useLabels";
import { vouchFaucetContract } from "config/contracts/v2/optimismGoerli";
import { AddressEnsMappings } from "../../constants";

export function PrimaryLabel({ address, shouldTruncate = true }) {
  const { data } = useEnsName({
    address,
    chainId: mainnet.id,
  });

  return (
    getLabel(address) ||
    (ens && (shouldTruncate ? truncateEns(ens) : ens)) ||
    (shouldTruncate ? truncateAddress(address) : address)
  );
}
