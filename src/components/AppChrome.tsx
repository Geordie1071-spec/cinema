"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import NavMenu from "./NavMenu";
import Footer from "./Footer";

export default function AppChrome({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <Header onToggleMenu={() => setMenuOpen((v) => !v)} />
      <NavMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      {children}
      <Footer />
    </>
  );
}
