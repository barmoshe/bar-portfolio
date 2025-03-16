"use client"

import { useTheme } from "@/contexts/theme-context"
import { motion } from "framer-motion"
import { Palette } from "lucide-react"
import { useState } from "react"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <div className="theme-selector">
      <button
        onClick={toggleOpen}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground"
        aria-label="Toggle theme selector"
      >
        <Palette size={20} />
      </button>

      {isOpen && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
          <button
            onClick={() => setTheme("blue")}
            className={`theme-option theme-blue ${theme === "blue" ? "active" : ""}`}
            aria-label="Blue theme"
          />
          <button
            onClick={() => setTheme("purple")}
            className={`theme-option theme-purple ${theme === "purple" ? "active" : ""}`}
            aria-label="Purple theme"
          />
          <button
            onClick={() => setTheme("green")}
            className={`theme-option theme-green ${theme === "green" ? "active" : ""}`}
            aria-label="Green theme"
          />
        </motion.div>
      )}
    </div>
  )
}

