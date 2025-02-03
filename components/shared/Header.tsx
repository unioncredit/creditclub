import Link from "next/link";

import { ConnectButton } from "@/components/shared/ConnectButton";

export const Header = () => {
  return (
    <header className="px-5 py-2 border-b border-black flex justify-between items-center">
      <Link href="/">
        <div className="flex flex-col items-center gap-1">
          <p className="text-xl">CC:// Funds</p>
          <p className="text-sm">The Onchain Credit Company</p>
        </div>
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/funds/builders-credit" className="text-lg hover:font-medium">
          {'{BC Fund}'}
        </Link>

        <ConnectButton />
      </div>
    </header>
  )
};