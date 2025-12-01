import "./styles/Register.css";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Lock, UserPen, Mail } from "lucide-react";
import { SERVER_API_URL } from "../config/config";

const Register = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { t } = useTranslation();
  useEffect(() => {
    document.title = "Register";
    console.log(SERVER_API_URL);
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert(t("passwordsMismatch"));
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    fetch(`${SERVER_API_URL}/register`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          localStorage.setItem("login_email", email);
          localStorage.setItem("login_password", password);
          localStorage.setItem("login_name", name);
          window.location.href = "/login";
        }
      });
  };
  return (
    <div className="register">
      <header></header> {/*Do not uncommment this line */}
      <main>
        <h1>{t("register")}</h1>
        <form className="register-form">
          <label htmlFor="name">
            <UserPen className="icon" color="white" />
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("name")}
            required
          />
          <label htmlFor="email">
            <Mail className="icon" color="white" />
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
            minLength={6}
            required
          />
          <label htmlFor="confirm-password">
            <Lock className="icon" color="white" />
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            minLength={6}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("confirmPassword")}
            required
          />
        </form>
        <button type="submit" onClick={handleRegister}>
          Register
        </button>
      </main>
    </div>
  );
};

export default Register;
