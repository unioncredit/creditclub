import Head from "next/head";
import { Address } from "viem";
import { GetServerSideProps } from "next";
import { useAccount } from "wagmi";

import { Columned } from "@/components/shared/Columned";
import { ClubHeader } from "@/components/shared/ClubHeader";
import { Footer } from "@/components/shared/Footer";
import { Container } from "@/components/shared/Container";
import { BannerCta } from "@/components/funds/BannerCta";
import { ClubDetails } from "@/components/funds/ClubDetails";
import { ClubStats } from "@/components/funds/ClubStats";
import { FundTables } from "@/components/funds/FundTables";
import { MembershipClaim } from "@/components/funds/MembershipClaim";
import { useIsQualified } from "@/hooks/useIsQualified";
import { RaisingStats } from "@/components/funds/RaisingStats";
import { useClubMember } from "@/hooks/useClubMember";
import { useClubData } from "@/hooks/useClubData";
import { ClubActions } from "@/components/funds/ClubActions";
import { BuyRedeemPanel } from "@/components/funds/BuyRedeemPanel";
import { WrongNetworkBanner } from "@/components/shared/WrongNetworkBanner";
import { useSupportedNetwork } from "@/hooks/useSupportedNetwork";
import { cn } from "@/lib/utils";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      clubAddress: params?.clubAddress,
    },
  };
};

export default function FundSinglePage({
  clubAddress,
}: {
  clubAddress: Address;
}) {
  const { address } = useAccount();
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubMember } = useClubMember(address, clubAddress);
  const { data: isQualified } = useIsQualified(clubAddress);
  const { data: isSupported } = useSupportedNetwork();

  const { name, openRaise, raiseOver } = clubData;
  const { isMember } = clubMember;

  return (
    <>
      <Head>
        <title>Credit Vault - {name}</title>
      </Head>

      <main>
        <Columned width={1020} className="py-8">
          <ClubHeader />
          {!isSupported && <WrongNetworkBanner />}
          {isQualified && !isMember && <BannerCta clubAddress={clubAddress} className="mt-4" />}

          <Container className="mt-4">
            <div className="flex w-full md:flex-col">
              <section className="flex flex-col justify-between flex-1 text-left">
                <ClubDetails clubAddress={clubAddress} />
                <ClubStats clubAddress={clubAddress} />
              </section>
              <section className={cn("flex-1 pl-6 flex flex-col justify-between md:pl-0 md:mt-4", {
                "unsupported": !isSupported,
              })}>
                {openRaise && !raiseOver && <RaisingStats clubAddress={clubAddress} />}
                {raiseOver && <BuyRedeemPanel clubAddress={clubAddress} />}
                {isMember ? (
                  <ClubActions clubAddress={clubAddress} />
                ) : (
                  <MembershipClaim clubAddress={clubAddress} />
                )}
              </section>
            </div>

            <FundTables
              clubAddress={clubAddress}
              className="mt-8"
            />
          </Container>
          <Footer />
        </Columned>
      </main>
    </>
  )
}