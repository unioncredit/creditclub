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

  if (!clubAddress) {
    return (
      <main>
        <div className="p-8 text-center">
          <p>Configuration error: Club address not set</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>CreditClub - Build Credit With Friends</title>
      </Head>

      <main>
        <Columned width={1020} className="py-8">
          <Header />
          <ClubPromoBanner clubAddress={clubAddress} />
          <Container className="mt-4">
            <div className="max-w-[750px] m-auto py-4">
              <CreditVaultIntro clubAddress={clubAddress} />
            </div>
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
