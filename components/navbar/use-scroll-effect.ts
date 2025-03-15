"use client";

import { useState, useEffect } from "react";

interface UseScrollEffectProps {
  threshold?: number;
  sectionIds: string[];
}

interface UseScrollEffectReturn {
  isScrolled: boolean;
  activeSection: string;
}

export function useScrollEffect({
  threshold = 10,
  sectionIds,
}: UseScrollEffectProps): UseScrollEffectReturn {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(sectionIds[0] || "home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);

      // Determine active section based on scroll position
      const currentSection = sectionIds.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, sectionIds]);

  return { isScrolled, activeSection };
}
