import { Header } from "@/components/shared/Header.tsx";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="pb-24">
      <Header />
      {children}
    </main>
  );
};