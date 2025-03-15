"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Save } from "lucide-react";

interface JSONEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRefresh: () => void;
  onSave: () => void;
  isLoading: boolean;
  isSaving: boolean;
  inView: boolean;
}

export default function JSONEditor({
  value,
  onChange,
  onRefresh,
  onSave,
  isLoading,
  isSaving,
  inView,
}: JSONEditorProps) {
  return (
    <Card className="p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">JSON Editor</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <textarea
          className="w-full h-[400px] p-4 font-mono text-sm bg-muted/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck="false"
          disabled={isLoading || isSaving}
        />
      </motion.div>
    </Card>
  );
}
