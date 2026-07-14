(() => {
  const sections = document.querySelectorAll(".tips-section");
  if (sections.length < 2) return;

  sections.forEach((section) => {
    section.addEventListener("toggle", () => {
      if (!section.open) return;
      sections.forEach((other) => {
        if (other !== section) other.open = false;
      });
    });
  });
})();
