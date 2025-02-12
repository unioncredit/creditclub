import Head from "next/head";
import { Address } from "viem";
import { GetServerSideProps } from "next";

import { Columned } from "@/components/shared/Columned";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Container } from "@/components/shared/Container";
import { BannerCta } from "@/components/funds/BannerCta";
import { ClubDetails } from "@/components/funds/ClubDetails";
import { ClubStats } from "@/components/funds/ClubStats";
import { FundTables } from "@/components/funds/FundTables";
import { ClubActivity } from "@/components/funds/ClubActivity";
import { MembershipClaim } from "@/components/funds/MembershipClaim";
import { useIsQualified } from "@/hooks/useIsQualified";

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
  const { data: isQualified } = useIsQualified(clubAddress);

  return (
    <>
      <Head>
        <title>Fund Single Page</title>
      </Head>

      <main>
        <Columned width={1020} className="py-8">
          <Header />
          {isQualified && <BannerCta clubAddress={clubAddress} className="mt-4" />}

          <Container className="mt-4">
            <div className="flex w-full">
              <section className="flex flex-col justify-between flex-1 text-left">
                <ClubDetails clubAddress={clubAddress} />
                <ClubStats clubAddress={clubAddress} />
              </section>
              <section className="flex-1 pl-6 flex flex-col justify-between">
                <MembershipClaim clubAddress={clubAddress} />
                <ClubActivity />
              </section>
            </div>

            <FundTables className="mt-8" />
          </Container>
          <Footer />
        </Columned>
      </main>
    </>
  )
}