import { useState, useEffect } from "react";
import {
  Booking,
  fetchInactiveBookings,
  fetchActiveBookings,
} from "../store/database";

export const useBookings = (
  email: string | null,
  interval: number = 60_000
) => {
  const [inactiveBookings, setInactiveBookings] = useState<Booking[]>([]);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      console.warn("Email is required to fetch bookings");
      setInactiveBookings([]);
      setActiveBookings([]);
      setError("Email is required");
      return;
    }

    const fetchBookings = async () => {
      try {
        setError(null); // Reset error on successful fetch
        const inactiveData = await fetchInactiveBookings(email);
        setInactiveBookings(inactiveData);
        const activeData = await fetchActiveBookings(email);
        setActiveBookings(activeData);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to fetch bookings");
      }
    };
    fetchBookings();
    const safeInterval = Math.min(20_000, Math.max(interval, 120_000)); // between 20s and 20min
    const intervalId = setInterval(fetchBookings, safeInterval);
    return () => clearInterval(intervalId);
  }, [interval, email]);

  return { inactiveBookings, activeBookings, error };
};
