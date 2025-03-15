import { Github, Linkedin, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/70 backdrop-blur-sm py-12 border-t border-border/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <Link
              href="/"
              className="text-2xl font-bold font-poppins text-primary transition-all duration-300 hover:opacity-80"
            >
              Bar<span className="text-foreground">Moshe</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Software Developer & DevOps Enthusiast passionate about building
              scalable applications and cloud solutions.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-3 mb-4">
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
            </div>
            <nav className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="#home"
                className="text-muted-foreground hover:text-primary transition-colors underline-effect"
              >
                Home
              </Link>
              <Link
                href="#about"
                className="text-muted-foreground hover:text-primary transition-colors underline-effect"
              >
                About
              </Link>
              <Link
                href="#projects"
                className="text-muted-foreground hover:text-primary transition-colors underline-effect"
              >
                Projects
              </Link>
              <Link
                href="#contact"
                className="text-muted-foreground hover:text-primary transition-colors underline-effect"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            © {currentYear} Bar Moshe. Made with{" "}
            <Heart className="h-3 w-3 text-primary fill-primary animate-pulse" />{" "}
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
