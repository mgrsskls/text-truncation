/* global TextTruncation */

document.addEventListener("DOMContentLoaded", () => {
  Array.from(document.querySelectorAll(".TextTruncation")).forEach(
    el => new TextTruncation(el, { className: "TextTruncation-text" })
  );
});
