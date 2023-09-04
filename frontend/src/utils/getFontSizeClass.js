function getFontSizeClass(textLength = 0) {
  return textLength > 200
    ? "small-font"
    : textLength > 100
    ? "medium-font"
    : "";
}

export default getFontSizeClass;
