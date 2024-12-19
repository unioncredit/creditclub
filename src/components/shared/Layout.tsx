import { Header } from "@/components/shared/Header.tsx";
import { EnableNotificationsBanner } from "@/components/shared/EnableNotificationsBanner.tsx";
import { MobileNav } from "@/components/shared/MobileNav.tsx";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="pb-24">
      <Header />
      <MobileNav />
      <EnableNotificationsBanner />

      {children}
    </main>
  );
};