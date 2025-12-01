import "./styles/Formula.css";

import formulaDE from "../locales/de/formula.json";
import formulaEN from "../locales/en/formula.json";
import formulaFR from "../locales/fr/formula.json";
import formulaIT from "../locales/it/formula.json";

import { uploadFile } from "../store/database";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useState, useEffect } from "react";
import { Margin, Resolution, usePDF } from "react-to-pdf";
import { Send } from "lucide-react";

const Formula = () => {
  const [name, setName] = useState("");

  const { t } = useTranslation();
  function getQuestions(): string[] {
    switch (i18n.language) {
      case "en":
        return formulaEN.questions;
      case "fr":
        return formulaFR.questions;
      case "it":
        return formulaIT.questions;
      default:
        return formulaDE.questions;
    }
  }
  const [questions, setQuestions] = useState(getQuestions());
  const [answers, setAnswers] = useState<boolean[]>(
    getQuestions().map(() => false)
  );
  useEffect(() => {
    setQuestions(getQuestions());
  }, [t]);

  const { toPDF, targetRef } = usePDF({
    method: "save",
    filename: "form.pdf",
    page: { margin: Margin.LARGE },
    resolution: Resolution.HIGH,
  });

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<boolean>(false);
  return (
    <div className="formula">
      <main>
        {!preview && (
          <>
            <h1>{t("formulaHeader")}</h1>
            <p>{t("formulaText")}</p>
            <button onClick={() => setPreview(!preview)}>{t("preview")}</button>
          </>
        )}
        {preview && (
          <>
            <article
              className="paper"
              ref={targetRef}
              onDoubleClick={() => toPDF()}
            >
              <h2>{t("formula")}</h2>
              <div className="questions">
                {questions.map((question, index) => (
                  <div key={question} className="question">
                    <p>
                      Q{index + 1}: {question}
                    </p>
                    <form>
                      <div className="choice">
                        <input
                          type="radio"
                          id="yes"
                          name="answer"
                          value="yes"
                          required
                          onChange={() => {
                            let newAnswers = [...answers];
                            newAnswers[index] = true;
                            setAnswers(newAnswers);
                          }}
                        />
                        <label htmlFor="yes">{t("yes")}</label>
                      </div>
                      <div className="choice">
                        <input
                          type="radio"
                          id="no"
                          required
                          name="answer"
                          value="no"
                        />
                        <label htmlFor="no">{t("no")}</label>
                      </div>
                    </form>
                  </div>
                ))}
              </div>
              <div className="signature">
                <p>{t("name")}</p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p>{t("unterschrift")}</p>
                <input type="text" disabled />
              </div>
            </article>
            <div className="upload-bar">
              <button type="submit" onClick={() => toPDF()}>
                <p>{t("downloadPDF")}</p>
              </button>
              {selectedFile !== undefined && (
                <button
                  className="send-btn"
                  type="submit"
                  onClick={() => uploadFile(selectedFile)}
                >
                  <Send className="icon" color="white" />
                </button>
              )}
              <input
                type="file"
                accept="application/pdf, video/*"
                onInput={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    setSelectedFile(file);
                  } else {
                    alert(t("noFileSelected"));
                  }
                }}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};
export default Formula;
