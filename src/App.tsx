import './App.css'

import { Homepage } from "@/pages/Homepage.tsx";
import { Web3Provider } from "@/providers/Web3Provider";
import { CreditClubDataProvider } from "@/providers/CreditClubDataProvider";
import { CreditClubContactsProvider } from "@/providers/CreditClubContactsProvider";

function App() {
  return (
    <Web3Provider>
      <CreditClubDataProvider>
        <CreditClubContactsProvider>
          <Homepage />
        </CreditClubContactsProvider>
      </CreditClubDataProvider>
    </Web3Provider>
  )
}

export default App
