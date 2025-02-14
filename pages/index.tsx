import Head from "next/head";

import { Columned } from "@/components/shared/Columned";
import { Header } from "@/components/shared/Header";
import { Container } from "@/components/shared/Container";
import { Footer } from "@/components/shared/Footer";
import { CreditVaultIntro } from "@/components/home/CreditVaultIntro";
import { IcoView } from "@/components/home/IcoView";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Fund · Homepage</title>
      </Head>

      <main>
        <Columned width={1020} className="py-8">
          <Header/>
          <Container className="mt-4">
            <CreditVaultIntro />
          </Container>
          <Container className="mt-4">
            <IcoView />
          </Container>
          <Footer/>
        </Columned>
      </main>
    </>
  );
}
