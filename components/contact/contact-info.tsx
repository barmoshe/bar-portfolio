"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { ContactInfoItem } from "./contact-data";

interface ContactInfoProps {
  items: ContactInfoItem[];
  title?: string;
  inView: boolean;
}

export default function ContactInfo({
  items,
  title = "Contact Information",
  inView,
}: ContactInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="h-full border-border/50 hover-card-effect">
        <CardContent className="p-6">
          <h3 className="text-2xl font-semibold mb-6 font-poppins">{title}</h3>

          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="bg-primary/10 p-3 rounded-full transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  {getIcon(item.type)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="font-medium hover:text-primary transition-colors underline-effect"
                  >
                    {item.value}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Helper function to get the appropriate icon
function getIcon(type: string) {
  switch (type) {
    case "email":
      return <Mail className="h-6 w-6 text-primary" />;
    case "phone":
      return <Phone className="h-6 w-6 text-primary" />;
    case "linkedin":
      return <Linkedin className="h-6 w-6 text-primary" />;
    case "github":
      return <Github className="h-6 w-6 text-primary" />;
    default:
      return <Mail className="h-6 w-6 text-primary" />;
  }
}
