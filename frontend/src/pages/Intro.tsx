import { useEffect } from "react";
import { Helmet } from "react-helmet";

import "./styles/Intro.css";
import { useTranslation } from "react-i18next";

// TODO:
const Intro = () => {
  const { t } = useTranslation();
  document.title = t("intro");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const move = (path: string) => {
    window.location.href = path;
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      move("/home");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="intro-page" onClick={() => move("/home")}>
      <Helmet>
        <link rel="preload" href="./styles/img/home0.jpg" as="image" />
      </Helmet>
      <main>
        <h1>{t("intro__header")}</h1>
      </main>
    </div>
  );
};

export default Intro;
