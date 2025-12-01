import { useState } from "react";
import "./styles/NavigationBar.css";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import i18n from "i18next";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { Home, LogOut, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const languages = [
  { code: "de", name: "Deutsch", flag: "fi fi-de" },
  { code: "en", name: "English", flag: "fi fi-gb" },
  { code: "fr", name: "Français", flag: "fi fi-fr" },
  { code: "it", name: "Italiano", flag: "fi fi-it" },
];

const NavigationBar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [displayLanguage, setDisplayLanguage] = useState(false);

  const { isLogged } = useAuth();
  const navigate = useNavigate();

  function toggle() {
    setOpen(!open);
  }

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    const timeout = setTimeout(() => {
      setDisplayLanguage(false);
      clearTimeout(timeout);
    }, 1000);
  };

  const Language = () => {
    const options = languages.map((language) => ({
      value: language.code,
      label: (
        <div style={{ background: "transparent", color: "black" }}>
          <span className={language.flag} style={{ marginRight: "8px" }}></span>
          {language.name}
        </div>
      ),
    }));

    return (
      <Select
        options={options}
        defaultValue={options.find((option) => option.value === i18n.language)}
        onChange={(e) => changeLanguage(e ? e.value : i18n.language)}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    );
  };

  const logout = () => {
    localStorage.removeItem("login_email");
    localStorage.removeItem("login_password");
    window.alert(t("loggedOut"));
    navigate("/");
  };

  return (
    <nav className="topnav">
      <button
        className="language-btn-mob"
        onClick={() => {
          setOpen(false);
          setDisplayLanguage(true);
        }}
      >
        <span
          className={
            languages.find(
              (lang) => lang.code === i18n.language.substring(0, 2)
            )!.flag
          }
          style={{ backgroundColor: "transparent" }}
        ></span>
        <span className="lang-span">
          {i18n.language.substring(0, 2).toLocaleUpperCase()}
        </span>
      </button>

      <button
        className="language-btn-pc"
        onClick={() => {
          setOpen(false);
          setDisplayLanguage(true);
        }}
      >
        <span
          className={
            languages.find(
              (lang) => lang.code === i18n.language.substring(0, 2)
            )!.flag
          }
          style={{ backgroundColor: "transparent" }}
        ></span>
        <span className="lang-span">
          {i18n.language.substring(0, 2).toLocaleUpperCase()}
        </span>
      </button>

      <Link to="/home" className="link smd">
        <Home size={16} color="white" className="homeicon" />
      </Link>

      {/* Show logout if user is logged in, otherwise show login */}
      {isLogged ? (
        <button className="navbtn" aria-label="logout" onClick={logout}>
          <LogOut size={16} color="white" className="navicon" />
        </button>
      ) : (
        <Link to="/login" aria-label="login" className="navlink">
          <User size={16} color="white" className="navicon" />
        </Link>
      )}

      <button
        className={`icon ${open ? "open" : "closed"}`}
        id="icon"
        onClick={toggle}
      >
        &#9776;
      </button>
      <main>
        <Link to="/home" className="link lgd" onClick={toggle} aria-label="Go to homepage">
          <img src="/assets/logo.png" alt="logo" className="logo" />
        </Link>

        <div className="dropdown">
          <button className="dropbtn">
            {t("wohnungen")} <i className="fas fa-caret-down"></i>
          </button>
          <div className="dropdown-content">
            <Link to="/lowerapartment" className="link" onClick={toggle}>
              {t("untereWohnung")}
            </Link>
            <Link to="/upperapartment" className="link" onClick={toggle}>
              {t("obereWohnung")}
            </Link>
          </div>
        </div>

        <Link to="/sent" className="link" onClick={toggle}>
          {t("region")}
        </Link>
        <Link to="/booking" className="link" onClick={toggle}>
          {t("buchung")}
        </Link>
        <Link to="/login" className="link" onClick={toggle}>
          {t("benutzer") + "/" + t("reviews")}
        </Link>
        <Link to="/faq" className="link" onClick={toggle}>
          {t("faq")}
        </Link>
        {isLogged && (
          <button className="logoutbtn" aria-label="logout" onClick={logout}>
            <LogOut size={16} color="white" className="navicon" />
          </button>
        )}
      </main>
      <div
        className={`language-bar${displayLanguage && !open ? " display" : ""}`}
        onMouseLeave={() => setDisplayLanguage(false)}
      >
        {displayLanguage && !open && <Language />}
      </div>
    </nav>
  );
};

export default NavigationBar;
