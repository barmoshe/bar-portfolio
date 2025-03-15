"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  texts: string[];
  className?: string;
  cursorClassName?: string;
}

export default function Typewriter({
  texts,
  className = "text-primary font-medium min-h-[1.75em]",
  cursorClassName = "inline-block w-0.5 h-5 bg-primary ml-0.5 animate-blink",
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(120);
  const [isClient, setIsClient] = useState(false);

  // Set client-side state to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (!isClient) return; // Only run on client

    const currentText = texts[textIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(currentText.substring(0, displayedText.length + 1));

        // If we've completed typing the current text
        if (displayedText.length === currentText.length) {
          // Longer pause at the end before deleting
          setTypingSpeed(150);
          setTimeout(() => setIsDeleting(true), 2500);
        } else {
          // Slower typing speed with slight randomness
          setTypingSpeed(120 + Math.random() * 40);
        }
      } else {
        setDisplayedText(currentText.substring(0, displayedText.length - 1));

        // If we've deleted the entire text
        if (displayedText.length === 0) {
          setIsDeleting(false);
          setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
          // Longer pause before typing the next text
          setTypingSpeed(300);
        } else {
          // Deleting is still faster than typing but not too fast
          setTypingSpeed(80 + Math.random() * 20);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, textIndex, typingSpeed, texts, isClient]);

  // If not client-side yet, return empty to avoid hydration mismatch
  if (!isClient) return null;

  return (
    <span className={className}>
      {displayedText}
      <span className={cursorClassName}></span>
    </span>
  );
}
