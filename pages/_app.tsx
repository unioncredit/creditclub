import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import { PrivyProvider } from "@privy-io/react-auth";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { Web3Provider } from "../providers/Web3Provider";
import { TestProvider } from "../providers/TestProvider";
import { ModalManagerProvider } from "@/providers/ModalManagerProvider";

const queryClient = new QueryClient();

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

        <link rel="icon" href="/favicons/favicon.ico" sizes="any"/>
        <link rel="icon" href="/favicons/icon.svg" type="image/svg+xml"/>
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png"/>
        <link rel="manifest" href="/favicons/manifest.json"/>

        <title>Privy Auth Starter</title>
        <meta name="description" content="Privy Auth Starter"/>
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
            <ModalManagerProvider>
              <TestProvider>
                <Component {...pageProps} />
              </TestProvider>
            </ModalManagerProvider>
          </Web3Provider>
        </QueryClientProvider>
      </PrivyProvider>
    </>
  );
}

export default MyApp;
