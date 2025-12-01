
import "./styles/HomeSlideShow.css";

import { useEffect, useState } from "react";

import { WAITING_TIME, ImageArray } from "../images";

const HomeSlideShow = ({ images }: ImageArray) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    document.title = "Home";
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((index + 1) % images.length);
    }, WAITING_TIME);
    return () => clearInterval(timer);
  }, [index, images.length]);

  return (
    <div className="home-slideshow">
      {images.map((image, i) => (
        <figure key={i}>
          <img
            src={image.src}
            alt={image.alt}
            style={{ display: index === i ? "block" : "none" }}
          />
        </figure>
      ))}
    </div>
  );
};

export default HomeSlideShow;
