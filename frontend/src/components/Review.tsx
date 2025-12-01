import "./styles/Review.css";
import { useTranslation } from "react-i18next";
import { Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { submitReview, Rating } from "../store/database";
import { useReviews } from "../hooks/useReviews";
interface ReviewProps {
  email: string;
  guestMode?: boolean;
  onGuestReview?: (reviewContent: string) => void;
}

const Review = ({ email, guestMode = false }: ReviewProps) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<Rating | 0>(0);
  const [review, setReview] = useState<string>("");
  const [state, setState] = useState<"close" | "edit">("edit");
  const [selectedApartment, setSelectedApartment] = useState<
    "A" | "B" | "C" | "all"
  >("all");

  useEffect(() => {
    const rated = localStorage.getItem("guestRated");
    if (rated) {
      setRating(parseInt(rated) as Rating);
    }
    const review = localStorage.getItem("guestReview");
    if (review) {
      setReview(review);
    }
    const apartment = localStorage.getItem("guestApartment");
    if (apartment) {
      setSelectedApartment(apartment as "A" | "B" | "C" | "all");
    }
    localStorage.removeItem("guestRated");
    localStorage.removeItem("guestReview");
    localStorage.removeItem("guestApartment");
  }, []);

  const { reviews, totalRating, rated } = useReviews(email, selectedApartment);

  useEffect(() => {
    setState(rated === null ? "edit" : "close");
  }, [rated]);

  const handleRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert(t("selectRating"));
      return;
    }
    if (selectedApartment === "all") {
      window.alert(t("selectApartment"));
      return;
    }

    if (guestMode) {
      // Guest submission
      localStorage.setItem("guestRated", rating.toString());
      localStorage.setItem("guestReview", review);
      localStorage.setItem("guestApartment", selectedApartment);
      alert(t("loginForReview"));
      window.location.href = "/login";
    } else {
      // Normal submission for logged-in users
      submitReview(email, review, rating, selectedApartment);
    }
    setState("close");
  };

  const handleOverwriteReview = () => {
    localStorage.removeItem("rated");
    setState("edit");
  };

  const getApartmentName = () => {
    switch (selectedApartment) {
      case "A":
        return t("untereWohnung");
      case "B":
        return t("obereWohnung");
      case "C":
        return t("beideWohnungen");
      default:
        return t("wähleEineWohnung");
    }
  };

  const NavigationBar = () => {
    return (
      <div className="review-navigation">
        <button
          className={
            "rev-nav-btn" + (selectedApartment === "A" ? " active" : "")
          }
          onClick={() => setSelectedApartment("A")}
        >
          <span>{t("untereWohnung")}</span>
        </button>
        <button
          className={
            "rev-nav-btn" + (selectedApartment === "B" ? " active" : "")
          }
          onClick={() => setSelectedApartment("B")}
        >
          <span>{t("obereWohnung")}</span>
        </button>
        <button
          className={
            "rev-nav-btn" + (selectedApartment === "C" ? " active" : "")
          }
          onClick={() => setSelectedApartment("C")}
        >
          <span>{t("beideWohnungen")}</span>
        </button>
        <button
          className={
            "rev-nav-btn" + (selectedApartment === "all" ? " active" : "")
          }
          onClick={() => setSelectedApartment("all")}
        >
          <span>{t("alleBewertungen")}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="review">
      <NavigationBar />
      <div className="reviews">
        {reviews.length > 0 ? (
          reviews.map((r, index) => (
            <div key={index} className="box">
              <p>{r.review}</p>
              <div className="rating">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star, idx) => (
                    <Star
                      key={idx}
                      className="rating-icon"
                      size={14}
                      color={r.rating >= star ? "yellow" : "white"}
                    />
                  ))}
                </div>
                <i>{`by ${r.name} `}</i>
              </div>
            </div>
          ))
        ) : (
          <span>{t("noReviews")}</span>
        )}
      </div>
      {state === "edit" || selectedApartment === "all" ? (
        <form className="review-form" onSubmit={handleRating}>
          {rated !== null && selectedApartment !== "all" && (
            <button
              className="close-btn"
              onClick={() => setState("close")}
              type="button"
            >
              <X className="icon" color="white" size={16} />
            </button>
          )}
          <select
            required
            onChange={(e) =>
              setSelectedApartment(e.target.value as "A" | "B" | "C")
            }
            value={selectedApartment}
          >
            <option value="all">{getApartmentName()}</option>
            <option value="A">{t("untereWohnung")}</option>
            <option value="B">{t("obereWohnung")}</option>
            <option value="C">{t("beideWohnungen")}</option>
          </select>
          <textarea
            id="review"
            placeholder={t("review")}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            minLength={5}
            maxLength={120}
            required
          />
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star, index) => (
              <Star
                key={index}
                className="rating-icon"
                size={24}
                color={rating >= star ? "yellow" : "white"}
                onClick={() => setRating(star as Rating)}
              />
            ))}
          </div>
          <button type="submit">{t("submit")}</button>
        </form>
      ) : (
        <div className="your-rating">
          <span>{t("youRatedUs")}:</span>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star, index) => (
              <Star
                key={index}
                className="rating-icon"
                size={20}
                color={rated! >= star ? "yellow" : "white"}
              />
            ))}
          </div>
          <button className="edit-btn" onClick={handleOverwriteReview}>
            {t("edit")}
          </button>
        </div>
      )}
    </div>
  );
};

export default Review;
