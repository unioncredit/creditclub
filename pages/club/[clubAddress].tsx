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
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
  
  // Always call hooks first (Rules of Hooks)
  const { data: clubData } = useClubData(clubAddress || "0x0");
  const { data: clubMember } = useClubMember(address, clubAddress || "0x0");
  const { data: isQualified } = useIsQualified(clubAddress || "0x0");

  // Debug hook data to catch potential object rendering issues
  if (typeof window !== 'undefined' && clubAddress === "0xf82501018Fe8c6b0DbEb51604FDb636bdd741F74") {
    console.log("=== Hook Data Debug ===");
    console.log("clubData:", clubData);
    console.log("clubData type:", typeof clubData);
    console.log("clubMember:", clubMember);
    console.log("clubMember type:", typeof clubMember);
    console.log("isQualified:", isQualified);
    console.log("isQualified type:", typeof isQualified);
    
    // Check for any non-primitive values that might be rendered
    if (clubData) {
      Object.entries(clubData).forEach(([key, value]) => {
        if (value && typeof value === 'object' && value !== null) {
          console.warn(`⚠️ clubData.${key} is an object:`, value);
        }
      });
    }
    
    if (clubMember) {
      Object.entries(clubMember).forEach(([key, value]) => {
        if (value && typeof value === 'object' && value !== null) {
          console.warn(`⚠️ clubMember.${key} is an object:`, value);
        }
      });
    }
  }

  // Wait for router to be ready and validate address
  if (!router.isReady) {
    if (typeof window !== 'undefined') {
      console.log("=== Router not ready, returning null ===");
    }
    return null;
  }

  if (!clubAddress) {
    if (typeof window !== 'undefined') {
      console.log("=== No valid club address, returning null ===");
    }
    return null;
  }

  const isPublic: boolean = clubData?.isPublic ?? false;
  const isActivated: boolean = clubData?.isActivated ?? false;
  const isTokenEnabled: boolean = clubData?.isTokenEnabled ?? false;
  const isMember: boolean = clubMember?.isMember ?? false;

  // Additional safety checks for rendering
  if (typeof window !== 'undefined' && clubAddress === "0xf82501018Fe8c6b0DbEb51604FDb636bdd741F74") {
    console.log("=== Pre-render Safety Checks ===");
    console.log("isPublic:", isPublic, typeof isPublic);
    console.log("isActivated:", isActivated, typeof isActivated);
    console.log("isTokenEnabled:", isTokenEnabled, typeof isTokenEnabled);
    console.log("isMember:", isMember, typeof isMember);
    console.log("memberNftBalance:", clubMember?.memberNftBalance?.toString());
    console.log("Connected address:", address);
    console.log("Club memberNftAddress:", clubData?.memberNftAddress);
  }

  return (
    <>
      <Head>
        <title>Credit Vault - Builders Credit</title>
      </Head>

      <main>
        <ErrorBoundary>
          <Columned width={1020} className="py-8">
            <ClubHeader clubAddress={clubAddress} />
            {isQualified && !isMember && <BannerCta clubAddress={clubAddress} className="mt-4" />}

            <Container className="mt-4">
              <div className="flex w-full md:flex-col">
                <section className="flex flex-col flex-1 text-left">
                  <ErrorBoundary>
                    <ClubDetails clubAddress={clubAddress} />
                  </ErrorBoundary>
                  {isActivated && (
                    <ErrorBoundary>
                      <ClubStats clubAddress={clubAddress} />
                    </ErrorBoundary>
                  )}
                  <ErrorBoundary>
                    <ClubActivity clubAddress={clubAddress} />
                  </ErrorBoundary>
                </section>
                <section className="flex-1 pl-6 flex flex-col justify-between max-w-[450px] md:pl-0 md:mt-4 md:max-w-none">
                  {isTokenEnabled && (
                    <>
                      {isPublic && !isActivated && (
                        <ErrorBoundary>
                          <RaisingStats clubAddress={clubAddress} />
                        </ErrorBoundary>
                      )}
                      {isActivated && (
                        <ErrorBoundary>
                          <BuyRedeemPanel clubAddress={clubAddress} />
                        </ErrorBoundary>
                      )}
                    </>
                  )}
                  {isMember ? (
                    <ErrorBoundary>
                      <ClubActions clubAddress={clubAddress} />
                    </ErrorBoundary>
                  ) : (
                    <ErrorBoundary>
                      <MembershipClaim clubAddress={clubAddress} />
                    </ErrorBoundary>
                  )}
                </section>
              </div>

              <ErrorBoundary>
                <FundTables
                  clubAddress={clubAddress}
                  className="mt-8"
                />
              </ErrorBoundary>
            </Container>
            <Footer />
          </Columned>
        </ErrorBoundary>
      </main>
    </>
  )
}