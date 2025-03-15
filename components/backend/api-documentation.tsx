"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: string[];
  responses: {
    status: number;
    description: string;
  }[];
}

interface APIDocumentationProps {
  endpoints: APIEndpoint[];
  responseStatus: ResponseStatus | null;
  error: string | null;
  inView: boolean;
}

export interface ResponseStatus {
  success: boolean;
  message: string;
  time?: string;
}

export default function APIDocumentation({
  endpoints,
  responseStatus,
  error,
  inView,
}: APIDocumentationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6"
    >
      {/* Status Messages */}
      {(responseStatus || error) && (
        <div className="mb-6">
          {responseStatus && (
            <Alert
              variant={responseStatus.success ? "default" : "destructive"}
              className="mb-4"
            >
              {responseStatus.success ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {responseStatus.success ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                <span>{responseStatus.message}</span>
                {responseStatus.time && (
                  <span className="text-xs opacity-70">
                    {responseStatus.time}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* API Documentation */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">API Documentation</h3>

          <div className="space-y-6">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded ${
                      endpoint.method === "GET"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {endpoint.path}
                  </code>
                </div>

                <p className="text-muted-foreground">{endpoint.description}</p>

                {endpoint.parameters && endpoint.parameters.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Parameters:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {endpoint.parameters.map((param, i) => (
                        <li key={i}>{param}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Responses:</h4>
                  <ul className="list-none space-y-1 text-sm">
                    {endpoint.responses.map((response, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-bold rounded ${
                            response.status < 300
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : response.status < 400
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {response.status}
                        </span>
                        <span className="text-muted-foreground">
                          {response.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {index < endpoints.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
