import MobileCreditClubLogo from "@/assets/creditclub-mobile-logo.svg";

export const Footer = () => (
  <footer className="mt-8 flex flex-col items-center justify-center w-full">
    <MobileCreditClubLogo className="h-[50px] max-w-[115px] scale-75 -ml-[20px]" />

    <p className="text-[28px] tracking-tight">creditclub</p>
    <p className="font-mono text-xs">The Onchain Credit Company</p>
  </footer>
)