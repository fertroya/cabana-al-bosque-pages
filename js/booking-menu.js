(function () {
  const CONFIG = {
    es: {
      trigger: "Reservá",
      triggerHero: "Reservá ahora",
      panelLabel: "Elegí cómo reservar",
      directTitle: "Reserva directa",
      directSub: "WhatsApp",
      directBadge: "Recomendado",
      airbnb: "Airbnb",
      booking: "Booking.com",
    },
    en: {
      trigger: "Book",
      triggerHero: "Book now",
      panelLabel: "Choose how to book",
      directTitle: "Book direct",
      directSub: "WhatsApp",
      directBadge: "Recommended",
      airbnb: "Airbnb",
      booking: "Booking.com",
    },
  };

  const LINKS = {
    es: {
      airbnb: "https://www.airbnb.com.ar/rooms/1107341934099853545",
      booking: "https://www.booking.com/hotel/ar/hermosa-cabana-al-bosque-en-bariloche.html",
      whatsapp:
        "https://wa.me/5492944148173?text=Hola%2C%20quiero%20reservar%20directamente%20con%20ustedes",
    },
    en: {
      airbnb: "https://www.airbnb.com/rooms/1107341934099853545",
      booking: "https://www.booking.com/hotel/ar/hermosa-cabana-al-bosque-en-bariloche.html",
      whatsapp:
        "https://wa.me/5492944148173?text=Hi%2C%20I%27d%20like%20to%20book%20directly%20with%20you",
    },
  };

  function langKey() {
    return document.documentElement.lang?.toLowerCase().startsWith("en") ? "en" : "es";
  }

  function iconWhatsApp() {
    return `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
  }

  function iconAirbnb() {
    return `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 3.3c-1.1 0-2.1.6-2.6 1.6L4.2 14.2c-.5 1-.2 2.2.7 2.9.4.3.9.5 1.4.5h11.4c.5 0 1-.2 1.4-.5.9-.7 1.2-1.9.7-2.9L14.6 4.9c-.5-1-1.5-1.6-2.6-1.6zm0 2.2c.2 0 .4.1.5.3l5.2 9.3c.2.3 0 .7-.3.7H6.6c-.3 0-.5-.4-.3-.7l5.2-9.3c.1-.2.3-.3.5-.3z"/></svg>`;
  }

  function iconBooking() {
    return `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M4 5h16a1 1 0 011 1v13a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm2 3v2h12V8H6zm0 4v2h8v-2H6z"/></svg>`;
  }

  function renderMenu(variant) {
    const lang = langKey();
    const copy = CONFIG[lang];
    const links = LINKS[lang];
    const triggerLabel = variant === "hero" ? copy.triggerHero : copy.trigger;
    const btnClass =
      variant === "hero"
        ? "btn btn-primary book-menu-trigger"
        : variant === "inline"
          ? "btn btn-primary book-menu-trigger"
          : "btn btn-primary btn-sm book-menu-trigger";

    return `
      <div class="book-menu book-menu--${variant}" data-book-menu-root>
        <button type="button" class="${btnClass}" aria-expanded="false" aria-haspopup="true">
          ${triggerLabel}
        </button>
        <div class="book-menu-panel" role="menu" aria-label="${copy.panelLabel}">
          <a class="book-option book-option--direct" href="${links.whatsapp}" target="_blank" rel="noopener" role="menuitem">
            <span class="book-option-icon book-option-icon--wa">${iconWhatsApp()}</span>
            <span class="book-option-text">
              <strong>${copy.directTitle}</strong>
              <small>${copy.directSub}</small>
            </span>
            <span class="book-option-badge">${copy.directBadge}</span>
          </a>
          <a class="book-option" href="${links.airbnb}" target="_blank" rel="noopener" role="menuitem">
            <span class="book-option-icon book-option-icon--airbnb">${iconAirbnb()}</span>
            <span class="book-option-text"><strong>${copy.airbnb}</strong></span>
          </a>
          <a class="book-option" href="${links.booking}" target="_blank" rel="noopener" role="menuitem">
            <span class="book-option-icon book-option-icon--booking">${iconBooking()}</span>
            <span class="book-option-text"><strong>${copy.booking}</strong></span>
          </a>
        </div>
      </div>`;
  }

  function closeAll(except) {
    document.querySelectorAll("[data-book-menu-root].is-open").forEach((menu) => {
      if (menu !== except) {
        menu.classList.remove("is-open");
        menu.querySelector(".book-menu-trigger")?.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initBookMenus() {
    document.querySelectorAll("[data-book-menu]").forEach((mount) => {
      const variant = mount.dataset.bookMenu || "sticky";
      mount.innerHTML = renderMenu(variant);

      const root = mount.querySelector("[data-book-menu-root]");
      const trigger = root.querySelector(".book-menu-trigger");

      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = root.classList.toggle("is-open");
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) closeAll(root);
      });
    });

    document.addEventListener("click", () => closeAll(null));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll(null);
    });
  }

  window.initBookMenus = initBookMenus;
})();
