"use client";

import type React from "react";

import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, Mail, Phone, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Message sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    });

    setIsSubmitting(false);
    e.currentTarget.reset();
  };

  return (
    <section id="contact" ref={ref} className="py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="section-heading">Get In Touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Feel free to reach out for collaboration, project discussions, or
            potential career opportunities!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full border-border/50 hover-card-effect">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 font-poppins">
                  Contact Information
                </h3>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4 group">
                    <div className="bg-primary/10 p-2 sm:p-3 rounded-full transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                      <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Email</p>
                      <a
                        href="mailto:1barmoshe1@gmail.com"
                        className="text-sm sm:text-base font-medium hover:text-primary transition-colors underline-effect"
                      >
                        1barmoshe1@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 group">
                    <div className="bg-primary/10 p-2 sm:p-3 rounded-full transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                      <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Phone</p>
                      <a
                        href="tel:+972546561465"
                        className="text-sm sm:text-base font-medium hover:text-primary transition-colors underline-effect"
                      >
                        +972-54-656-1465
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 group">
                    <div className="bg-primary/10 p-2 sm:p-3 rounded-full transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                      <Linkedin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">LinkedIn</p>
                      <a
                        href="https://linkedin.com/in/barmoshe"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base font-medium hover:text-primary transition-colors underline-effect"
                      >
                        linkedin.com/in/barmoshe
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 group">
                    <div className="bg-primary/10 p-2 sm:p-3 rounded-full transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                      <Github className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">GitHub</p>
                      <a
                        href="https://github.com/barmoshe"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base font-medium hover:text-primary transition-colors underline-effect"
                      >
                        github.com/barmoshe
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-border/50 hover-card-effect">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 font-poppins">
                  Send a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="name" className="text-xs sm:text-sm font-medium">
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        required
                        className="text-sm sm:text-base transition-all duration-300 focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="email" className="text-xs sm:text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        required
                        className="text-sm sm:text-base transition-all duration-300 focus:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="subject" className="text-xs sm:text-sm font-medium">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Subject"
                      required
                      className="text-sm sm:text-base transition-all duration-300 focus:border-primary/50"
                    />
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="message" className="text-xs sm:text-sm font-medium">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Your message"
                      rows={5}
                      required
                      className="text-sm sm:text-base resize-none transition-all duration-300 focus:border-primary/50"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-full transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </div>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
