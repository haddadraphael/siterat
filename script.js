const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");

menuButton?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const pageMeta = {
  home: {
    fr: {
      title: "Siterat | Sites web pour commerces, restos et ind&eacute;pendants",
      description: "Siterat refait votre vitrine web en site clair, rapide et pr&ecirc;t &agrave; envoyer &agrave; vos clients.",
    },
    en: {
      title: "Siterat | Websites for shops, restaurants and local services",
      description: "Siterat turns your current web presence into a clear website people can actually use.",
    },
  },
  customers: {
    fr: {
      title: "Clients | Siterat",
      description: "Logos, univers clients et exemples de sites professionnels coordonn&eacute;s par Siterat.",
    },
    en: {
      title: "Customers | Siterat",
      description: "Client logos, brand worlds and examples of professional websites coordinated by Siterat.",
    },
  },
  pricing: {
    fr: {
      title: "Offres | Siterat",
      description: "Offres Siterat pour cr&eacute;er un site web professionnel rapidement : Starter, Business et Premium.",
    },
    en: {
      title: "Pricing | Siterat",
      description: "Siterat plans for quickly creating a professional website: Starter, Business and Premium.",
    },
  },
  contact: {
    fr: {
      title: "Contact | Siterat",
      description: "Demandez un devis pour un site web professionnel Siterat. Premi&egrave;re version possible en 48h apr&egrave;s r&eacute;ception des contenus.",
    },
    en: {
      title: "Contact | Siterat",
      description: "Request a quote for a professional Siterat website. First version possible in 48h after receiving your content.",
    },
  },
  legal: {
    fr: {
      title: "Mentions l&eacute;gales | Siterat",
      description: "Mentions l&eacute;gales du site Siterat.",
    },
    en: {
      title: "Legal notice | Siterat",
      description: "Legal notice for the Siterat website.",
    },
  },
  privacy: {
    fr: {
      title: "Confidentialit&eacute; | Siterat",
      description: "Politique de confidentialit&eacute; du site Siterat.",
    },
    en: {
      title: "Privacy | Siterat",
      description: "Privacy policy for the Siterat website.",
    },
  },
};

const decodeHtml = (value) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
};

const setLanguage = (lang) => {
  document.documentElement.lang = lang;
  localStorage.setItem("siterat-lang", lang);

  document.querySelectorAll("[data-fr][data-en]").forEach((element) => {
    element.innerHTML = element.dataset[lang];
  });

  document.querySelectorAll("[data-fr-placeholder][data-en-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", element.dataset[`${lang}Placeholder`]);
  });

  document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
    button.textContent = lang === "fr" ? "EN" : "FR";
    button.setAttribute("aria-label", lang === "fr" ? "Switch to English" : "Passer en francais");
  });

  const page = document.body.dataset.page || "home";
  const meta = pageMeta[page]?.[lang] || pageMeta.home[lang];
  document.title = decodeHtml(meta.title);
  document.querySelector("meta[name='description']")?.setAttribute("content", decodeHtml(meta.description));
};

document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage((localStorage.getItem("siterat-lang") || "fr") === "fr" ? "en" : "fr");
  });
});
setLanguage(localStorage.getItem("siterat-lang") || "fr");

const reveals = [...document.querySelectorAll(".reveal")];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}

document.querySelectorAll("[data-comparison]").forEach((card) => {
  const range = card.querySelector("[data-comparison-range]");
  if (!range) return;

  let split = Number(range.value);
  let direction = 1;
  let isUserInteracting = false;
  let resumeTimer;
  const min = Number(range.min) || 8;
  const max = Number(range.max) || 92;
  const autoMin = Math.max(min, 26);
  const autoMax = Math.min(max, 74);

  const setSplit = (value) => {
    split = Math.min(max, Math.max(min, value));
    range.value = String(Math.round(split));
    card.style.setProperty("--split", `${split}%`);
  };

  const pauseForUser = () => {
    isUserInteracting = true;
    window.clearTimeout(resumeTimer);
  };

  const resumeSoon = () => {
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      isUserInteracting = false;
      direction = split >= 50 ? -1 : 1;
    }, 1800);
  };

  const updateFromRange = () => {
    pauseForUser();
    setSplit(Number(range.value));
    resumeSoon();
  };

  range.addEventListener("input", updateFromRange);
  range.addEventListener("change", () => {
    setSplit(Number(range.value));
    resumeSoon();
  });
  card.addEventListener("pointerenter", pauseForUser);
  card.addEventListener("pointerleave", resumeSoon);
  card.addEventListener("pointerdown", pauseForUser);
  card.addEventListener("pointerup", resumeSoon);
  card.addEventListener("touchstart", pauseForUser, { passive: true });
  card.addEventListener("touchend", resumeSoon);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion && card.hasAttribute("data-comparison-auto")) {
    const animate = () => {
      if (!isUserInteracting) {
        if (split <= autoMin) direction = 1;
        if (split >= autoMax) direction = -1;
        setSplit(split + direction * 0.12);
      }
      window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
  } else {
    setSplit(split);
  }
});

if (new URLSearchParams(location.search).get("sent") === "true") {
  document.querySelector("[data-success-banner]")?.classList.add("is-visible");
}

