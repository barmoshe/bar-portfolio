"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JSONPreviewProps {
  data: any;
  isLoading: boolean;
  inView: boolean;
}

export default function JSONPreview({
  data,
  isLoading,
  inView,
}: JSONPreviewProps) {
  return (
    <Card className="p-6 overflow-hidden">
      <h3 className="text-lg font-medium mb-4">API Response</h3>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="raw">Raw JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-[400px] bg-muted/50 rounded-md">
                <div className="animate-pulse text-muted-foreground">
                  Loading...
                </div>
              </div>
            ) : (
              <div className="h-[400px] overflow-auto p-4 bg-muted/50 rounded-md">
                <PreviewData data={data} />
              </div>
            )}
          </TabsContent>
          <TabsContent value="raw" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-[400px] bg-muted/50 rounded-md">
                <div className="animate-pulse text-muted-foreground">
                  Loading...
                </div>
              </div>
            ) : (
              <pre className="h-[400px] overflow-auto p-4 bg-muted/50 rounded-md font-mono text-sm">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </Card>
  );
}

function PreviewData({ data }: { data: any }) {
  if (!data) return <div>No data available</div>;

  return (
    <div className="space-y-6">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <h4 className="text-lg font-medium capitalize">{key}</h4>
          <div className="pl-4 border-l-2 border-primary/20">
            {renderValue(value)}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderValue(value: any): React.ReactNode {
  if (value === null)
    return <span className="text-muted-foreground">null</span>;

  if (Array.isArray(value)) {
    return (
      <ul className="space-y-2 list-disc list-inside">
        {value.map((item, index) => (
          <li key={index} className="ml-2">
            {typeof item === "object" ? renderValue(item) : String(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="space-y-2 pl-2">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="grid grid-cols-[120px_1fr] gap-2">
            <span className="font-medium">{k}:</span>
            <div>{renderValue(v)}</div>
          </div>
        ))}
      </div>
    );
  }

  return <span>{String(value)}</span>;
}
