import { Address } from "viem";
import Image from "next/image";
import { useRouter } from "next/router";

import { Heading } from "@/components/ui/Heading";
import { ShadowButton } from "@/components/ui/ShadowButton";
import { createClubUrl } from "@/lib/links";

export const CreditVaultIntro = ({
  clubAddress,
}: {
  clubAddress: Address
}) => {
  const router = useRouter();

  return (
    <section className="font-mono">
      <Heading
        type="h1"
        className="border-b border-black pb-2"
      >
        Introducing CreditClub.
      </Heading>

      <div className="bg-slate-100 border border-black mt-4">
        <Image
          width={1573}
          height={510}
          src="/images/credit-vault-diagram.png"
          alt="Credit Vault Diagram"
        />
      </div>

      <p className="mt-4">Credit Clubs are tokenized onchain credit "unions".</p>
      <p className="mt-4">1 club can extend a prorata of credit to 150 addresses</p>

      <Heading type="h1" className="mt-8">
        How a credit club (currently) works:
      </Heading>

      <ul className="mt-4 ml-8 flex flex-col gap-1.5">
        <li className="list-disc">Creator defines a list of addresses or token that qualify to claim a proRata credit from the Vault.</li>
        <li className="list-disc">Funders deposit USDC in exchange for vaultToken.</li>
        <li className="list-disc">When Vault reaches its Raise amount the vault is activated:</li>
        <li className="ml-10">
          <ul className="list-decimal">
            <li>90% of USDC is staked into the Union Credit Network, funding the creditLines</li>
            <li>10% of vaultTokens & USDC are Deposited in LP</li>
          </ul>
        </li>
        <li className="list-disc">Borrowers borrow and repay. And the vault will grow or shrink based on the Trust</li>
        <li className="list-disc">After the lockup, holders of the vault token can redeem.</li>
      </ul>

      <div className="w-full flex justify-center mt-8">
        <ShadowButton
          size="large"
          variant="blue"
          onClick={() => router.push(createClubUrl(clubAddress))}
        >
          Check if you Qualify for Beta
        </ShadowButton>
      </div>
    </section>
  )
}
