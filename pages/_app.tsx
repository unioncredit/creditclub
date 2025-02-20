import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Web3Provider } from "../providers/Web3Provider";
import { ConnectedMemberProvider } from "../providers/ConnectedMemberProvider";
import { ModalManagerProvider } from "@/providers/ModalManagerProvider";
import { init } from "@airstack/airstack-react";
import { ToastsProvider } from "@/providers/ToastsProvider";
import { UnionMemberProvider } from "@/providers/UnionMemberProvider";
import { UnionDataProvider } from "@/providers/UnionDataProvider";

const queryClient = new QueryClient();

init(process.env.NEXT_PUBLIC_AIRSTACK_KEY!);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
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

        <link rel="icon" type="image/svg+xml" href="/favicons/glasses-black.svg" />
        <link rel="apple-touch-icon" href="/favicons/glasses-black.svg" />
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
              <UnionDataProvider>
                <UnionMemberProvider>
                  <ConnectedMemberProvider>
                    <ModalManagerProvider>
                      <Component {...pageProps} />
                    </ModalManagerProvider>
                  </ConnectedMemberProvider>
                </UnionMemberProvider>
              </UnionDataProvider>
            </ToastsProvider>
          </Web3Provider>
        </QueryClientProvider>
      </PrivyProvider>
    </>
  );
}

export default MyApp;
