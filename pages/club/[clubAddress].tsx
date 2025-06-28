import Head from "next/head";
import { Address, isAddress } from "viem";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

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
import { ClubActivity } from "@/components/funds/ClubActivity";


export default function FundSinglePage({
  clubAddress,
}: {
  clubAddress: Address;
}) {
  const router = useRouter();

  // Use the router.query.clubAddress if clubAddress prop is not provided
  const resolvedClubAddress = (clubAddress || router.query.clubAddress) as Address;

  const { address } = useAccount();

  if (!resolvedClubAddress || !isAddress(resolvedClubAddress)) {
    return <p>Invalid club address</p>;
  }

  // Use the resolved address for all subsequent operations
  clubAddress = resolvedClubAddress;

  const { data: clubData, isLoading: clubDataLoading } = useClubData(clubAddress);
  const { data: clubMember, isLoading: clubMemberLoading } = useClubMember(address, clubAddress);
  const { data: isQualified } = useIsQualified(clubAddress);

  const { isPublic = false, isActivated = false, isTokenEnabled = false } = clubData || {};
  const { isMember = false } = clubMember || {};

  // Show loading state while initial data is fetching
  if (clubDataLoading || (address && clubMemberLoading)) {
    return (
      <main>
        <Columned width={1020} className="py-8">
          <div className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </Columned>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Credit Vault - Builders Credit</title>
      </Head>

      <main>
        <Columned width={1020} className="py-8">
          <ClubHeader clubAddress={clubAddress} />
          {isQualified && !isMember && <BannerCta clubAddress={clubAddress} className="mt-4" />}

          <Container className="mt-4">
            <div className="flex w-full md:flex-col">
              <section className="flex flex-col flex-1 text-left">
                <ClubDetails clubAddress={clubAddress} />
                {isActivated && <ClubStats clubAddress={clubAddress} />}
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