import "./styles/buttons.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ButtonProps {
  func: () => void;
}

export const NextButton = ({ func }: ButtonProps) => {
  return (
    <button
      className="slide-button next-button"
      aria-label="show next image"
      onClick={func}>
      <ChevronRight className="button-icon" size={24} color="white" />
    </button>
  );
};

export const BackButton = ({ func }: ButtonProps) => {
  return (
    <button
      className="slide-button back-button"
      aria-label="show previous image"
      onClick={() => {
        func();
      }}
    >
      <ChevronLeft className="button-icon" size={24} color="white" />
    </button>
  );
};
