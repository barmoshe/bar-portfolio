"use client";

import { useState } from "react";
import NavDesktopLinks from "@/components/navbar/nav-desktop-links";
import NavLogo from "@/components/navbar/nav-logo";
import NavMobileMenu from "@/components/navbar/nav-mobile-menu";
import NavMobileToggle from "@/components/navbar/nav-mobile-toggle";
import { navLinks } from "@/components/navbar/nav-data";
import { useScrollEffect } from "@/components/navbar/use-scroll-effect";

interface NavLink {
  name: string;
  href: string;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get section IDs from nav links
  const sectionIds = navLinks.map((link: NavLink) => link.href.substring(1));

  // Use custom hook for scroll effects
  const { isScrolled, activeSection } = useScrollEffect({
    sectionIds,
  });

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <NavLogo />

          {/* Desktop Navigation */}
          <NavDesktopLinks links={navLinks} activeSection={activeSection} />

          {/* Mobile Menu Toggle */}
          <NavMobileToggle
            isOpen={mobileMenuOpen}
            toggleMenu={toggleMobileMenu}
          />
        </nav>
      </div>

      {/* Mobile Menu */}
      <NavMobileMenu
        isOpen={mobileMenuOpen}
        links={navLinks}
        activeSection={activeSection}
        closeMenu={closeMobileMenu}
      />
    </header>
  );
}
