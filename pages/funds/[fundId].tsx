import Head from "next/head";

import { Columned } from "@/components/shared/Columned";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Container } from "@/components/shared/Container";
import { BannerCta } from "@/components/funds/BannerCta";

export default function FundSinglePage() {
  return (
    <>
      <Head>
        <title>Fund Single Page</title>
      </Head>

      <main>
        <Columned width={1020} className="py-8">
          <Header />
          <BannerCta className="mt-4" />
          <Container className="mt-4">
            <h1>Content</h1>
          </Container>
          <Footer/>
        </Columned>
      </main>
    </>
  )
}