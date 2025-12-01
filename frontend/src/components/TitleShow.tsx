import { useState, useEffect } from "react";
import { WAITING_TIME_LONG } from "../images";
import { ImageArray } from "../images";
import "./styles/TitleShow.css";

const TitleShow = ({ images }: ImageArray) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
      const timer = setTimeout(() => {
        setIndex((index + 1) % images.length);
      }, WAITING_TIME_LONG);
      return () => clearTimeout(timer);
  }, [index, images.length]);
  return (
    <div className="titleshow">
      {images.map((image, i) => (
        <img 
          key={i}
          src={image.src}
          alt={image.alt}
          style={{display: index === i ? "block" : "none"}}
        />
      ))}
    </div>
  );
};

export default TitleShow;