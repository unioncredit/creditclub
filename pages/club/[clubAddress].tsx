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

export default function FundSinglePage() {
  if (typeof window !== 'undefined') {
    console.log("=== FundSinglePage render start ===");
  }
  
  const router = useRouter();
  
  // Get clubAddress from router query - ensure it's a string
  const rawClubAddress = router.query.clubAddress;
  const clubAddress = (Array.isArray(rawClubAddress) ? rawClubAddress[0] : rawClubAddress) as Address | undefined;

  if (typeof window !== 'undefined' && clubAddress === "0xf82501018Fe8c6b0DbEb51604FDb636bdd741F74") {
    console.log("=== Problematic club address detected ===");
    console.log("Router ready:", router.isReady);
    console.log("Club address type:", typeof clubAddress);
  }

  const { address } = useAccount();
  
  // Only run hooks when router is ready and we have a valid clubAddress
  const { data: clubData } = useClubData(clubAddress || "0x0");
  const { data: clubMember } = useClubMember(address, clubAddress || "0x0");
  const { data: isQualified } = useIsQualified(clubAddress || "0x0");

  const { isPublic, isActivated, isTokenEnabled } = clubData || {};
  const { isMember } = clubMember || {};

  // Wait for router to be ready or invalid address
  if (!router.isReady || !clubAddress) {
    console.log("=== Returning null - router not ready or no address ===");
    return null;
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