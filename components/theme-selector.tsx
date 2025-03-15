"use client"

import { useTheme } from "@/contexts/theme-context"
import { motion } from "framer-motion"
import { Palette } from "lucide-react"
import { useState, useEffect } from "react"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)
  
  // Close the theme selector when clicking outside
  useEffect(() => {
    if (!isOpen) return
    
    const handleClickOutside = () => setIsOpen(false)
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  return (
    <div className="theme-selector fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      <motion.button
        onClick={(e) => {
          e.stopPropagation()
          toggleOpen()
        }}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground shadow-lg"
        aria-label="Toggle theme selector"
        whileTap={{ scale: 0.95 }}
      >
        <Palette size={18} />
      </motion.button>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="absolute bottom-12 right-0 flex flex-col sm:flex-row gap-2 p-2 bg-background rounded-lg shadow-lg border border-border/50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setTheme("blue")
              setIsOpen(false)
            }}
            className={`theme-option theme-blue w-8 h-8 rounded-full ${theme === "blue" ? "ring-2 ring-primary ring-offset-2" : ""}`}
            aria-label="Blue theme"
          />
          <button
            onClick={() => {
              setTheme("purple")
              setIsOpen(false)
            }}
            className={`theme-option theme-purple w-8 h-8 rounded-full ${theme === "purple" ? "ring-2 ring-primary ring-offset-2" : ""}`}
            aria-label="Purple theme"
          />
          <button
            onClick={() => {
              setTheme("green")
              setIsOpen(false)
            }}
            className={`theme-option theme-green w-8 h-8 rounded-full ${theme === "green" ? "ring-2 ring-primary ring-offset-2" : ""}`}
            aria-label="Green theme"
          />
        </motion.div>
      )}
    </div>
  )
}

