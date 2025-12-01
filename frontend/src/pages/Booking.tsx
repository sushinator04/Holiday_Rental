import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css"; // Import default styles
import { addDays } from "date-fns";
import { useTranslation } from "react-i18next";
import { fetchOccupiedDates, sendMail } from "../store/database";
import DatePicker from "react-datepicker";
import { enUS, de, it, fr } from "date-fns/locale";
import { Locale } from "date-fns";
import { X } from "lucide-react";
import "./styles/Booking.css";
import { SERVER_API_URL } from "../config/config";

const MAXIMUM_BOOKING_DATE = addDays(new Date(), 365);

const localeMap: { [key: string]: Locale } = {
  en: enUS,
  de: de,
  fr: fr,
  it: it,
};

/* The style is in the Footer.css file */
const Booking = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useState(enUS);

  useEffect(() => {
    const login_email = localStorage.getItem("login_email");
    const login_name = localStorage.getItem("login_name");
    if (login_email && login_name) {
      setEmail(login_email);
      setName(login_name);
    } else {
      // window popup to ask to continue
      const timeout = setTimeout(() => {
        if (window.confirm(t("continueWithoutLogin"))) {
          localStorage.setItem("login_email", "");
          localStorage.setItem("login_name", "");
        } else {
          navigate("/login");
        }
      }, 5000);
      clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    document.title = t("buchung");
  }, [t]);

  useEffect(() => {
    const language = i18n.language.split("-")[0] ?? "de";
    setLocale(localeMap[language] || de);
  }, [i18n.language]);

  const [selectedApartment, setSelectedApartment] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);
  const [nextUnavailableDate, setNextUnavailableDate] = useState<Date | null>(
    null
  );
  const [reservation, setReservation] = useState<Reservation | null>(null);

  interface Reservation {
    name: string;
    email: string;
    selectedApartment: string;
    startDate: Date;
    endDate: Date;
  }

  const apartments: { [key: string]: string } = {
    A: "Untere Wohnung",
    B: "Obere Wohnung",
    C: "Beide Wohnungen",
  };

  useEffect(() => {
    if (selectedApartment) {
      fetchOccupiedDates(selectedApartment).then((dates) =>
        setOccupiedDates(dates)
      );
    }
  }, [selectedApartment]);

  const storeReservationAndReset = () => {
    setReservation({
      name,
      email,
      selectedApartment,
      startDate: startDate!,
      endDate: endDate!,
    });
    setSelectedApartment("");
    setStartDate(null);
    setEndDate(null);
    setName("");
    setEmail("");
  };

  const [displayConfirm, setDisplayConfirm] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!name.trim()) {
      alert(t("validation__required_name"));
      return;
    }
    if (!email.trim()) {
      alert(t("validation__required_email"));
      return;
    }
    if (!selectedApartment) {
      alert(t("validation__required_apartment"));
      return;
    }
    if (!startDate) {
      alert(t("validation__required_startDate"));
      return;
    }
    if (!endDate) {
      alert(t("validation__required_endDate"));
      return;
    }
    setDisplayConfirm(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("selectedApartment", selectedApartment);
    formData.append("startDate", startDate?.toISOString() || "");
    formData.append("endDate", endDate?.toISOString() || "");
    fetch(`${SERVER_API_URL}/booking`, {
      method: "POST",
      body: formData,
    });
    alert(t("confirmation__header"));
    storeReservationAndReset();
    // TODO: send confirmation email to user
    sendMail(
      email,
      t("confirmation__header"),
      t("confirmation__paragraph")
    ).then((success) => {
      if (success) {
        console.log("Confirmation email sent to:", email);
      } else {
        console.error("Failed to send confirmation email to:", email);
      }
    });
  };

  const confirmationWindow = () => {
    return (
      <div className="confirmationWindow">
        <header>
          <button
            className="backButton"
            onClick={() => setDisplayConfirm(false)}
          >
            <X />
          </button>
          <h1>{t("confirmation__header")}</h1>
          <p>{t("confirmation__paragraph")}</p>
        </header>
        <main style={{ justifyContent: "center", alignItems: "center" }}>
          <article>
            <h2>{t("details")}</h2>
            <ul>
              <li>
                {t("name")}: {reservation!.name}
              </li>
              <li>
                {t("email")}: {reservation!.email}
              </li>
              <li>
                {t("wohnung")}: {apartments[reservation!.selectedApartment]}
              </li>
              <li>
                {t("startDate")}: {reservation!.startDate.toDateString()}
              </li>
              <li>
                {t("endDate")}: {reservation!.endDate.toDateString()}
              </li>
            </ul>
          </article>
        </main>
      </div>
    );
  };
  return (
    <div className="booking_window">
      {displayConfirm ? (
        confirmationWindow()
      ) : (
        <div>
          <header>
            <h1>{t("booking__header")}</h1>
          </header>
          <main>
            <form
              onSubmit={handleBookingSubmit}
              lang={i18n.language.substring(0, 2)}
              noValidate
            >
              <div className="form_group">
                <label className="form_label">{t("name")}</label>
                <input
                  className="form_field"
                  type="text"
                  aria-label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form_group">
                <label className="form_label">{t("email")}</label>
                <input
                  className="form_field"
                  type="email"
                  aria-label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form_group">
                <label className="form_label">{t("wohnung")}</label>
                <select
                  className="form_select"
                  aria-label="Wählen Sie das Apartment"
                  value={selectedApartment}
                  onChange={(e) => setSelectedApartment(e.target.value)}
                  required
                >
                  <option value="">{t("wohnungsPrompt")}</option>
                  <option value="A" key="A" aria-label="untere Wohnung">
                    {t("untereWohnung")}
                  </option>
                  <option value="B" key="B" aria-label="obere Wohnung">
                    {t("obereWohnung")}
                  </option>
                  <option value="C" key="C">
                    {t("beideWohnungen")}
                  </option>
                </select>
              </div>
              {selectedApartment ? (
                <div className="date_picker-container">
                  <div className="form_group">
                    <label className="form_label">{t("startDate")}</label>
                    <DatePicker
                      className="form_field"
                      selected={startDate}
                      onChange={(date: Date | null) => {
                        setStartDate(date);
                        setEndDate(null);
                        if (date) {
                          setNextUnavailableDate(
                            occupiedDates
                              .filter((d) => d > date)
                              .reduce(
                                (a, b) => (a < b ? a : b),
                                MAXIMUM_BOOKING_DATE
                              )
                          );
                        } else {
                          setNextUnavailableDate(null);
                        }
                      }}
                      startDate={startDate}
                      endDate={endDate}
                      excludeDates={occupiedDates} // Exclude occupied dates
                      minDate={addDays(new Date(), 1)} // Tomorrow
                      required
                      locale={locale}
                    />
                  </div>

                  <div
                    className="form_group"
                    style={{ cursor: startDate ? "pointer" : "not-allowed" }}
                  >
                    <label
                      className="form_label"
                      style={{ cursor: startDate ? "pointer" : "not-allowed" }}
                    >
                      {t("endDate")}
                    </label>
                    <DatePicker
                      className="form_field"
                      selected={endDate}
                      onChange={(date: Date | null) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      maxDate={nextUnavailableDate || undefined}
                      minDate={startDate}
                      disabled={!startDate}
                      required
                      locale={locale}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ height: "100px" }}>
                  <p>{t("keineWohnungAusgewaehlt")}</p>
                </div>
              )}

              <button type="submit" style={{ textAlign: "center" }}>
                <span>{t("buchungsSubmit")}</span>
              </button>
            </form>
          </main>
        </div>
      )}
    </div>
  );
};

export default Booking;
