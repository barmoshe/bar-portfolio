"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import BackendHeading from "@/components/backend/backend-heading";
import JSONEditor from "@/components/backend/json-editor";
import JSONPreview from "@/components/backend/json-preview";
import APIDocumentation from "@/components/backend/api-documentation";
import Confetti from "@/components/backend/confetti";
import { apiEndpoints } from "@/components/backend/api-endpoints";
import { ResponseStatus } from "@/components/backend/api-documentation";

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
      <div className="container-full">
        <BackendHeading title="Backend API Playground" inView={inView} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* JSON Editor Side */}
          <JSONEditor
            value={editedData}
            onChange={setEditedData}
            onRefresh={fetchData}
            onSave={saveData}
            isLoading={isLoading}
            isSaving={isSaving}
            inView={inView}
          />

          {/* JSON Preview Side */}
          <JSONPreview data={data} isLoading={isLoading} inView={inView} />
        </div>

        {/* API Documentation */}
        <div className="mt-8">
          <APIDocumentation
            endpoints={apiEndpoints}
            responseStatus={responseStatus}
            error={error}
            inView={inView}
          />
        </div>
      </div>
    </section>
  );
}
