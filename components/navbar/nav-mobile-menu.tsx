"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface NavLink {
  name: string;
  href: string;
}

interface NavMobileMenuProps {
  isOpen: boolean;
  links: NavLink[];
  activeSection: string;
  closeMenu: () => void;
}

export default function NavMobileMenu({
  isOpen,
  links,
  activeSection,
  closeMenu,
}: NavMobileMenuProps) {
  if (!isOpen) return null;

  return (
    <motion.div 
      className="md:hidden"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="px-3 pt-2 pb-3 space-y-2 bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50">
        {links.map((link) => {
          const isActive = activeSection === link.href.substring(1);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`block px-3 py-2.5 rounded-md text-base font-medium transition-all duration-300 relative
                ${
                  isActive
                    ? "text-primary bg-primary/5 font-semibold"
                    : "text-foreground/80 hover:text-foreground hover:bg-secondary"
                }
              `}
              onClick={closeMenu}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
