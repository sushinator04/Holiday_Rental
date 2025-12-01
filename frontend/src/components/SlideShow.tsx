import { useState, useEffect } from "react";
import "./styles/SlideShow.css";
import { WAITING_TIME, TIMEOUT, ImageArray } from "../images";
import { NextButton, BackButton } from "./ui/buttons";

function SlideShow({ images }: ImageArray) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isPaused) {
      timer = setTimeout(() => {
        setIndex((index + 1) % images.length);
      }, WAITING_TIME);
    }
    return () => clearTimeout(timer);
  }, [index, images.length, isPaused]);
  const resetPause = () => {
    setTimeout(() => setIsPaused(false), TIMEOUT);
  };
  const nextSlide = () => {
    setIndex((index + 1) % images.length);
    setIsPaused(true);
    resetPause();
  };
  const prevSlide = () => {
    setIndex(index === 0 ? images.length - 1 : index - 1);
    setIsPaused(true);
    resetPause();
  };
  const chooseImage = (nIndex: number) => {
    setIndex(nIndex);
    setIsPaused(true);
    resetPause();
  };
  return (
    <div className="slideshow-container">
      <div
        style={{ display: "flex", alignItems: "center", padding: 0, margin: 0 }}
      >
        <BackButton func={prevSlide} />
        {images.map((photo, i) => (
          <figure
            key={i}
            style={{ display: index === i ? "block" : "none" }}
            className="fig-container"
          >
            <img src={photo.src} alt={photo.alt} />
          </figure>
        ))}
        <NextButton func={nextSlide} />
      </div>
      <div className="collection-container">
        {images.map((photo, i) => (
          <img
            key={i}
            src={photo.src}
            alt={photo.alt}
            className={index === i ? "active" : ""}
            onClick={() => chooseImage(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default SlideShow;
