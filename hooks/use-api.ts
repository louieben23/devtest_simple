"use client";

import { useCallback, useEffect, useState } from "react";

type APIResult<ResponseData> = {
  requestedUrl: string;
  data: ResponseData | null;
  error: string | null;
};

type ChangeMethod = "POST" | "PATCH" | "DELETE";

// Fetches JSON from one of our API routes. Use this for every API request.
export function useAPI<ResponseData>(url: string) {
  const [result, setResult] = useState<APIResult<ResponseData> | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

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
  }, [url, reloadCount]);

  // Loads the data again. The current data stays on screen until the new data arrives.
  const refetch = useCallback(() => setReloadCount((count) => count + 1), []);

  // Sends a change to the same url, then reloads the data.
  // Throws with the API's error message if the request fails.
  const sendRequest = useCallback(
    async (method: ChangeMethod, requestBody?: unknown) => {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error ?? `Request failed with status ${response.status}.`);
      }

      refetch();
    },
    [url, refetch],
  );

  // A result for a previous url is stale, so treat it as still loading.
  const currentResult = result?.requestedUrl === url ? result : null;

  return {
    data: currentResult?.data ?? null,
    error: currentResult?.error ?? null,
    isLoading: currentResult === null,
    refetch,
    sendRequest,
  };
}
