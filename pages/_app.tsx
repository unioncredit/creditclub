import "../styles/globals.scss";
import '@decent.xyz/the-box/index.css';

import type { AppProps } from "next/app";
import Head from "next/head";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Web3Provider } from "@/providers/Web3Provider";
import { ConnectedMemberProvider } from "@/providers/ConnectedMemberProvider";
import { ModalManagerProvider } from "@/providers/ModalManagerProvider";
import { init } from "@airstack/airstack-react";
import { ToastsProvider } from "@/providers/ToastsProvider";
import { UnionMemberProvider } from "@/providers/UnionMemberProvider";
import { UnionDataProvider } from "@/providers/UnionDataProvider";
import { CacheProvider } from "@/providers/CacheProvider";
import { FathomAnalytics } from "@/components/shared/FathomAnalytics";

const queryClient = new QueryClient();

init(process.env.NEXT_PUBLIC_AIRSTACK_KEY!);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <FathomAnalytics />
      <Head>
        <link
          rel="preload"
          href="/fonts/BerkeleyMono-Regular.otf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/BerkeleyMono-Medium.otf"
          as="font"
          crossOrigin=""
        />

        <link rel="icon" type="image/png" href="/favicons/favicon.png" />
        <link rel="icon" type="image/svg+xml" href="/favicons/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/favicons/manifest.json" />

        <title>CreditClub</title>
        <meta name="description" content="Credit Vaults are tokenized perpetual credit funds." />
      </Head>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          embeddedWallets: {
            createOnLogin: "all-users",
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Web3Provider>
            <ToastsProvider>
              <CacheProvider>
                <UnionDataProvider>
                  <UnionMemberProvider>
                    <ConnectedMemberProvider>
                      <ModalManagerProvider>
                        <Component {...pageProps} />
                      </ModalManagerProvider>
                    </ConnectedMemberProvider>
                  </UnionMemberProvider>
                </UnionDataProvider>
              </CacheProvider>
            </ToastsProvider>
          </Web3Provider>
        </QueryClientProvider>
      </PrivyProvider>
    </>
  );
}

export default MyApp;
