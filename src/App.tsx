import './App.css'
import '@decent.xyz/the-box/index.css';

import { Homepage } from "@/pages/Homepage.tsx";
import { Web3Provider } from "@/providers/Web3Provider";
import { CreditClubDataProvider } from "@/providers/CreditClubDataProvider";
import { CreditClubContactsProvider } from "@/providers/CreditClubContactsProvider";
import { Layout } from '@/components/shared/Layout.tsx';
import { ModalManagerProvider } from "@/providers/ModalManagerProvider.tsx";
import { CreditClubMemberProvider } from "@/providers/CreditClubMemberProvider.tsx";
import { ToastsProvider } from "@/providers/ToastsProvider.tsx";
import { CacheProvider } from '@/providers/CacheProvider';
import { SettingsProvider } from "@/providers/SettingsProvider.tsx";
import { UnionDataProvider } from "@/providers/UnionDataProvider.tsx";
import { UnionMemberProvider } from "@/providers/UnionMemberProvider.tsx";
import { ClubActivityProvider } from "@/providers/ClubActivityProvider.tsx";
import { RewardsManagerProvider } from "@/providers/RewardsManagerDataProvider.tsx";

function App() {
  return (
    <Web3Provider>
      <CreditClubDataProvider>
        <CreditClubContactsProvider>
          <CreditClubMemberProvider>
            <UnionDataProvider>
              <UnionMemberProvider>
                <RewardsManagerProvider>
                  <ClubActivityProvider>
                    <CacheProvider>
                      <ToastsProvider>
                        <ModalManagerProvider>
                          <SettingsProvider>
                            <Layout>
                              <Homepage />
                            </Layout>
                          </SettingsProvider>
                        </ModalManagerProvider>
                      </ToastsProvider>
                    </CacheProvider>
                  </ClubActivityProvider>
                </RewardsManagerProvider>
              </UnionMemberProvider>
            </UnionDataProvider>
          </CreditClubMemberProvider>
        </CreditClubContactsProvider>
      </CreditClubDataProvider>
    </Web3Provider>
  )
}

export default App
