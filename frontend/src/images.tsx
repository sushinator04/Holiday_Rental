/* This files contains some global constant variables that are used in the app. */

export interface Image {
  src: string;
  alt: string;
  caption: string | null;
}

export interface ImageArray {
  images: Image[];
}

// Homepage
export const images_home: Image[] = Array.from({ length: 6 }, (_, i) => ({
  src: `/assets/home/home${i}.jpg`,
  alt: `Foto fuer Homepage (${i})`,
  caption: "",
}));

// Lower apartment
const images_basement = Array.from({ length: 3 }, (_, i) => ({
  src: `/assets/-1/keller${i}.jpg`,
  alt: `Foto von Keller (${i})`,
  caption: "",
}));
const images_0 = Array.from({ length: 7 }, (_, i) => ({
  src: `/assets/0/erdgeschoss${i}.jpg`,
  alt: `Foto von Erdgeschoss (${i})`,
  caption: "",
}));
const images_1 = Array.from({ length: 6 }, (_, i) => ({
  src: `/assets/1/obergeschoss${i}.jpg`,
  alt: `Foto von Obergeschoss (${i})`,
  caption: "",
}));
export const images_lower: Image[] = images_0.concat(images_1);

// Upper apartment
export const images_upper = Array.from({ length: 7 }, (_, i) => ({
  src: `/assets/2/dachgeschoss${i}.jpg`,
  alt: `Foto von Dachgeschoss (${i})`,
  caption: "",
}));

export const WAITING_TIME = 2000;
export const WAITING_TIME_LONG = 6000; // Change requires adapting TitleShow too.
export const TIMEOUT = 3000;
