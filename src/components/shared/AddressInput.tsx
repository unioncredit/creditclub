import { Address, isAddress } from "viem";
import React, { useEffect, useState } from "react";
import { useEnsAddress, useEnsName } from "wagmi";

// @ts-ignore
import { Box, EnsIcon, Input, LoadingSpinner, Text } from "@unioncredit/ui";
import { Avatar } from "@/components/shared/Avatar.tsx";

export const AddressInput = ({
  onChange,
  defaultValue = "",
  ...props
}: {
  onChange: (address: Address | null) => void;
  defaultValue?: string;
  error?: string;
  [_: string]: any;
}) => {
  const [value, setValue] = useState<string>(defaultValue);
  const [error, setError] = useState<string | null>(null);

  const { data: ens, isLoading: isLoadingName } = useEnsName({
    address: isAddress(value) ? value : undefined,
    chainId: 1,
  });

  const { data: addressFromEns, isLoading: isLoadingAddress } = useEnsAddress({
    name: value?.endsWith(".eth") ? value : undefined,
    chainId: 1,
  });

  const address = isAddress(value) ? value : addressFromEns;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleChange");
    const value = event.target.value;

    if (value.endsWith(".eth") || isAddress(value)) {
      // Input ends with .eth so we treat it is an ENS or
      // it is a valid ETH address
      setValue(value);
      setError(null);
    } else if (value === "") {
      // Input valus is an empty string
      setValue("");
      setError(null);
      onChange(null);
    } else if (value.startsWith("0x") && value.length >= 42) {
      // Input value is not an address OR ENS so set an error
      setError("Invalid address or ENS");
    } else {
      setValue(value);
      setError(null);
      onChange(null);
    }
  };

  /**
   * Fire the onchange event when the address is updated
   * either by resolving a new ENS or the user entering
   * in an address into the input
   */
  useEffect(() => {
    if (address) {
      onChange(address);
    }

    // Input value looks like an ENS but it is not valid
    if (value?.endsWith(".eth") && !isLoadingAddress && !addressFromEns) {
      setError("Invalid address or ENS");
    }
  }, [address, onChange]);

  return (
    <Input
      {...props}
      error={error}
      onChange={handleChange}
      caption={
        (ens || address) && (
          <Box direction="horizontal" align="center" mt="4px">
            {address && <Avatar size={16} address={address} />}
            <Text m={0} ml="4px" size="small">
              {ens || address}
            </Text>
          </Box>
        )
      }
      suffix={
        isLoadingName || isLoadingAddress ? (
          <LoadingSpinner />
        ) : (
          value?.endsWith(".eth") && <EnsIcon style={{ width: "20px" }} />
        )
      }
    />
  );
}
