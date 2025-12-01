import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Lock } from "lucide-react";
import Review from "../components/Review";
import Dashboard from "../components/Dashboard";
import Formula from "../components/Formula";
import { ClearDatabaseButton, getUsernameForEmail } from "../store/database";
import { SERVER_API_URL, DEVELOPER_MODE } from "../config/config";
import { useAuth } from "../hooks/useAuth";

import "react-tabs/style/react-tabs.css";
import "./styles/Login.css";

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { t } = useTranslation();
  useEffect(() => {
    document.title = t("login");
    const login_email = localStorage.getItem("login_email");
    const login_password = localStorage.getItem("login_password");
    if (login_email && login_password) {
      setEmail(login_email);
      setPassword(login_password);
    }
  }, []);

  const [guestMode, setGuestMode] = useState(false); // Track guest mode
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const invalidLoginEffect = () => {
    alert(t("invalidLogin")); // TODO: Replace with better visual feedback
  };

  const { isLogged } = useAuth();

  const handleLogin = async () => {
    console.log("Logging in with email:", email);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const response = await fetch(`${SERVER_API_URL}/login`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (response.ok) {
      const username = getUsernameForEmail(email);
      if (typeof username === "string") {
        console.log("Login successful:", username);
        localStorage.setItem("login_name", username);
      } else {
        console.warn("Could not fetch username for email:", email);
      }
      localStorage.setItem("login_email", email);
      localStorage.setItem("login_password", password);
    } else {
      console.error("Login failed:", data.error);
      localStorage.removeItem("login_email");
      localStorage.removeItem("login_password");
      invalidLoginEffect();
    }
    window.dispatchEvent(new Event("loggedIn"));
  };

  const handleGuestMode = () => {
    setGuestMode(true);
  };

  return (
    <div className="login">
      <header></header>
      <main>
        {DEVELOPER_MODE && <ClearDatabaseButton />}

        {!isLogged && !guestMode ? (
          <section className="login-section">
            <h1>{t("login")}</h1>
            <form className="login-form">
              <label htmlFor="email">
                <User className="icon" color="white" />
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email")}
                required
              />
              <label htmlFor="password">
                <Lock className="icon" color="white" />
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("password")}
                required
              />
              <small>
                <a href="/register">{t("nochKeinKonto?")}</a>
                <a href="/password-change">{t("passwortÄndern?")}</a>
              </small>
            </form>
            <button className="login-btn" type="submit" onClick={handleLogin}>
              {t("login")}
            </button>
            <button className="guest-btn" onClick={handleGuestMode}>
              {t("continueAsGuest")}
            </button>
          </section>
        ) : (
          <section className="tabs">
            {guestMode && !isLogged ? (
              // In guest mode, only show Review and handle submission differently
              <Review email={email} guestMode={true} />
            ) : (
              <>
                <div className="tablist">
                  <button
                    className={"tab" + (tabIndex === 0 ? " active" : "")}
                    onClick={() => setTabIndex(0)}
                  >
                    {t("dashboard")}
                  </button>
                  <button
                    className={"tab" + (tabIndex === 1 ? " active" : "")}
                    onClick={() => setTabIndex(1)}
                  >
                    {t("review")}
                  </button>
                  <button
                    className={"tab" + (tabIndex === 2 ? " active" : "")}
                    onClick={() => setTabIndex(2)}
                  >
                    {t("formula")}
                  </button>
                </div>
                {tabIndex === 0 && <Dashboard />}
                {tabIndex === 1 && <Review email={email} />}
                {tabIndex === 2 && <Formula />}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Login;
