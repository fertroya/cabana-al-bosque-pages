(() => {
  const sections = document.querySelectorAll(".tips-section");
  if (sections.length >= 2) {
    sections.forEach((section) => {
      section.addEventListener("toggle", () => {
        if (!section.open) return;
        sections.forEach((other) => {
          if (other !== section) other.open = false;
        });
      });
    });
  }

  initGuestGreeting();
  initAgenda();
})();

function pageLocale() {
  return document.documentElement.lang?.startsWith("en") ? "en" : "es";
}

function dataUrl(file) {
  const locale = pageLocale();
  return new URL(
    locale === "en" ? `../data/${file}` : `data/${file}`,
    window.location.href
  ).href;
}

/** Solo en tuestadia.html (body[data-guest-page]). */
function initGuestGreeting() {
  if (!document.body.hasAttribute("data-guest-page")) return;

  const title = document.getElementById("tips-title");
  const kicker = document.getElementById("tips-kicker");
  const lead = document.getElementById("tips-lead");
  if (!title) return;

  fetch(dataUrl("current-guest.json"), { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
    .then((data) => {
      const name = String(data?.firstName || "").trim();
      if (!name) return;
      const locale = pageLocale();
      title.textContent = locale === "en" ? `Hi, ${name}` : `Hola, ${name}`;
      if (kicker) {
        kicker.textContent =
          locale === "en" ? "Your stay at the cabin" : "Tu estadía en la cabaña";
      }
      if (lead) {
        lead.textContent =
          locale === "en"
            ? "Wi‑Fi, laundry, contacts and ideas for your days here."
            : "WiFi, lavarropas, contactos e ideas para estos días.";
      }
      document.title =
        locale === "en"
          ? `${name} · Your stay — Cabaña al Bosque`
          : `${name} · Tu estadía — Cabaña al Bosque`;
    })
    .catch(() => {
      /* sin personalización: queda el copy estático */
    });
}

function initAgenda() {
  const root = document.getElementById("tips-agenda");
  if (!root) return;

  const days = Number(root.dataset.days || 7);
  const locale = root.dataset.locale === "en" ? "en" : "es";

  fetch(dataUrl("agenda.json"), { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
    .then((data) => renderAgenda(root, data, { days, locale }))
    .catch(() => {
      root.hidden = true;
    });
}

function todayAR() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDaysISO(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}

function weekdayLabel(iso, locale) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 15));
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(dt);
}

function renderAgenda(root, data, { days, locale }) {
  const from = todayAR();
  const to = addDaysISO(from, Math.max(0, days - 1));
  const events = (data.events || []).filter(
    (e) => e.date >= from && e.date <= to && !e.cancelled
  );

  if (!events.length) {
    root.hidden = true;
    return;
  }

  const byDay = new Map();
  const categoryRank = {
    Infantiles: 0,
    Teatro: 1,
    Cine: 2,
    Literatura: 3,
    Danza: 4,
    Circo: 5,
    "Cursos y talleres": 6,
    "Fiestas y Festivales": 7,
    Charlas: 8,
    Música: 9,
  };
  const ranked = [...events].sort((a, b) => {
    const pa = categoryRank[a.category] ?? 50;
    const pb = categoryRank[b.category] ?? 50;
    if (pa !== pb) return pa - pb;
    return String(a.title).localeCompare(String(b.title), "es");
  });
  for (const e of ranked) {
    if (!byDay.has(e.date)) byDay.set(e.date, []);
    const list = byDay.get(e.date);
    if (list.length < 4) list.push(e);
  }

  const frag = document.createDocumentFragment();
  const meta = document.createElement("p");
  meta.className = "tips-agenda-meta";
  meta.textContent =
    locale === "en"
      ? `Next ${days} days · source Barilochense`
      : `Próximos ${days} días · fuente Barilochense`;
  frag.appendChild(meta);

  for (const day of [...byDay.keys()].sort()) {
    const dayEl = document.createElement("div");
    dayEl.className = "tips-agenda-day";

    const heading = document.createElement("h3");
    heading.textContent = weekdayLabel(day, locale);
    dayEl.appendChild(heading);

    const ul = document.createElement("ul");
    ul.className = "tips-agenda-list";
    for (const e of byDay.get(day)) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = e.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = e.title;
      const cat = document.createElement("span");
      cat.className = "tips-agenda-cat";
      cat.textContent = e.category;
      li.appendChild(a);
      li.appendChild(cat);
      ul.appendChild(li);
    }
    dayEl.appendChild(ul);
    frag.appendChild(dayEl);
  }

  root.replaceChildren(frag);
  root.hidden = false;
}
