"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface NavMobileToggleProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export default function NavMobileToggle({
  isOpen,
  toggleMenu,
}: NavMobileToggleProps) {
  return (
    <div className="flex md:hidden items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        className="transition-all duration-300 hover:bg-secondary"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </div>
  );
}
