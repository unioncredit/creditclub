import Head from "next/head";

import { Columned } from "@/components/shared/Columned";
import { Container } from "@/components/shared/Container";
import { Footer } from "@/components/shared/Footer";
import { CreditVaultIntro } from "@/components/home/CreditVaultIntro";
import { IcoView } from "@/components/home/IcoView";
import { Header } from "@/components/shared/Header";
import { ClubPromoBanner } from "@/components/shared/ClubPromoBanner";
import { Address } from "viem";

export default function HomePage() {
  const clubAddress = process.env.NEXT_PUBLIC_CLUB_PROMO_ADDRESS! as Address;

  return (
    <>
      <Head>
        <title>CreditClub - Introducing Credit Vaults</title>
      </Head>

      <main>
        <Columned width={1020} className="py-8">
          <Header />
          <ClubPromoBanner clubAddress={clubAddress} />
          <Container className="mt-4">
            <CreditVaultIntro clubAddress={clubAddress} />
          </Container>
          <Container className="mt-4">
            <IcoView clubAddress={clubAddress} />
          </Container>
          <Footer />
        </Columned>
      </main>
    </>
  );
}
