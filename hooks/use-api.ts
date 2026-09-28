"use client";

import { useEffect, useState } from "react";

type APIResult<ResponseData> = {
  requestedUrl: string;
  data: ResponseData | null;
  error: string | null;
};

// Fetches JSON from one of our API routes. Use this for every API request.
export function useAPI<ResponseData>(url: string) {
  const [result, setResult] = useState<APIResult<ResponseData> | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    fetch(url, { signal: abortController.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}.`);
        }
        const data = (await response.json()) as ResponseData;
        setResult({ requestedUrl: url, data, error: null });
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) return;
        const message = error instanceof Error ? error.message : "Something went wrong.";
        setResult({ requestedUrl: url, data: null, error: message });
      });

    return () => abortController.abort();
  }, [url]);

  // A result for a previous url is stale, so treat it as still loading.
  const currentResult = result?.requestedUrl === url ? result : null;

  return {
    data: currentResult?.data ?? null,
    error: currentResult?.error ?? null,
    isLoading: currentResult === null,
  };
}
