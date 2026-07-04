const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const form = document.querySelector(".contact-form");

menuButton?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = encodeURIComponent("Website quote request");
  const body = encodeURIComponent(
    `Name: ${data.get("name") || ""}\nEmail: ${data.get("email") || ""}\n\nProject:\n${data.get("message") || ""}`
  );

  window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
});
