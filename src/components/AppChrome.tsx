"use client";

import { useState, type ReactNode } from "react";
import Header from "./Header";
import NavMenu from "./NavMenu";
import Footer from "./Footer";

export default function AppChrome({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Header onToggleMenu={() => setMenuOpen((v) => !v)} />
      <NavMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      {children}
      <Footer />
    </>
  );
}
