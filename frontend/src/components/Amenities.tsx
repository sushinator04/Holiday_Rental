import "./styles/Amenities.css";
import {
  Wifi,
  Bath,
  CookingPot,
  SquareParking,
  WashingMachine,
  Airplay,
  Dog,
  ThermometerSun,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Amenities = () => {
  const { t } = useTranslation();
  return (
    <div className="amenities">
      <div className="gallery">
        <img src="/assets/-1/keller2.jpg" alt="a3" />
        <img src="/assets/-1/keller3.jpg" alt="a4" />
        <img src="/assets/-1/keller0.jpg" alt="" />
        <img src="/assets/-1/keller1.jpg" alt="a1" />
      </div>
      <div className="description">
        <h2 className="amenity-list">{t("annehmlichkeiten")}</h2>
        <ul>
          <li>
            <Wifi className="icon" color="white" />
            <span>{t("freeWifi")}</span>
          </li>
          <li>
            <CookingPot className="icon" color="white" />
            <span>{t("kuechenausstattung")}</span>
          </li>
          <li>
            <WashingMachine className="icon" color="white" />
            <span>{t("waschmaschine")}</span>
          </li>
          <li>
            <Bath className="icon" color="white" />
            <span>{t("badAusstattung")}</span>
          </li>
          <li>
            <ThermometerSun className="icon" color="white" />
            <span>{t("sauna")}</span>
          </li>
          <li>
            <Airplay className="icon" color="white" />
            <span>{t("fernseher")}</span>
          </li>
          <li>
            <Dog className="icon" color="white" />
            <span>{t("tierfreundlich")}</span>
          </li>
          <li>
            <SquareParking className="icon" color="white" />
            <span>{t("garage")}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Amenities;
