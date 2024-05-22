import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCreditClubContacts } from "@/providers/CreditClubContactsProvider.tsx";

export const Homepage = () => {
  const { address } = useAccount();

  const { data: contacts } = useCreditClubContacts();

  console.log({ contacts });

  return (
    <div className="flex flex-col items-center">
      <ConnectButton />
      <p className="mt-8">{address || "Not connected"}</p>
    </div>
  )
};