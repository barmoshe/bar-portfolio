"use client";

import { motion } from "framer-motion";

interface HeroHeadingProps {
  name: string;
  greeting?: string;
  titleClassName?: string;
  nameClassName?: string;
  underlineClassName?: string;
}

export default function HeroHeading({
  name,
  greeting = "Hi, I'm",
  titleClassName = "text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight",
  nameClassName = "text-primary relative inline-block",
  underlineClassName = "absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full",
}: HeroHeadingProps) {
  return (
    <h1 className={titleClassName}>
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="block"
      >
        {greeting}{" "}
        <span className={nameClassName}>
          {name}
          <motion.span
            className={underlineClassName}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.2, delay: 1.2 }}
          />
        </span>
      </motion.span>
    </h1>
  );
}
