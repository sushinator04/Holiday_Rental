import { Mail, PhoneCall } from "lucide-react";

import "./styles/Footer.css";

import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="footer">
      <div>
        <b>
          <Mail size={12} /> {" " + t("email")}:
        </b>
        <br />
        <a href="mailto:ben.klomp@bluewin.ch">
          <span>ben.klomp@bluewin.ch</span>
        </a>
      </div>
      <div>
        <b>
          <PhoneCall size={12} /> {" " + t("telefon")}:
        </b>
        <br />
        <a href="tel:+41 76 566 61 72">
          <span>+41 76 566 61 72</span>
        </a>
      </div>
    </div>
  );
};

export default Footer;
