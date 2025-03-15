"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
  BackendHeading,
  JSONEditor,
  JSONPreview,
  APIDocumentation,
  Confetti,
  apiEndpoints,
  ResponseStatus,
} from "@/components/backend";

export default function Backend() {
  const [data, setData] = useState<any>(null);
  const [editedData, setEditedData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<ResponseStatus | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/data");

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setEditedData(JSON.stringify(result, null, 2));
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data from API. Give it another try!");
    } finally {
      setIsLoading(false);
    }
  }

  async function saveData() {
    setIsSaving(true);
    setError(null);

    try {
      // Validate JSON before sending
      const parsedData = JSON.parse(editedData);

      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const result = await response.json();

      // Update the displayed data with the response
      setData(result.data);

      // Show playful success message and burst of confetti!
      setResponseStatus({
        success: true,
        message: "Data saved successfully! Boom, magic!",
        time: new Date().toLocaleTimeString(),
      });
      setShowConfetti(true);
      setTimeout(() => {
        setResponseStatus(null);
        setShowConfetti(false);
      }, 3000);
    } catch (err: any) {
      console.error("Failed to save data:", err);
      setError(
        err instanceof SyntaxError
          ? "Whoops! Your JSON seems a bit off. Check your syntax and try again, champ!"
          : "Oh no, something went wrong while saving! Please try again, rockstar!"
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section
      id="backend"
      ref={ref}
      className="py-20 w-full bg-muted/30 relative"
    >
      {showConfetti && <Confetti />}
      <div className="container px-4 md:px-6">
        <BackendHeading title="Backend API Playground" inView={inView} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <JSONEditor
            data={data}
            isLoading={isLoading}
            isSaving={isSaving}
            error={error}
            responseStatus={responseStatus}
            onRefresh={fetchData}
            onSave={saveData}
            editedData={editedData}
            onEditedDataChange={setEditedData}
            inView={inView}
          />

          <JSONPreview data={data} isLoading={isLoading} inView={inView} />
        </div>

        <APIDocumentation endpoints={apiEndpoints} inView={inView} />
      </div>
    </section>
  );
}
