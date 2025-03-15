"use client";

import Link from "next/link";

interface NavLogoProps {
  firstName?: string;
  lastName?: string;
  href?: string;
}

export default function NavLogo({
  firstName = "Bar",
  lastName = "Moshe",
  href = "/",
}: NavLogoProps) {
  return (
    <Link
      href={href}
      className="text-2xl font-bold font-poppins text-primary transition-all duration-300 hover:opacity-80"
    >
      {firstName}
      <span className="text-foreground">{lastName}</span>
    </Link>
  );
}
