import TextTruncation from "./text-truncation.js";

document.addEventListener("DOMContentLoaded", () => {
  Array.from(document.querySelectorAll(".TextTruncation")).forEach(
    el => new TextTruncation(el, { className: "TextTruncation-text" })
  );
});
