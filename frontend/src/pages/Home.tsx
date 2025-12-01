import { Link } from "react-router-dom";

import HomeSlideShow from "../components/HomeSlideShow";
import TitleShow from "../components/TitleShow";
import { images_lower, images_upper, images_home } from "../images";

import "./styles/Home.css";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import {
  BedDouble,
  BedSingle,
  Baby,
  ShowerHead,
  Bath,
  Toilet,
  CookingPot,
  UtensilsCrossed,
} from "lucide-react";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { t } = useTranslation();
  useEffect(() => {
    document.title = t("home");
  }, [t]);
  return (
    <main>
      <div className="home">
        <TitleShow images={images_home} />
        <div className="home-title">
          <h1>{t("home__titel")}</h1>
          <p>{t("home__untertitel")}</p>
        </div>
      </div>

      <div className="map-container">
        <div className="description">
          <h2>{t("home__addresse")}</h2>
          <p>{t("home__standordbeschreibung")}</p>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2565.2592547117274!2d10.337605871529009!3d46.81641220281129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4783381a432c1ca9%3A0x2d615e1cfba231e7!2sChasellas%2062%2C%207554%20Sent!5e0!3m2!1sde!2sch!4v1726068780398!5m2!1sde!2sch"
          className="image"
          title="address"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="selection">
        <Link to="/lowerapartment" className="boxed-link">
          <HomeSlideShow images={images_lower} />
          <div className="interior-details">
            <h2>{t("untereWohnung")}</h2>
            <ul>
              <li>
                <BedSingle className="home-icon" size={20} color="white" /> x 1{" "}
                {t("singleBed")}
              </li>
              <li>
                <BedDouble className="home-icon" size={20} color="white" /> x 1{" "}
                {t("doubleBed")}
              </li>
              <li>
                <Baby className="home-icon" size={20} color="white" /> x 2{" "}
                {t("childrenBed")}
              </li>
              <li>
                <ShowerHead className="home-icon" size={20} color="white" /> x 1{" "}
                {t("shower")}
              </li>
              <li>
                <Bath className="home-icon" size={20} color="white" /> x 1{" "}
                {t("bathtub")}
              </li>
              <li>
                <Toilet className="home-icon" size={20} color="white" /> x 2{" "}
                {t("toilet")}
              </li>
              <li>
                <CookingPot className="home-icon" size={20} color="white" /> x 1{" "}
                {t("kitchen")}
              </li>
              <li>
                <UtensilsCrossed
                  className="home-icon"
                  size={20}
                  color="white"
                />{" "}
                x 1 {t("diningTable")}
              </li>
              <li>
                <svg
                  viewBox="-0.5 -0.5 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  id="Balcony--Streamline-Iconoir"
                  height={20}
                  width={20}
                  className="home-icon"
                >
                  <desc>
                    {"Balcony Streamline Icon: https://streamlinehq.com"}
                  </desc>
                  <path
                    d="M2.03025 8.18375v5.4697499999999994"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                  <path
                    d="M4.765125 8.18375v5.4697499999999994"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                  <path
                    d="M10.234875 8.18375v5.4697499999999994"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                  <path
                    d="M7.5 8.18375v5.4697499999999994"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                  <path
                    d="M12.96975 8.18375v5.4697499999999994"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                  <path
                    d="M0.6628125 13.653500000000001h13.674375000000001"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                  <path
                    d="M0.6628125 8.18375h13.674375000000001"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                  <path
                    d="M11.6023125 6.1325625V1.75675c0 -0.2265625 -0.183625 -0.41025 -0.41025 -0.41025H3.807875c-0.2265625 0 -0.4101875 0.1836875 -0.4101875 0.41025v4.375812499999999"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                </svg>
                x 1 {t("balcony")}
              </li>
            </ul>
          </div>
        </Link>
        <Link to="/upperapartment" className="boxed-link">
          <HomeSlideShow images={images_upper} />
          <div className="interior-details">
            <h2>{t("obereWohnung")}</h2>
            <ul>
              <li>
                <BedSingle className="home-icon" size={20} color="white" /> x 1{" "}
                {t("singleBed")}
              </li>
              <li>
                <BedDouble className="home-icon" size={20} color="white" /> x 1{" "}
                {t("doubleBed")}
              </li>
              <li>
                <ShowerHead className="home-icon" size={20} color="white" /> x 1{" "}
                {t("shower")}
              </li>
              <li>
                <Toilet className="home-icon" size={16} color="white" /> x 1{" "}
                {t("toilet")}
              </li>
              <li>
                <UtensilsCrossed
                  className="home-icon"
                  size={20}
                  color="white"
                />{" "}
                x 1 {t("diningTable")}
              </li>
              <li>
                <CookingPot className="home-icon" size={20} color="white" /> x 1{" "}
                {t("kitchen")}
              </li>
              <li>
                <svg
                  viewBox="-0.5 -0.5 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  id="Balcony--Streamline-Iconoir"
                  height={20}
                  width={20}
                  className="home-icon"
                >
                  <desc>
                    {"Balcony Streamline Icon: https://streamlinehq.com"}
                  </desc>
                  <path
                    d="M2.03025 8.18375v5.4697499999999994"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                  <path
                    d="M4.765125 8.18375v5.4697499999999994"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                  <path
                    d="M10.234875 8.18375v5.4697499999999994"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                  <path
                    d="M7.5 8.18375v5.4697499999999994"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                  <path
                    d="M12.96975 8.18375v5.4697499999999994"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                  <path
                    d="M0.6628125 13.653500000000001h13.674375000000001"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                  <path
                    d="M0.6628125 8.18375h13.674375000000001"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                  <path
                    d="M11.6023125 6.1325625V1.75675c0 -0.2265625 -0.183625 -0.41025 -0.41025 -0.41025H3.807875c-0.2265625 0 -0.4101875 0.1836875 -0.4101875 0.41025v4.375812499999999"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                </svg>{" "}
                x 1 {t("balcony")}
              </li>
            </ul>
          </div>
        </Link>
      </div>
    </main>
  );
};

export default Home;
