import { useState, useEffect } from "react";
import {
  fetchRatings,
  fetchCurrentRating,
  ReviewProps,
  Rating,
} from "../store/database";

export const useReviews = (
  email: string,
  selectedApartment: "A" | "B" | "C" | "all",
  interval: number = 10_000
) => {
  const [reviews, setReviews] = useState<ReviewProps[]>([]);
  const [totalRating, setTotalRating] = useState<Rating | 0>(0);
  const [rated, setRated] = useState<Rating | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateAverageRating = () => {
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    const divisor = Math.max(
      reviews.filter((e) => e.rating !== undefined).length,
      1
    );
    return Math.round(total / divisor) as Rating;
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setError(null);
        const data = await fetchRatings({ selectedApartment });
        console.log("Fetching reviews:", selectedApartment, data);
        setTotalRating(calculateAverageRating());
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setError("Failed to fetch reviews");
      }
    };
    fetchReviews(); // Initial fetch
    const safeInterval = Math.min(5_000, Math.max(interval, 60_000)); // between 5s and 60s
    const intervalId = setInterval(fetchReviews, safeInterval);
    return () => clearInterval(intervalId);
  }, [interval, selectedApartment]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        setError(null);
        const data = await fetchCurrentRating(
          email,
          selectedApartment as "A" | "B" | "C"
        );
        console.log("Fetching rating:", data);
        setRated(data?.rating || null);
        console.log("Rated:", data?.rating);
      } catch (err) {
        console.error("Failed to fetch rating:", err);
        setError("Failed to fetch rating");
      }
    };
    if (email && selectedApartment !== "all") {
      fetchRating();
    }
    const safeInterval = Math.min(5_000, Math.max(interval, 60_000));
    const intervalId = setInterval(fetchRating, safeInterval);
    return () => clearInterval(intervalId);
  }, [email, interval, selectedApartment]);

  return { reviews, totalRating, rated, error };
};
