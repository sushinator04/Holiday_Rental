import { useState, useEffect } from "react";

import SlideShow from "../components/SlideShow";
import { images_lower } from "../images";
import Amenities from "../components/Amenities";
import Pricing from "../components/Pricing";

import "./styles/wohnung.css";
import { useTranslation } from "react-i18next";

const Erdgechoss = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { t } = useTranslation();
  const [displayErdgeschoss, setDisplayErdgeschoss] = useState(true);

  useEffect(() => {
    document.title = t("untereWohnung");
  }, [t]);

  const pdfDocument1: string = "/assets/floor/Erdgeschoss.pdf";
  const pdfDocumentPath2: string = "/assets/floor/Dachgeschoss.pdf";
  return (
    <main>
      <SlideShow images={images_lower} />
      <div className="floorplan">
        <div className="description">
          <h2>{t("grundriss")}</h2>
          <p>{t("grundrissBeschreibungUnten")}</p>
        </div>
        <div className="holder">
          <div className="bar">
            <button
              onClick={() => setDisplayErdgeschoss(true)}
              className={`fbt fbtl ${displayErdgeschoss ? "fbt-active" : ""}`}
            >
              {t("erdgeschoss")}
            </button>
            <button
              onClick={() => setDisplayErdgeschoss(false)}
              className={`fbt fbtr ${displayErdgeschoss ? "" : "fbt-active"}`}
            >
              {t("dachgeschoss")}
            </button>
          </div>
          <iframe
            title="Dachgeschoss"
            src={displayErdgeschoss ? pdfDocument1 : pdfDocumentPath2}
            className="frame"
          >
            {displayErdgeschoss ? t("erdgeschoss") : t("dachgeschoss")}
          </iframe>
        </div>
      </div>
      <Pricing apartment="A" />
      <Amenities />
    </main>
  );
};

export default Erdgechoss;
