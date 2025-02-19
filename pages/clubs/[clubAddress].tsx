import Head from "next/head";
import { Address } from "viem";
import { GetServerSideProps } from "next";
import { useAccount } from "wagmi";

import { Columned } from "@/components/shared/Columned";
import { Header } from "@/components/shared/Header";
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

  const { openRaise, raiseOver } = clubData;
  const { isMember } = clubMember;

  return (
    <>
      <Head>
        <title>Fund Single Page</title>
      </Head>

      <main>
        <Columned width={1020} className="py-8">
          <Header />
          {isQualified && !isMember && <BannerCta clubAddress={clubAddress} className="mt-4" />}

          <Container className="mt-4">
            <div className="flex w-full">
              <section className="flex flex-col justify-between flex-1 text-left">
                <ClubDetails clubAddress={clubAddress} />
                <ClubStats clubAddress={clubAddress} />
              </section>
              <section className="flex-1 pl-6 flex flex-col justify-between">
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