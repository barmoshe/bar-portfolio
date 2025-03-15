"use client";

import Link from "next/link";

interface NavLink {
  name: string;
  href: string;
}

interface NavDesktopLinksProps {
  links: NavLink[];
  activeSection: string;
}

export default function NavDesktopLinks({
  links,
  activeSection,
}: NavDesktopLinksProps) {
  return (
    <div className="hidden md:flex items-center space-x-1">
      {links.map((link) => {
        const isActive = activeSection === link.href.substring(1);
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 relative
              ${
                isActive
                  ? "text-primary"
                  : "text-foreground/80 hover:text-foreground hover:bg-secondary"
              }
            `}
          >
            {link.name}
            {isActive && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
