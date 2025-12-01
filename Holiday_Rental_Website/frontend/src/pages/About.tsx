import "./styles/About.css";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { t } = useTranslation();
  useEffect(() => {
    document.title = "Sent";
  }, []);
  return (
    <div className="about">
      <main>
        <div
          className="container-1"
          style={{ paddingTop: "var(--nav-height)" }}
        >
          <div className="text-container">
            <h2>Motta Naluns</h2>
            <p className="pc-desc">{t("mottaNaluns__paragraph_long")}</p>
            <p className="mob-desc">{t("mottaNaluns__paragraph_short")}</p>
          </div>

          <div className="link-container">
            <a
              className="link-container"
              href="https://www.bergbahnen-scuol.ch/de"
              target="_blank"
            >
              <img src="/assets/about/about0.jpg" alt="Motta Naluns"></img>{" "}
            </a>
          </div>
        </div>

        <div className="container-2">
          <div className="text-container">
            <h2>Hatecke</h2>
            <p className="pc-desc">{t("hatecke__paragraph_long")}</p>
            <p className="mob-desc">{t("hatecke__paragraph_short")}</p>
          </div>

          <div className="link-container">
            <a href="https://www.hatecke.ch" target="_blank">
              <img src="/assets/about/about1.jpg" alt="Hatecke"></img>
            </a>
          </div>
        </div>

        <div className="container-1">
          <div className="text-container">
            <h2>{t("eisweg")}</h2>
            <p className="pc-desc">{t("eisweg__paragraph_long")}</p>
            <p className="mob-desc">{t("eisweg__paragraph_short")}</p>
          </div>

          <div className="link-container">
            <a href="https://www.suren.ch/eisweg-engadin/" target="_blank">
              <img src="/assets/about/about3.jpg" alt="Eisweg"></img>
            </a>
          </div>
        </div>

        <div className="container-2">
          <div className="text-container">
            <h2>Bogn Engiadina Scuol</h2>
            <p className="pc-desc">{t("bognEngiadina__paragraph_long")}</p>
            <p className="mob-desc">{t("bognEngiadina__paragraph_short")}</p>
          </div>

          <div className="link-container">
            <a
              href="https://www.engadin.com/de/wellness-gesundheit/wellness/mineralbad-bogn-engiadina-scuol"
              target="_blank"
            >
              <img src="/assets/about/about2.jpg" alt="Bogn Engdiadina"></img>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
