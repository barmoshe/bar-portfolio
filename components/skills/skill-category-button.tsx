"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface SkillCategoryProps {
  id: string;
  name: string;
  icon: ReactNode;
  iconBg: string;
  isActive: boolean;
  onClick: () => void;
}

export default function SkillCategoryButton({
  id,
  name,
  icon,
  iconBg,
  isActive,
  onClick,
}: SkillCategoryProps) {
  return (
    <Button
      key={id}
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={`rounded-full transition-all duration-300 flex items-center gap-2 ${
        isActive ? "shadow-md" : "opacity-70 hover:opacity-100"
      }`}
    >
      <div className={`p-1 rounded-full ${iconBg}`}>{icon}</div>
      <span className="hidden sm:inline">{name}</span>
      <span className="sm:hidden">{name.split(" ")[0]}</span>
    </Button>
  );
}
