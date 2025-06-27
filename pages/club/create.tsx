import Head from "next/head";
import React, { useReducer } from "react";

import { Columned } from "@/components/shared/Columned";
import { Header } from "@/components/shared/Header";
import { Input } from "@/components/ui/Input";
import { useWrite } from "@/hooks/useWrite";
import { useFactoryContract } from "@/hooks/useFactoryContract";
import { Address, isAddress } from "viem";
import { RoundedButton } from "@/components/ui/RoundedButton";
import { useAccount } from "wagmi";

const createParamsInitialState = {
  clubName: "Test Club",
  symbol: "TC",
  image: "https://ipfs.io/ipfs/bafybeiddczx3dn6c7t2hitj55dc4mfjadaidxosbnhjzqb53fllp45hzam",
  description: "This is a test club description",
  membershipName: "TC NFT Name",
  vaultContractURI: "https://example.com/vault-metadata.json",
  memberNFTContractURI: "https://example.com/nft-metadata.json",
  memberNFTBaseURI: "https://example.com/nft/",
  raiseMinTarget: "0",
  raiseMaxTarget: "10000000",
  raisePeriod: "86400",
  vaultRatio: "5000",
  assetRatio: "5000",
  withdrawPeriod: "86400",
  lockupPeriod: "86400",
  fixedBidPrice: "1000000",
  membershipCost: "1000000",
  inviteCost: "1000000",
  vaultWithdrawFeeBps: "500",
  stakingWithdrawFeeBps: "500",
  feeRecipient: "0x0000000000000000000000000000000000000000",
  maxMembers: "100",
  minMembers: "25",
  vestingDuration: "172800",
  startingPercentTrust: "50",
  creditMultiple: "100",
  gatingToken: "0x0000000000000000000000000000000000000000",
  gatingTokenAmount: "0",
  isClosedEndFund: true,
  isInviteEnabled: true,
  isSoulBound: false,
  isTiersEnabled: true,
  isPublic: true,
  isTokenEnabled: true,
};

function formReducer(state: any, action: { name: string; value: any }) {
  return {
    ...state,
    [action.name]: action.value,
  };
}


export default function HomePage() {
  const [createState, dispatch] = useReducer(formReducer, createParamsInitialState);
  const [inviteListText, setInviteListText] = React.useState<string>("");

  const { isConnected, address: connectedAddress } = useAccount();

  const factoryContract = useFactoryContract(process.env.NEXT_PUBLIC_FACTORY_ADDRESS! as Address);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      name: e.target.name,
      value: ["true", "false"].includes(e.target.value) ? e.target.value === "true" : e.target.value,
    });
  };

  const handleInviteListChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInviteListText(e.target.value);
  };

  const createParams = Object.keys(createState).reduce((acc: any, curr: any) => [...acc, createState[curr]], []);
  const authParams = [
    connectedAddress,  // rewardManager
    connectedAddress,  // creditManager
    connectedAddress,  // manager
    connectedAddress,  // feeManager
  ];
  const inviteList: Address[] = inviteListText
    .split('\n')
    .map(line => line.trim())
    .filter(line => isAddress(line)) as Address[];

  const createClubButtonProps = useWrite({
    ...factoryContract,
    functionName: "create",
    args: [createParams, authParams, inviteList],
    disabled: !connectedAddress,
  });

  return (
    <>
      <Head>
        <title>CreditClub - Create Credit With Friends</title>
      </Head>

      <main>
        <Columned width={1020} className="py-8">
          <Header />
          <div className="mt-8 max-w-[600px] bg-white p-4 rounded-xl mx-auto">
            {isConnected ? (
              <>
                {Object.keys(createState).map((key) => (
                  <div className="mb-4">
                    <label htmlFor={key} className="font-medium">{key} ({typeof createState[key]}):</label>
                    <Input name={key} value={createState[key]} onChange={handleChange} />
                  </div>
                ))}
                <div className="mb-4">
                  <label htmlFor="inviteList" className="font-medium">Invite List (one address per line):</label>
                  <textarea
                    id="inviteList"
                    className="w-full p-2 border rounded-md"
                    value={inviteListText}
                    onChange={handleInviteListChange}
                    rows={5}
                    placeholder="Enter addresses, one per line"
                  />
                </div>
              </>
            ) : (
              <h1 className="text-center mb-4 text-xl font-medium">You must be connected</h1>
            )}

            <RoundedButton
              size="large"
              variant="blue"
              className="w-full"
              {...createClubButtonProps}
            >
              Create Club
            </RoundedButton>
          </div>
        </Columned>
      </main>
    </>
  );
}
