import { Data, defaultColumnSetup } from "./types";

const QUALITY_COMPONENT = 42;
const PADDING = 8 + 8;

export const calcTitleWidth = (data: Data) => {
  const el = document.getElementById("text_calculation")!;

  const longestTitle = data.reduce((longest, { title }) => {
    if (title === "Title") return longest;
    if (!title) return longest;

    return title.length > longest.length ? title : longest;
  }, "");

  el.textContent = longestTitle || "";
  const titleWidth = el.clientWidth + 1 + PADDING + QUALITY_COMPONENT;

  const minTitleWidth = defaultColumnSetup.find(
    ({ key }) => key === "title",
  )!.width;

  // Reset text calcuation element
  el.textContent = "";

  return titleWidth < minTitleWidth ? minTitleWidth : titleWidth;
};

export const calcEncoderWidth = (data: Data) => {
  const el = document.getElementById("text_calculation")!;

  const longestEncoder = data.reduce((longest, { encoder }) => {
    if (encoder === "Encoder") return longest;
    if (!encoder) return longest;

    return encoder.length > longest.length ? encoder : longest;
  }, "");

  el.textContent = longestEncoder || "";
  const encoderWidth = el.clientWidth + 1 + PADDING;

  const minEncoderWidth = defaultColumnSetup.find(
    ({ key }) => key === "encoder",
  )!.width;

  // Reset text calcuation element
  el.textContent = "";

  return encoderWidth < minEncoderWidth ? minEncoderWidth : encoderWidth;
};

export const calcGenreWidth = (data: Data) => {
  const el = document.getElementById("text_calculation")!;

  const longestGenre = data.reduce((longest, { genres }) => {
    // @ts-expect-error This is a header
    if (genres === "Genres") return longest;

    if (!genres || !genres.length) return longest;

    const concat = genres.join("");

    return concat.length > longest.length ? concat : longest;
  }, "");

  el.textContent = longestGenre || "";
  const encoderWidth = el.clientWidth + 1 + PADDING;

  const minEncoderWidth = defaultColumnSetup.find(
    ({ key }) => key === "encoder",
  )!.width;

  // Reset text calcuation element
  el.textContent = "";

  return encoderWidth < minEncoderWidth ? minEncoderWidth : encoderWidth;
};
