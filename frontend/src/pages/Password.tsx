import "./styles/Password.css";

import { Lock, Mail, ShieldCheck, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../store/database";

const Password = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t("password");
  }, [t]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert(t("passwordsMismatch"));
      setNewPassword("");
      setConfirmPassword("");
      return;
    }
    changePassword(email, password, newPassword)
      .then((wasSuccessFull) => {
        if (wasSuccessFull) {
          alert(t("passwordChanged"));
          localStorage.setItem("login_email", email);
          localStorage.setItem("login_password", newPassword);
          navigate("/login");
        } else {
          setPassword("");
          setPassword("");
          setNewPassword("");
          setConfirmPassword("");
          alert(t("passwordChangeFailed"));
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  return (
    <div className="password">
      <header></header>
      <main>
        <h1>{t("changePassword")}</h1>
        <form className="password-form">
          <label htmlFor="email">
            <Mail className="icon" color="white" />
          </label>
          <input
            type="email"
            id="email"
            name="email"
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
            name="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="new-password">
            <Shield className="icon" color="white" />
          </label>
          <input
            type="password"
            id="new-password"
            name="new-password"
            placeholder={t("newPassword")}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setConfirmPassword("");
            }}
            minLength={6}
            required
          />
          <label htmlFor="confirm-password">
            <ShieldCheck className="icon" color="white" />
          </label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder={t("confirmNewPassword")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
            required
          />
        </form>
        <button type="submit" onClick={handlePasswordChange}>
          {t("changePassword")}
        </button>
      </main>
    </div>
  );
};

export default Password;
