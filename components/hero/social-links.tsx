"use client";

import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Terminal } from "lucide-react";

interface SocialLink {
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
}

interface SocialLinksProps {
  links?: SocialLink[];
  tagline?: string;
  mobileTagline?: string;
}

export default function SocialLinks({
  links = [
    {
      href: "https://github.com/barmoshe",
      icon: <Github className="h-5 w-5" />,
      label: "GitHub",
      external: true,
    },
    {
      href: "https://linkedin.com/in/barmoshe",
      icon: <Linkedin className="h-5 w-5" />,
      label: "LinkedIn",
      external: true,
    },
  ],
  tagline = "Tech enthusiast with a passion for innovation",
  mobileTagline = "Tech enthusiast",
}: SocialLinksProps) {
  return (
    <div className="flex flex-wrap space-x-0 space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {links.map((link, index) => (
          <Button
            key={index}
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
          >
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              aria-label={link.label}
            >
              {link.icon}
            </a>
          </Button>
        ))}
        <div className="h-8 w-px bg-border mx-2 hidden sm:block"></div>
      </div>

      <div className="flex items-center text-sm text-muted-foreground ml-1 sm:ml-0">
        <Terminal className="h-4 w-4 mr-2 text-primary" />
        <span className="hidden sm:inline">{tagline}</span>
        <span className="sm:hidden">{mobileTagline}</span>
      </div>
    </div>
  );
}
