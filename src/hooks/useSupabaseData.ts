import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type Station = Database["public"]["Tables"]["stations"]["Row"];
type SensorReading = Database["public"]["Tables"]["sensor_readings"]["Row"];
type Prediction = Database["public"]["Tables"]["predictions"]["Row"];
type Complaint = Database["public"]["Tables"]["complaints"]["Row"];

// Re-export for convenience
export type { Station, SensorReading, Prediction, Complaint };

export function useStations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("stations")
      .select("*")
      .order("name")
      .then(({ data }) => {
        setStations(data ?? []);
        setLoading(false);
      });
  }, []);

  return { stations, loading };
}

export function useLatestReadings(stationIds: string[]) {
  const [readings, setReadings] = useState<Record<string, SensorReading>>({});
  const [loading, setLoading] = useState(true);
  const key = stationIds.join(",");

  useEffect(() => {
    if (stationIds.length === 0) return;

    Promise.all(
      stationIds.map((sid) =>
        supabase
          .from("sensor_readings")
          .select("*")
          .eq("station_id", sid)
          .order("recorded_at", { ascending: false })
          .limit(1)
          .single()
      )
    ).then((results) => {
      const map: Record<string, SensorReading> = {};
      for (const { data } of results) {
        if (data) map[(data as SensorReading).station_id] = data as SensorReading;
      }
      setReadings(map);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { readings, loading };
}

export function useLatestPredictions(stationIds: string[]) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const key = stationIds.join(",");

  useEffect(() => {
    if (stationIds.length === 0) return;

    Promise.all(
      stationIds.map((sid) =>
        supabase
          .from("predictions")
          .select("*")
          .eq("station_id", sid)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()
      )
    ).then((results) => {
      setPredictions(
        results
          .map((r) => r.data as Prediction | null)
          .filter((d): d is Prediction => d !== null)
      );
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { predictions, loading };
}

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!cancelled) {
          setComplaints(data ?? []);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const refresh = useCallback(() => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  }, []);

  return { complaints, loading, refresh };
}

export async function submitComplaint(fields: {
  category: string;
  description: string;
  location: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("complaints").insert({
    user_id: user.id,
    category: fields.category,
    description: fields.description,
    location: fields.location,
  });

  if (error) throw error;
}

export function useComplaintCount(userId?: string) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let query = supabase.from("complaints").select("id", { count: "exact", head: true });
    if (userId) {
      query = query.eq("user_id", userId);
    }
    query.then(({ count: c }) => {
      setCount(c ?? 0);
    });
  }, [userId]);

  return count;
}
