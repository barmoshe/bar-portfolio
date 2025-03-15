"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";

interface ProjectFilterTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  children: ReactNode;
}

export default function ProjectFilterTabs({
  activeTab,
  setActiveTab,
  children,
}: ProjectFilterTabsProps) {
  return (
    <Tabs
      defaultValue="all"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="flex justify-center mb-8">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 gap-2 p-1 bg-secondary/50 backdrop-blur-sm">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="backend"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            Backend
          </TabsTrigger>
          <TabsTrigger
            value="devops"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            DevOps
          </TabsTrigger>
          <TabsTrigger
            value="fullstack"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            Full Stack
          </TabsTrigger>
          <TabsTrigger
            value="ml"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            ML
          </TabsTrigger>
          <TabsTrigger
            value="hardware"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            Hardware
          </TabsTrigger>
          <TabsTrigger
            value="audio"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            Audio
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value={activeTab} className="mt-0">
        {children}
      </TabsContent>
    </Tabs>
  );
}
