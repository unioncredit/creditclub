import './App.css'

import { Homepage } from "@/pages/Homepage.tsx";
import { Web3Provider } from "@/providers/Web3Provider";
import { CreditClubDataProvider } from "@/providers/CreditClubDataProvider";
import { CreditClubContactsProvider } from "@/providers/CreditClubContactsProvider";
import { Layout } from '@/components/shared/Layout.tsx';
import { ModalManagerProvider } from "@/providers/ModalManagerProvider.tsx";
import { ConnectedMemberProvider } from "@/providers/ConnectedMemberProvider.tsx";
import { ToastsProvider } from "@/providers/ToastsProvider.tsx";

function App() {
  return (
    <Web3Provider>
      <CreditClubDataProvider>
        <CreditClubContactsProvider>
          <ConnectedMemberProvider>
            <ToastsProvider>
              <ModalManagerProvider>
                <Layout>
                  <Homepage />
                </Layout>
              </ModalManagerProvider>
            </ToastsProvider>
          </ConnectedMemberProvider>
        </CreditClubContactsProvider>
      </CreditClubDataProvider>
    </Web3Provider>
  )
}

export default App
