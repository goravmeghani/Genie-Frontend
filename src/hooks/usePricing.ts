import { useCallback, useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";

export interface PricingData {
  name: string;
  monthly_price_label?: string | null;
  description?: string | null;
}

interface UsePricingResult {
  pricing: PricingData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function usePricing(): UsePricingResult {
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPricing = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/pricing`);
      if (!response.ok) {
        throw new Error(`Failed to load pricing (${response.status})`);
      }
      const data = await response.json();
      setPricing(data ?? null);
    } catch (err) {
      console.error("Pricing fetch failed", err);
      setError(
        err instanceof Error ? err.message : "Unable to load pricing right now."
      );
      setPricing(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  return { pricing, loading, error, refresh: fetchPricing };
}

