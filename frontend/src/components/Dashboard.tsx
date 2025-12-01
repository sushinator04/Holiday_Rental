import { useTranslation } from "react-i18next";
import "./styles/Dashboard.css";
import { useBookings } from "../hooks/useBookings";

const Dashboard = () => {
  const { t } = useTranslation();
  const email = localStorage.getItem("login_email");

  if (!email) {
    return <div>{t("emailMissing")}</div>;
  }

  const { inactiveBookings, activeBookings } = useBookings(email);

  const getApartmentName = (apartment: "A" | "B" | "C") => {
    switch (apartment) {
      case "A":
        return t("untereWohnung", { defaultValue: "Lower Apartment" });
      case "B":
        return t("obereWohnung", { defaultValue: "Upper Apartment" });
      case "C":
        return t("beideWohnungen", { defaultValue: "Both Apartments" });
      default:
        return t("unknownApartment", { defaultValue: "Unknown" });
    }
  };

  const cancel = async (bookingId: number) => {
    if (window.confirm(t("confirmCancel"))) {
      console.log("Booking canceled:", bookingId);
    }
  };

  return (
    <div className="dashboard">
      <div className="prev-bookings">
        <h3>{t("bisherigeBuchungen")}</h3>
        {inactiveBookings?.length > 0 ? (
          <div className="list">
            {inactiveBookings.map((booking, index) => (
              <ul key={index} className="booking-log">
                <li>{booking.startDate}</li>
                <li>{booking.endDate}</li>
                <li>{getApartmentName(booking.apartment)}</li>
              </ul>
            ))}
          </div>
        ) : (
          <div className="booking-log">
            <span>{t("noBooking")}.</span>
          </div>
        )}
      </div>
      <div className="current-booking">
        <h3>{t("nächsteBuchung")}</h3>
        {activeBookings?.length > 0 ? (
          <div className="list">
            {activeBookings.map((booking, index) => (
              <ul key={index} className="booking-log">
                <li>{booking.startDate}</li>
                <li>{booking.endDate}</li>
                <li>{getApartmentName(booking.apartment)}</li>
              </ul>
            ))}
          </div>
        ) : (
          <div className="booking-log">
            <span>{t("noBooking")}.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
