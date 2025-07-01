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


export default function FundSinglePage() {
  // Temporary: Return minimal component to isolate the error
  return <div>Testing - minimal page</div>;
}