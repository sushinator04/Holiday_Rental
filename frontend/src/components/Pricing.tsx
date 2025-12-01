import { useState, useEffect } from "react";
import { fetchOccupiedDates } from "../store/database";
import { DayPicker, DateRange, Locale } from "react-day-picker";
import "react-day-picker/style.css";
import { enGB, de, fr, it } from "date-fns/locale";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { isAfter, isBefore, isSameDay, min, set } from "date-fns";

import "./styles/Pricing.css";

const locale: { [key: string]: Locale } = {
  en: enGB,
  de: de,
  fr: fr,
  it: it,
};

const dailyPrices = {
  A: 250,
  B: 150,
  C: 350,
};

const Pricing = ({ apartment }: { apartment: "A" | "B" | "C" }) => {
  const { t } = useTranslation();
  const [pricePerDay, setPricePerDay] = useState<number>(
    dailyPrices[apartment]
  );
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);
  const [selected, setSelected] = useState<DateRange | undefined>(undefined);
  const [numDays, setNumDays] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    fetchOccupiedDates(apartment).then((dates) =>
      setOccupiedDates(dates.sort())
    );
    setPricePerDay(dailyPrices[apartment]);
  }, [apartment]);

  const getApartmentName = (): string => {
    if (apartment === "A") {
      return t("untereWohnung");
    } else if (apartment === "B") {
      return t("obereWohnung");
    }
    return t("beideWohnungen");
  };

  useEffect(() => {
    if (selected !== undefined) {
      const start = selected.from!;
      const end = selected.to!;
      const numDays = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalPrice = calculatePrice();
      const discount = calculateDiscount();
      setNumDays(numDays);
      setTotalPrice(totalPrice);
      setDiscount(discount);
    }
  }, [selected, numDays, apartment]);

  const calculateDiscount = (): number => {
    if (numDays < 7) {
      return 0;
    }
    return Math.ceil(0.1 * numDays * pricePerDay);
  };

  const calculatePrice = (): number => {
    if (numDays < 1) {
      return 0;
    }
    return numDays * pricePerDay - calculateDiscount();
  };

  const isDisabled = (date: Date): boolean => {
    date = set(date, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    return (
      isBefore(date, new Date()) ||
      occupiedDates.some((d) => isSameDay(d, date))
    );
  };

  const handleSelect = (range: DateRange | undefined, selectedDate: Date) => {
    if (range === undefined) {
      setSelected(undefined);
      return;
    }
    const start = range.from!;
    let end = range.to!;
    if (
      occupiedDates.some((date) => isAfter(date, start) && isBefore(date, end))
    ) {
      end = new Date(
        min(
          occupiedDates.filter((date: Date) => isAfter(date, start))
        ).getTime() - 86400
      );
    }
    setSelected({ from: start, to: end });
  };

  return (
    <div className="pricing">
      <div className="pricing-container lhs">
        <DayPicker
          className="daypicker"
          mode="range"
          selected={selected}
          onSelect={handleSelect}
          disabled={isDisabled}
          locale={
            locale[
              (i18n.language?.split("-")[0] as keyof typeof locale) || "de"
            ] || de
          }
        />
      </div>
      <div className="rhs pricing-container">
        <div className="price">
          <div className="price-header">
            <h2 style={{ background: "transparent" }}>
              {t("preisBerechnung")}
            </h2>
          </div>
          <div className="price-content">
            <h3>{getApartmentName()}</h3>
            <div className="price-details">
              <p className="price-lhs">{t("preisProTag")}:</p>
              <p className="price-rhs">{pricePerDay} CHF</p>
              <p className="price-lhs">{t("discount")}: </p>
              <p className="price-rhs">{discount} CHF</p>
              <p className="price-lhs">{t("anzahlTage")}:</p>{" "}
              <p className="price-rhs">{numDays}</p>
              <div className="price-total">
                <h4 className="price-lhs">{t("berechneterPreis")}: </h4>
                <h4 className="price-rhs">{totalPrice} CHF</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
