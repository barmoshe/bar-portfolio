"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  Code,
  Cloud,
  Server,
  Terminal,
  Sparkles,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

// Typing animation text options
const typingTexts = [
  "Building scalable applications",
  "Crafting cloud solutions",
  "Developing microservices",
  "Automating with DevOps",
  "Architecting infrastructure",
];

// Tech stack icons for the floating animation
const techIcons = [
  { icon: "aws.svg", delay: 0, size: 40 },
  { icon: "docker.svg", delay: 1.1, size: 38 },
  { icon: "kubernetes.svg", delay: 0.7, size: 42 },
  { icon: "typescript.svg", delay: 1.5, size: 36 },
  { icon: "python.svg", delay: 0.3, size: 40 },
  { icon: "react.svg", delay: 0.9, size: 38 },
  { icon: "node.svg", delay: 1.7, size: 44 },
  { icon: "terraform.svg", delay: 0.5, size: 40 },
  { icon: "golang.svg", delay: 1.3, size: 36 },
];

// Define safe screen areas for floating icons
const safeZones = {
  topLeft: { x: [5, 25], y: [5, 25] },
  topRight: { x: [75, 95], y: [5, 25] },
  bottomLeft: { x: [5, 25], y: [75, 95] },
  bottomRight: { x: [75, 95], y: [75, 95] },
  midTop: { x: [30, 70], y: [5, 20] },
  midBottom: { x: [30, 70], y: [80, 95] },
  midLeft: { x: [5, 20], y: [30, 70] },
  midRight: { x: [80, 95], y: [30, 70] },
};

// Assign each icon to a specific zone to prevent chaos
const iconPlacements = [
  safeZones.topLeft,
  safeZones.topRight,
  safeZones.bottomLeft,
  safeZones.bottomRight,
  safeZones.midTop,
  safeZones.midLeft,
  safeZones.midRight,
  safeZones.midBottom,
  safeZones.midTop,
];

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(120); // Slower initial typing speed
  const [isClient, setIsClient] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 1200, // Default fallback values
    height: 800,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // More gentle spring config for mouse follow effect
  const springConfig = { damping: 40, stiffness: 100 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // Parallax effect on scroll (more subtle)
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, -80]);
  const y2 = useTransform(scrollY, [0, 800], [0, -40]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Mark component as client-side rendered
  useEffect(() => {
    setIsClient(true);

    // Now that we're on the client, we can safely get window dimensions
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Handle window resize for responsive animations
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle mouse movement for interactive background (with throttling)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only update if mouse has moved significantly (reduces jitter)
      const currentX = mouseX.get();
      const currentY = mouseY.get();
      const distance = Math.sqrt(
        Math.pow(x - currentX, 2) + Math.pow(y - currentY, 2)
      );

      if (distance > 5) {
        mouseX.set(x);
        mouseY.set(y);
      }
    }
  };

  // Typing animation effect (slowed down)
  useEffect(() => {
    if (!isClient) return; // Only run on client

    const currentText = typingTexts[typingIndex];

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
          setTypingIndex((prevIndex) => (prevIndex + 1) % typingTexts.length);
          // Longer pause before typing the next text
          setTypingSpeed(300);
        } else {
          // Deleting is still faster than typing but not too fast
          setTypingSpeed(80 + Math.random() * 20);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, typingIndex, typingSpeed, isClient]);

  // Initial animation - delay to ensure proper loading
  useEffect(() => {
    if (!isClient) return; // Only run on client

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [isClient]);

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center justify-center py-10 sm:py-16 md:py-20 overflow-hidden"
    >
      {/* Dynamic background elements */}
      <div className="absolute inset-0 -z-10 w-full">
        <div className="absolute inset-0 w-screen left-0 right-0 bg-gradient-to-br from-primary/10 via-background to-background"></div>
        <div className="absolute inset-0 w-screen left-0 right-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]"></div>

        {/* Interactive gradient that follows mouse (more subtle) */}
        <motion.div
          className="absolute bg-primary/3 rounded-full blur-[150px] opacity-50"
          style={{
            width: Math.max(1200, windowDimensions.width),
            height: Math.max(1200, windowDimensions.height),
            x: useTransform(mouseXSpring, (x) => x - 400),
            y: useTransform(mouseYSpring, (y) => y - 400),
          }}
        />

        {/* Animated background elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating tech stack icons removed */}
      </div>

      <motion.div
        className="container mx-auto px-4 md:px-6 pt-6 sm:pt-10 md:pt-16 relative z-10"
        style={{ opacity }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col space-y-8 mx-auto lg:mx-0 max-w-xl" // Centered for mobile, normal on desktop
          >
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-3 mb-6" // Increased bottom margin
              >
                <span className="inline-block px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full">
                  <motion.span
                    animate={{ rotate: [0, 7, 0] }} // Reduced rotation
                    transition={{ duration: 3, repeat: Infinity }} // Slowed down
                    className="inline-block mr-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5 inline-block" />
                  </motion.span>
                  Available for hire
                </span>
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
                {" "}
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="block"
                >
                  Hi, I'm{" "}
                  <span className="text-primary relative inline-block">
                    Bar Moshe
                    <motion.span
                      className="absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.2, delay: 1.2 }} // Slowed this down
                    />
                  </span>
                </motion.span>
              </h1>

              <motion.h2
                className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4" // Adjusted margin
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                Software Developer & DevOps Enthusiast
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="flex flex-col sm:flex-row sm:items-center text-xl text-muted-foreground max-w-lg mb-4" // Made responsive
              >
                <span className="mr-2 mb-1 sm:mb-0">I specialize in</span>
                <span className="text-primary font-medium min-h-[1.75em]">
                  {" "}
                  {displayedText}
                  <span className="inline-block w-0.5 h-5 bg-primary ml-0.5 animate-blink"></span>
                </span>
              </motion.div>

              <motion.p
                className="text-lg text-muted-foreground max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 1 }}
              >
                Seeking Backend or DevOps roles. Passionate about building
                robust, scalable systems and cloud infrastructure.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full shadow-md hover:shadow-lg transition-all group"
              >
                <a href="#contact" className="flex items-center gap-2">
                  Get in Touch
                  <motion.span
                    animate={{ x: [0, 3, 0] }} // Reduced movement
                    transition={{
                      duration: 2.5, // Slowed down
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  >
                    <Mail className="h-4 w-4 group-hover:text-white" />
                  </motion.span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-primary/20 hover:border-primary transition-all group"
              >
                <a href="#projects" className="flex items-center gap-2">
                  View Projects
                  <motion.span
                    animate={{ rotate: [0, 8, 0] }} // Reduced rotation
                    transition={{ duration: 3, repeat: Infinity }} // Slowed down
                  >
                    <Code className="h-4 w-4 group-hover:text-primary" />
                  </motion.span>
                </a>
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-wrap space-x-0 space-y-3 sm:space-y-0 sm:space-x-4 pt-2" // Better mobile layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.4 }}
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <a
                    href="https://github.com/barmoshe"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
                >
                <a
                  href="https://linkedin.com/in/barmoshe"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
                >
                <a href="mailto:1barmoshe1@gmail.com" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>

                <div className="h-8 w-px bg-border mx-2 hidden sm:block"></div>
              </div>

              <div className="flex items-center text-sm text-muted-foreground ml-1 sm:ml-0">
                <Terminal className="h-4 w-4 mr-2 text-primary" />
                <span className="hidden sm:inline">
                  Tech enthusiast with a passion for innovation
                </span>
                <span className="sm:hidden">Tech enthusiast</span>
            </div>
            </motion.div>
          </motion.div>

          {isClient && ( // Only render on client side to avoid hydration mismatch
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.9,
              }}
              transition={{ duration: 0.8, delay: 0.6 }} // Slowed down
              className="relative hidden lg:block mx-auto max-w-md" // Added max width and centered
            >
              <div className="relative w-full aspect-square rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 p-8 shadow-xl">
                {/* Animated rings (slowed down) */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/20"
                  animate={{ scale: [1, 1.04, 1] }} // Reduced scale
                  transition={{
                    duration: 8, // Much slower
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border border-primary/10"
                  animate={{ scale: [1, 1.02, 1] }} // Reduced scale
                  transition={{
                    duration: 6, // Much slower
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
                      duration: 40, // Much slower rotation
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
              <img
                src="/placeholder.svg?height=500&width=500"
                alt="Bar Moshe"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

                {/* Floating skill icons around the profile (more spaced out and slower) */}
                <motion.div
                  className="absolute -top-4 -right-4 p-3 bg-background rounded-full shadow-lg border border-border/50"
                  animate={{ y: [0, -8, 0] }} // Reduced movement
                  transition={{
                    duration: 6, // Slowed down
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Cloud className="h-6 w-6 text-primary" />
                </motion.div>

                <motion.div
                  className="absolute top-1/4 -right-6 p-3 bg-background rounded-full shadow-lg border border-border/50"
                  animate={{ y: [0, 8, 0] }} // Reduced movement
                  transition={{
                    duration: 7, // Slowed down
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                >
                  <Server className="h-6 w-6 text-primary" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 p-3 bg-background rounded-full shadow-lg border border-border/50"
                  animate={{ y: [0, 6, 0] }} // Reduced movement
                  transition={{
                    duration: 6.5, // Slowed down
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <Code className="h-6 w-6 text-primary" />
                </motion.div>
              </div>

              {/* Decorative elements (slowed down) */}
              <motion.div
                className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full blur-md"
                animate={{ scale: [1, 1.15, 1] }} // Reduced scale
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }} // Slowed down
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-full blur-md"
                animate={{ scale: [1, 1.2, 1] }} // Reduced scale
                transition={{
                  duration: 7, // Slowed down
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
              />
          </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
          transition={{ duration: 0.7, delay: 1.6 }} // Slowed down
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }} // Reduced movement
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} // Slowed down
          >
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="rounded-full border border-primary/20 hover:bg-primary/10 hover:border-primary/50 transition-all"
            >
            <a href="#about" aria-label="Scroll down">
              <ArrowDown className="h-6 w-6" />
            </a>
          </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
