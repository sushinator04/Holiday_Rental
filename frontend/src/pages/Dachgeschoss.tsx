import SlideShow from "../components/SlideShow";
import { images_upper } from "../images";
import Amenities from "../components/Amenities";
import Pricing from "../components/Pricing";

import "./styles/wohnung.css";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Dachgeschoss = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t("obereWohnung");
  }, [t]);
  return (
    <main>
      <SlideShow images={images_upper} />
      <div className="floorplan">
        <div className="description">
          <h2>{t("grundriss")}</h2>
          <p>{t("grundrissBeschreibungOben")}</p>
        </div>
        <div className="holder">
          <iframe
            key="Dachgechoss"
            src="/assets/floor/Dachgeschoss.pdf"
            className="frame"
          >
            {t("dachgeschoss")}
          </iframe>
        </div>
      </div>
      <Pricing apartment="B" />
      <Amenities />
    </main>
  );
};

export default Dachgeschoss;
