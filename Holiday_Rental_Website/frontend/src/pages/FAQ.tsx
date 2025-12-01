import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./styles/FAQ.css";
import i18n from "i18next";

import { ShieldQuestion, Search } from "lucide-react";

// load questions from a JSON file
import questionsDE from "../locales/de/faq.json";
import questionsEN from "../locales/en/faq.json";
import questionsFR from "../locales/fr/faq.json";
import questionsIT from "../locales/it/faq.json";

const getQuestions = () => {
  switch (i18n.language) {
    case "de":
      return questionsDE.faq;
    case "en":
      return questionsEN.faq;
    case "fr":
      return questionsFR.faq;
    case "it":
      return questionsIT.faq;
    default:
      return questionsDE.faq;
  }
};

const FAQ = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState(getQuestions());
  const mainRef = useRef<HTMLDivElement>(null); // reference to the main element
  const [doubleClick, setDoubleClick] = useState(false);

  useEffect(() => {
    document.title = t("faq");
    setQuestions(getQuestions());
  }, [t]);

  useEffect(() => {
    const main = mainRef.current;
    const faq = document.querySelector(".faq");
    if (!main || !faq) return;
    const handleScroll = () => {
      if (main.scrollTop > 0) {
        faq.classList.add("scrolled");
      } else {
        faq.classList.remove("scrolled");
      }
    };
    main.addEventListener("scroll", handleScroll);
    return () => main.removeEventListener("scroll", handleScroll);
  }, []);

  const resetSearch = () => {
    setSearch("");
    setQuestions(getQuestions());
  };

  const handleSearch = () => {
    setQuestions(
      getQuestions().filter(
        ({ question, answer }) =>
          question.toLowerCase().includes(search.toLowerCase()) ||
          answer.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const handleDoubleClick = (index: number) => {
    if (!doubleClick) {
      setQuestions([questions[index]!]);
      setDoubleClick(true);
    } else {
      setQuestions(getQuestions());
      setDoubleClick(false);
    }
  };

  const handleHold = (index: number) => {
    const timeout = setTimeout(() => {
      handleDoubleClick(index);
    }, 500);
    const clear = () => clearTimeout(timeout);
    document.addEventListener("mouseup", clear);
    document.addEventListener("touchend", clear);
  };

  return (
    <div className="faq">
      <header>
        <h1>{t("frequentlyAskedQuestions")}</h1>
        <div className="searchbar">
          <Search className="label" color={"white"} />
          <input
            type="search"
            size={20}
            placeholder={t("suche")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onInput={handleSearch}
            onClickCapture={resetSearch}
          />{" "}
        </div>
      </header>
      <main
        ref={mainRef}
        tabIndex={0}
        aria-label="Scrollable list of questions and answers" // Provides an accessible name
        role="region" // Designates it as a distinct region
      >
        {questions.map(
          (
            { question, answer }: { question: string; answer: string },
            index: number
          ) => (
            <article
              key={index}
              onDoubleClick={() => handleDoubleClick(index)}
              onMouseLeave={() => {
                setDoubleClick(false);
                setQuestions(getQuestions());
              }}
              onMouseDown={() => handleHold(index)}
              onTouchStart={() => handleHold(index)}
            >
              <h3>
                <ShieldQuestion size={24} /> {" " + question}
              </h3>
              <p>{answer}</p>
            </article>
          )
        )}
      </main>
    </div>
  );
};
export default FAQ;
