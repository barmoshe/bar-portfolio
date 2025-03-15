"use client";

import { motion } from "framer-motion";
import { Code, Cloud, Server } from "lucide-react";
import { useState, useEffect } from "react";

interface ProfileImageProps {
  imageSrc: string;
  altText: string;
  showSkillIcons?: boolean;
}

export default function ProfileImage({
  imageSrc,
  altText,
  showSkillIcons = true,
}: ProfileImageProps) {
  const [isClient, setIsClient] = useState(false);

  // Set client-side state to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="relative hidden lg:block mx-auto max-w-md">
      <div className="relative w-full aspect-square rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 p-8 shadow-xl">
        {/* Animated rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border border-primary/10"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/5 to-transparent"></div>

        {/* Profile image with mask */}
        <div className="relative w-full h-full overflow-hidden rounded-full shadow-inner">
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent mix-blend-overlay"
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <img
            src={imageSrc}
            alt={altText}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Floating skill icons around the profile */}
        {showSkillIcons && (
          <>
            <motion.div
              className="absolute -top-4 -right-4 p-3 bg-background rounded-full shadow-lg border border-border/50"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Cloud className="h-6 w-6 text-primary" />
            </motion.div>

            <motion.div
              className="absolute top-1/4 -right-6 p-3 bg-background rounded-full shadow-lg border border-border/50"
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            >
              <Server className="h-6 w-6 text-primary" />
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 p-3 bg-background rounded-full shadow-lg border border-border/50"
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <Code className="h-6 w-6 text-primary" />
            </motion.div>
          </>
        )}
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full blur-md"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-full blur-md"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />
    </div>
  );
}
