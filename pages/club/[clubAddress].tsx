import Head from "next/head";
import { Address } from "viem";
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
import { useRouter } from "next/router";
import { ClubActivity } from "@/components/funds/ClubActivity";
import { ClubDebug } from "@/components/funds/ClubDebug";

export default function FundSinglePage({
  clubAddress,
}: {
  clubAddress: Address;
}) {
  const router = useRouter();

  // Use the router.query.clubAddress if clubAddress prop is not provided
  clubAddress = (clubAddress || router.query.clubAddress) as Address

  const { address } = useAccount();
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubMember } = useClubMember(address, clubAddress);
  const { data: isQualified } = useIsQualified(clubAddress);

  const { isPublic, isActivated, isTokenEnabled, stakedBalance } = clubData;
  const { isMember } = clubMember;

  return (
    <>
      <Head>
        <title>Credit Vault - Builders Credit</title>
      </Head>

      <main>
        <Columned width={1020} className="py-8">
          <ClubHeader clubAddress={clubAddress} />
          {isQualified && !isMember && <BannerCta clubAddress={clubAddress} className="mt-4" />}
          <ClubDebug clubAddress={clubAddress} />

          <Container className="mt-4">
            <div className="flex w-full md:flex-col">
              <section className="flex flex-col flex-1 text-left">
                <ClubDetails clubAddress={clubAddress} />
                {isActivated && (
                  <ClubStats clubAddress={clubAddress} />
                )}
                <ClubActivity clubAddress={clubAddress} />
              </section>
              <section className="flex-1 pl-6 flex flex-col justify-between max-w-[450px] md:pl-0 md:mt-4 md:max-w-none">
                {isTokenEnabled && (
                  <>
                    {isPublic && !isActivated && <RaisingStats clubAddress={clubAddress} />}
                    {isActivated && <BuyRedeemPanel clubAddress={clubAddress} />}
                  </>
                )}
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