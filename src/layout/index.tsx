import React from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Header";
interface Props {
  children: React.ReactNode;
  showFooter?: boolean;
  showHeader?: boolean;
}

export default function PageLayout({ children, showFooter = true, showHeader = true }: Props) {
  const isBare = !showHeader && !showFooter;

  return (
    <main
      className={`overflow-x-hidden ${isBare ? "flex min-h-dvh flex-col" : ""}`}
    >
      <div className="absolute top-0 h-1 w-full" />
      {showHeader && <Navbar />}
      <div className={`w-full min-w-0 ${isBare ? "min-h-0 flex-1" : "h-full"}`}>
        {children}
      </div>
      {showFooter && <Footer />}
    </main>
  );
}
