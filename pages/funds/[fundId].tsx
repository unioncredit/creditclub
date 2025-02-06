import Head from "next/head";

import { Columned } from "@/components/shared/Columned";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Container } from "@/components/shared/Container";
import { BannerCta } from "@/components/funds/BannerCta";
import { ClubDetails } from "@/components/funds/ClubDetails";
import { ClubStats } from "@/components/funds/ClubStats";
import { FundTables } from "@/components/funds/FundTables";
import { ClubActivity } from "@/components/funds/ClubActivity";
import { ClubActions } from "@/components/funds/ClubActions";

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
            <div className="flex w-full">
              <section className="flex flex-col justify-between flex-1 text-left">
                <ClubDetails/>
                <ClubStats/>
              </section>
              <section className="flex-1 pl-6 flex flex-col justify-between">
                <ClubActions />
                <ClubActivity />
              </section>
            </div>

            <FundTables className="mt-8" />
          </Container>
          <Footer/>
        </Columned>
      </main>
    </>
  )
}