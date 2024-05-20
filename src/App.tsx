import './App.css'
import { Web3Provider } from "@/providers/Web3Provider";
import { Homepage } from "@/pages/Homepage.tsx";

function App() {
  return (
    <Web3Provider>
      <Homepage />
    </Web3Provider>
  )
}

export default App
