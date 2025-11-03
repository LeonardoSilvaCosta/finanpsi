"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export default function Header() {
  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-semibold">
              <span className="text-[#4F7942] font-bold">FinanPsi</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#beneficios"
              className="text-[#333333] hover:text-[#6B995E] transition-colors text-sm font-medium"
            >
              Benefícios
            </Link>
            <Link
              href="#inscrever"
              className="text-[#333333] hover:text-[#6B995E] transition-colors text-sm font-medium"
            >
              Inscrever-se
            </Link>
          </nav>

          {/* CTA Button */}
          <button
            onClick={() => {
              trackEvent("header_cta_clicked", {}, { category: "navigation" });
              document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-[#6B995E] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Começar Agora
          </button>
        </div>
      </div>
    </header>
  );
}

