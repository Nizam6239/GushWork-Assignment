/* ============================================================
   index.js — Mangalam Pipes
   All features: Sticky Header, Image Carousel + Zoom,
   Mobile Nav, Modals, FAQ, Testimonials, HDPE Tabs,
   Industries Slider, Downloads, CTA Form
   ============================================================ */

/* ===== MOBILE NAV ===== */
(function () {
  const overlay = document.getElementById("mobileNavOverlay");
  const hamburger = document.getElementById("hamburgerBtn");
  const closeBtn = document.getElementById("mobileNavClose");
  const mobileProductToggle = document.getElementById("mobileProductToggle");
  const mobileDropdownMenu = document.getElementById("mobileDropdownMenu");
  const mobileDropdownItem = mobileProductToggle?.closest(".mobile-dropdown");

  function openMobileNav() {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMobileNav() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  hamburger?.addEventListener("click", openMobileNav);
  closeBtn?.addEventListener("click", closeMobileNav);

  // Close when clicking outside the panel
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeMobileNav();
  });

  // Mobile products dropdown toggle
  mobileProductToggle?.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = mobileDropdownMenu.classList.contains("show");
    mobileDropdownMenu.classList.toggle("show", !isOpen);
    mobileDropdownItem?.classList.toggle("active", !isOpen);
  });

  // Close nav on link click (for SPA-like UX)
  document
    .querySelectorAll(".mobile-nav-links a:not(.mobile-products-link)")
    .forEach((link) => link.addEventListener("click", closeMobileNav));
})();

/* ===== DESKTOP DROPDOWN ===== */
(function () {
  const toggle = document.getElementById("productToggle");
  const menu = document.getElementById("dropdownMenu");
  const dropdown = document.querySelector(".dropdown");

  if (!toggle || !menu || !dropdown) return;

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = menu.classList.contains("show");
    menu.classList.toggle("show", !isOpen);
    dropdown.classList.toggle("active", !isOpen);
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      menu.classList.remove("show");
      dropdown.classList.remove("active");
    }
  });
})();

/* ===== STICKY HEADER ===== */
(function () {
  // Create sticky header element above navbar
  const stickyHeader = document.createElement("div");
  stickyHeader.className = "sticky-header";
  stickyHeader.setAttribute("aria-hidden", "true");
  stickyHeader.innerHTML = `
    <div class="sticky-header__inner">
      <div class="sticky-header__logo">
        <img src="./images/logo.png" alt="Mangalam Logo" />
      </div>
      <div class="sticky-header__actions">
        <button class="sticky-header__quote-btn" id="stickyQuoteBtn">Get Custom Quote</button>
        <a href="#" class="sticky-header__contact-btn">Contact Us</a>
      </div>
    </div>
  `;
  // Insert at the very top of body — above the mobile overlay and navbar
  document.body.insertBefore(stickyHeader, document.body.firstChild);

  let lastScrollY = window.scrollY;
  let ticking = false;

  // First fold = one viewport height
  const getFirstFold = () => window.innerHeight;

  function updateStickyHeader() {
    const currentScrollY = window.scrollY;
    const firstFold = getFirstFold();

    if (currentScrollY > firstFold) {
      stickyHeader.classList.add("sticky-header--visible");
      stickyHeader.setAttribute("aria-hidden", "false");

      if (currentScrollY > lastScrollY) {
        // Scrolling DOWN → hide
        stickyHeader.classList.add("sticky-header--hidden");
      } else {
        // Scrolling UP → show
        stickyHeader.classList.remove("sticky-header--hidden");
      }
    } else {
      // Within the first fold → always hide
      stickyHeader.classList.remove("sticky-header--visible");
      stickyHeader.classList.remove("sticky-header--hidden");
      stickyHeader.setAttribute("aria-hidden", "true");
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateStickyHeader);
        ticking = true;
      }
    },
    { passive: true },
  );

  // Sticky quote button → opens Modal 2
  document.getElementById("stickyQuoteBtn")?.addEventListener("click", () => {
    if (typeof window.openQuoteModal === "function") window.openQuoteModal();
  });
})();

/* ===== MODAL 1 — Email Catalogue (triggered by Download Full Technical Datasheet) ===== */
(function () {
  const modal = document.createElement("div");
  modal.id = "catalogueModal";
  modal.className = "nx-modal-overlay";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = `
    <div class="nx-modal" aria-labelledby="catalogueModalTitle">
      <button class="nx-modal__close" id="closeCatalogueModal" aria-label="Close">&#x2715;</button>
      <h2 class="nx-modal__title" id="catalogueModalTitle">Let us email the entire catalogue to you</h2>
      <div class="nx-modal__field">
        <label class="nx-modal__label">Your Email <span class="nx-modal__required">*</span></label>
        <input type="email" class="nx-modal__input" id="catalogueEmail" placeholder="example@gmail.com" autocomplete="email" />
      </div>
      <div class="nx-modal__field">
        <label class="nx-modal__label">Your Contact <span class="nx-modal__optional">(Optional)</span></label>
        <input type="tel" class="nx-modal__input" id="cataloguePhone" placeholder="+91-0000000000" autocomplete="tel" />
      </div>
      <div class="nx-modal__footer">
        <button class="nx-modal__submit" id="catalogueSubmitBtn">Download Brochure</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  function openCatalogueModal() {
    modal.classList.add("nx-modal-overlay--visible");
    document.body.style.overflow = "hidden";
    document.getElementById("catalogueEmail")?.focus();
  }

  function closeCatalogueModal() {
    modal.classList.remove("nx-modal-overlay--visible");
    document.body.style.overflow = "";
  }

  window.openCatalogueModal = openCatalogueModal;

  document
    .getElementById("closeCatalogueModal")
    ?.addEventListener("click", closeCatalogueModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeCatalogueModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCatalogueModal();
  });

  document
    .getElementById("catalogueSubmitBtn")
    ?.addEventListener("click", () => {
      const emailInput = document.getElementById("catalogueEmail");
      const email = emailInput.value.trim();

      if (!email) {
        emailInput.focus();
        emailInput.style.borderColor = "#e53e3e";
        return;
      }

      emailInput.style.borderColor = "";
      const btn = document.getElementById("catalogueSubmitBtn");
      btn.textContent = "Sending…";
      btn.disabled = true;

      setTimeout(() => {
        closeCatalogueModal();
        btn.textContent = "Download Brochure";
        btn.disabled = false;
        document.getElementById("catalogueEmail").value = "";
        const phoneEl = document.getElementById("cataloguePhone");
        if (phoneEl) phoneEl.value = "";
        alert("Catalogue will be emailed to you shortly!");
      }, 1200);
    });
})();

/* ===== MODAL 2 — Request a Quote / Call Back ===== */
(function () {
  const modal = document.createElement("div");
  modal.id = "quoteModal";
  modal.className = "nx-modal-overlay";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = `
    <div class="nx-modal" aria-labelledby="quoteModalTitle">
      <button class="nx-modal__close" id="closeQuoteModal" aria-label="Close">&#x2715;</button>
      <h2 class="nx-modal__title" id="quoteModalTitle">Request a call back</h2>
      <div class="nx-modal__field">
        <input type="text"  class="nx-modal__input nx-modal__input--line" id="quoteName"    placeholder="Full Name"      autocomplete="name" />
      </div>
      <div class="nx-modal__field">
        <input type="text"  class="nx-modal__input nx-modal__input--line" id="quoteCompany" placeholder="Company Name" />
      </div>
      <div class="nx-modal__field">
        <input type="email" class="nx-modal__input nx-modal__input--line" id="quoteEmail"   placeholder="Email Address"  autocomplete="email" />
      </div>
      <div class="nx-modal__field nx-modal__phone-group">
        <select class="nx-modal__select nx-modal__input--line" id="quoteCountryCode">
          <option>+91</option>
          <option>+1</option>
          <option>+44</option>
          <option>+61</option>
          <option>+971</option>
        </select>
        <input type="tel" class="nx-modal__input nx-modal__input--line nx-modal__phone-input" id="quotePhone" placeholder="7003026616" autocomplete="tel" />
      </div>
      <div class="nx-modal__footer nx-modal__footer--right">
        <button class="nx-modal__submit nx-modal__submit--navy" id="quoteSubmitBtn">Submit Form</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  function openQuoteModal() {
    modal.classList.add("nx-modal-overlay--visible");
    document.body.style.overflow = "hidden";
    document.getElementById("quoteName")?.focus();
  }

  function closeQuoteModal() {
    modal.classList.remove("nx-modal-overlay--visible");
    document.body.style.overflow = "";
  }

  window.openQuoteModal = openQuoteModal;

  document
    .getElementById("closeQuoteModal")
    ?.addEventListener("click", closeQuoteModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeQuoteModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeQuoteModal();
  });

  document.getElementById("quoteSubmitBtn")?.addEventListener("click", () => {
    const name = document.getElementById("quoteName").value.trim();
    if (!name) {
      document.getElementById("quoteName").focus();
      return;
    }

    const btn = document.getElementById("quoteSubmitBtn");
    btn.textContent = "Submitting…";
    btn.disabled = true;

    setTimeout(() => {
      closeQuoteModal();
      btn.textContent = "Submit Form";
      btn.disabled = false;
      ["quoteName", "quoteCompany", "quoteEmail", "quotePhone"].forEach(
        (id) => {
          const el = document.getElementById(id);
          if (el) el.value = "";
        },
      );
      alert("Your request has been submitted! We'll call you back shortly.");
    }, 1200);
  });
})();

/* ===== IMAGE SLIDER + ZOOM ===== */
(function () {
  const mainImage = document.getElementById("mainImage");
  const thumbs = document.querySelectorAll(".thumb");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!mainImage || thumbs.length === 0) return;

  // Image sources array (matches thumbnail order)
  const images = [
    "./images/GalleryMainImage.png",
    "./images/GalleryMainImage.png",
    "./images/GalleryMainImage.png",
    "./images/GalleryMainImage.png",
  ];

  let currentIdx = 0;

  /** Update the main image and active thumbnail */
  function updateImage(idx) {
    currentIdx = (idx + images.length) % images.length;
    mainImage.src = images[currentIdx];
    thumbs.forEach((t) => t.classList.remove("active"));
    thumbs[currentIdx]?.classList.add("active");
    // Update zoom preview source too
    if (zoomPreviewImg) zoomPreviewImg.src = images[currentIdx];
  }

  // Thumbnail clicks
  thumbs.forEach((thumb, i) => {
    thumb.addEventListener("click", () => updateImage(i));
  });

  // Arrow buttons
  nextBtn?.addEventListener("click", () => updateImage(currentIdx + 1));
  prevBtn?.addEventListener("click", () => updateImage(currentIdx - 1));

  // Keyboard navigation on the gallery
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") updateImage(currentIdx + 1);
    if (e.key === "ArrowLeft") updateImage(currentIdx - 1);
  });

  /* ---- ZOOM on hover ---- */
  const mainImageWrap = mainImage.closest(".main-image");
  let zoomPreviewImg = null;

  if (mainImageWrap) {
    const ZOOM_FACTOR = 2.5;
    const LENS_SIZE = 100; // px

    // Create zoom lens
    const zoomLens = document.createElement("div");
    zoomLens.className = "zoom-lens";
    zoomLens.setAttribute("aria-hidden", "true");
    mainImageWrap.appendChild(zoomLens);

    // Create zoom preview panel
    const zoomPreview = document.createElement("div");
    zoomPreview.className = "zoom-preview";
    zoomPreview.setAttribute("aria-hidden", "true");
    zoomPreviewImg = document.createElement("img");
    zoomPreviewImg.className = "zoom-preview__img";
    zoomPreviewImg.alt = "";
    zoomPreview.appendChild(zoomPreviewImg);
    mainImageWrap.appendChild(zoomPreview);

    /** Show zoom elements */
    function showZoom() {
      zoomPreviewImg.src = mainImage.src;
      zoomLens.style.display = "block";
      zoomPreview.style.display = "block";
    }

    /** Hide zoom elements */
    function hideZoom() {
      zoomLens.style.display = "none";
      zoomPreview.style.display = "none";
    }

    /** Update lens & preview position */
    function handleZoomMove(e) {
      const rect = mainImageWrap.getBoundingClientRect();
      const lensHalf = LENS_SIZE / 2;

      // Client position → position relative to wrap
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      // Clamp lens so it stays inside the image
      x = Math.max(lensHalf, Math.min(x, rect.width - lensHalf));
      y = Math.max(lensHalf, Math.min(y, rect.height - lensHalf));

      // Move the lens
      zoomLens.style.left = x - lensHalf + "px";
      zoomLens.style.top = y - lensHalf + "px";

      // Calculate zoom origin as percentage within the image
      const bgX = ((x - lensHalf) / rect.width) * 100;
      const bgY = ((y - lensHalf) / rect.height) * 100;

      zoomPreviewImg.style.transformOrigin = `${bgX}% ${bgY}%`;
      zoomPreviewImg.style.transform = `scale(${ZOOM_FACTOR})`;
    }

    mainImageWrap.addEventListener("mouseenter", showZoom);
    mainImageWrap.addEventListener("mouseleave", hideZoom);
    mainImageWrap.addEventListener("mousemove", handleZoomMove, {
      passive: true,
    });

    // Touch: disable zoom (it interferes with swipe)
    mainImageWrap.addEventListener("touchstart", hideZoom, { passive: true });
  }

  /* ---- Touch Swipe Support ---- */
  let touchStartX = 0;
  mainImage.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );

  mainImage.addEventListener(
    "touchend",
    (e) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 40) {
        deltaX < 0 ? updateImage(currentIdx + 1) : updateImage(currentIdx - 1);
      }
    },
    { passive: true },
  );
})();

/* ===== TRUST SLIDER — pause on hover ===== */
(function () {
  const nxSlider = document.getElementById("nxTrustSlider");
  if (!nxSlider) return;

  const track = nxSlider.querySelector(".nx-trust__track");
  if (!track) return;

  nxSlider.addEventListener("mouseenter", () => {
    track.style.animationPlayState = "paused";
  });
  nxSlider.addEventListener("mouseleave", () => {
    track.style.animationPlayState = "running";
  });
})();

/* ===== DOWNLOAD BUTTON — opens Catalogue Modal ===== */
document.getElementById("nxDownloadBtn")?.addEventListener("click", () => {
  if (typeof window.openCatalogueModal === "function")
    window.openCatalogueModal();
});

/* ===== QUOTE BUTTON — opens Quote Modal ===== */
document.getElementById("nxQuoteBtn")?.addEventListener("click", () => {
  if (typeof window.openQuoteModal === "function") window.openQuoteModal();
});

/* ===== FAQ ACCORDION ===== */
(function () {
  const faqItems = document.querySelectorAll(".nx-faq__item");

  faqItems.forEach((item) => {
    item.addEventListener("click", () => {
      const isActive = item.classList.contains("nx-faq__item--active");
      // Close all
      faqItems.forEach((i) => i.classList.remove("nx-faq__item--active"));
      // Toggle clicked
      if (!isActive) {
        item.classList.add("nx-faq__item--active");
      }
    });

    // Keyboard accessibility
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });
})();

/* ===== INDUSTRIES SLIDER ===== */
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("slider1");
  const nextBtn = document.getElementById("next1");
  const prevBtn = document.getElementById("prev1");

  if (!slider || !nextBtn || !prevBtn) return;

  const gap = 20;
  let cards = slider.querySelectorAll(".card1");
  const total = cards.length;
  const getWidth = () => (cards[0]?.offsetWidth || 0) + gap;
  let index = 0;

  // Clone cards for infinite loop
  const firstClones = [];
  const lastClones = [];

  cards.forEach((card) => {
    firstClones.push(card.cloneNode(true));
    lastClones.push(card.cloneNode(true));
  });

  firstClones.forEach((clone) => slider.appendChild(clone));
  lastClones
    .reverse()
    .forEach((clone) => slider.insertBefore(clone, slider.firstChild));

  // Refresh cards NodeList after cloning
  cards = slider.querySelectorAll(".card1");

  let position = getWidth() * total;
  slider.style.transform = `translateX(-${position}px)`;

  function moveSlider() {
    const width = getWidth();
    slider.style.transition = "transform 0.5s ease";
    position += width * (index > 0 ? 1 : -1);
    slider.style.transform = `translateX(-${position}px)`;

    setTimeout(() => {
      const w = getWidth();
      if (position >= w * (total * 2)) {
        slider.style.transition = "none";
        position = w * total;
        slider.style.transform = `translateX(-${position}px)`;
      }
      if (position <= 0) {
        slider.style.transition = "none";
        position = w * total;
        slider.style.transform = `translateX(-${position}px)`;
      }
      index = 0;
    }, 500);
  }

  nextBtn.addEventListener("click", () => {
    index = 1;
    moveSlider();
  });
  prevBtn.addEventListener("click", () => {
    index = -1;
    moveSlider();
  });

  // Recalculate position on resize
  window.addEventListener(
    "resize",
    () => {
      const w = getWidth();
      position = w * total;
      slider.style.transition = "none";
      slider.style.transform = `translateX(-${position}px)`;
    },
    { passive: true },
  );
});

/* ===== HDPE PROCESS DATA ===== */
const procData = {
  raw: {
    title: "High-Grade Raw Material Selection",
    desc: "Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.",
    points: ["PE100 grade material", "Optimal molecular weight distribution"],
    img: "/images/Fishnet.png",
  },
  extrusion: {
    title: "Extrusion Process",
    desc: "Molten material is shaped into pipes using high precision extrusion machines.",
    points: ["Uniform thickness", "High strength output"],
    img: "/images/Fishnet.png",
  },
  cooling: {
    title: "Cooling Stage",
    desc: "Controlled cooling ensures structural stability and durability.",
    points: ["Water cooling tanks", "Shape retention"],
    img: "/images/Fishnet.png",
  },
  sizing: {
    title: "Sizing Stage",
    desc: "Pipes are sized to exact dimensions using precision calibration equipment.",
    points: ["Precise outer diameter", "Wall thickness uniformity"],
    img: "/images/Fishnet.png",
  },
  quality: {
    title: "Quality Control",
    desc: "Every pipe undergoes rigorous testing to meet international standards.",
    points: ["Pressure testing", "Dimensional accuracy checks"],
    img: "/images/Fishnet.png",
  },
  marking: {
    title: "Marking",
    desc: "Pipes are clearly marked with specifications, standards, and traceability codes.",
    points: ["ISO standard marking", "Batch traceability"],
    img: "/images/Fishnet.png",
  },
  cutting: {
    title: "Cutting",
    desc: "Pipes are cut to required lengths using automated cutting systems.",
    points: ["Precise cut lengths", "Clean edges"],
    img: "/images/Fishnet.png",
  },
  packaging: {
    title: "Packaging",
    desc: "Finished pipes are carefully packaged to prevent damage during transit.",
    points: ["Protective wrapping", "Secure bundling"],
    img: "/images/Fishnet.png",
  },
};

/** Render process content for a given step key */
function updateProcContent(step) {
  const data = procData[step];
  if (!data) return;

  const titleEl = document.getElementById("procTitle");
  const descEl = document.getElementById("procDesc");
  const listEl = document.getElementById("procList");
  const imgEl = document.getElementById("procImage");

  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.desc;
  if (imgEl) imgEl.src = data.img;

  if (listEl) {
    listEl.innerHTML = "";
    data.points.forEach((p) => {
      const li = document.createElement("li");
      li.className = "hdpeProc__listItem";
      const img = document.createElement("img");
      img.className = "circle4";
      img.src = "./images/CheckCircle.png";
      img.alt = "check";
      li.appendChild(img);
      li.appendChild(document.createTextNode(" " + p));
      listEl.appendChild(li);
    });
  }
}

/* ===== HDPE TABS — Desktop ===== */
(function () {
  const tabs = document.querySelectorAll(".hdpeProc__tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("hdpeProc__tab--active"));
      tab.classList.add("hdpeProc__tab--active");
      updateProcContent(tab.dataset.step);
    });
  });
})();

/* ===== HDPE PROCESS — Mobile Card with Prev/Next ===== */
(function () {
  const hdpeProcSection = document.querySelector(".hdpeProc");
  if (!hdpeProcSection) return;

  const steps = Object.keys(procData);
  let currentStep = 0;

  // Build mobile card HTML
  const mobileCard = document.createElement("div");
  mobileCard.className = "hdpeProc__mobile-card";
  mobileCard.innerHTML = `
    <div class="hdpeProc__mobile-badge" id="mobileProcBadge">Step 1/${steps.length}: Raw Material</div>
    <h2 class="hdpeProc__title" id="mobileProcTitle"></h2>
    <p class="hdpeProc__description" id="mobileProcDesc"></p>
    <ul class="hdpeProc__list" id="mobileProcList"></ul>
    <img class="hdpeProc__mobile-img" id="mobileProcImage" src="" alt="Process step" />
    <div class="hdpeProc__mobile-nav">
      <button class="hdpeProc__mobile-btn" id="mobileProcPrev">&#8592; Previous</button>
      <button class="hdpeProc__mobile-btn hdpeProc__mobile-btn--next" id="mobileProcNext">Next &#8594;</button>
    </div>
  `;
  hdpeProcSection.appendChild(mobileCard);

  /** Render a step in the mobile card */
  function renderMobileStep(idx) {
    const key = steps[idx];
    const data = procData[key];
    const stepLabel = key.charAt(0).toUpperCase() + key.slice(1);

    document.getElementById("mobileProcBadge").textContent =
      `Step ${idx + 1}/${steps.length}: ${stepLabel}`;
    document.getElementById("mobileProcTitle").textContent = data.title;
    document.getElementById("mobileProcDesc").textContent = data.desc;
    document.getElementById("mobileProcImage").src = data.img;

    const list = document.getElementById("mobileProcList");
    list.innerHTML = "";
    data.points.forEach((p) => {
      const li = document.createElement("li");
      li.className = "hdpeProc__listItem";
      const img = document.createElement("img");
      img.className = "circle4";
      img.src = "./images/CheckCircle.png";
      img.alt = "check";
      li.appendChild(img);
      li.appendChild(document.createTextNode(" " + p));
      list.appendChild(li);
    });

    document.getElementById("mobileProcPrev").disabled = idx === 0;
    document.getElementById("mobileProcNext").disabled =
      idx === steps.length - 1;
  }

  renderMobileStep(currentStep);

  document.getElementById("mobileProcPrev")?.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      renderMobileStep(currentStep);
    }
  });

  document.getElementById("mobileProcNext")?.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      renderMobileStep(currentStep);
    }
  });
})();

/* ===== TESTIMONIALS AUTO SCROLL ===== */
(function () {
  const track = document.getElementById("testimonialTrack");
  if (!track) return;

  let scrollPos = 0;
  let speed = 0.5;
  let isPaused = false;

  track.addEventListener(
    "mouseenter",
    () => {
      isPaused = true;
    },
    { passive: true },
  );
  track.addEventListener(
    "mouseleave",
    () => {
      isPaused = false;
    },
    { passive: true },
  );
  track.addEventListener(
    "touchstart",
    () => {
      isPaused = true;
    },
    { passive: true },
  );
  track.addEventListener(
    "touchend",
    () => {
      setTimeout(() => {
        isPaused = false;
      }, 2000);
    },
    { passive: true },
  );

  function autoScroll() {
    if (!isPaused) {
      scrollPos += speed;
      // Loop when reaching half (original set width)
      if (scrollPos >= track.scrollWidth / 2) scrollPos = 0;
      track.scrollLeft = scrollPos;
    }
    requestAnimationFrame(autoScroll);
  }

  autoScroll();
})();

/* ===== PORTFOLIO SECTION BUTTONS ===== */
document.addEventListener("DOMContentLoaded", () => {
  // "Learn More" card buttons
  document.querySelectorAll(".psp-card__button").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const cardTitle = button
        .closest(".psp-card")
        ?.querySelector(".psp-card__title")
        ?.textContent?.trim();
      if (cardTitle) alert(`Opening details for: ${cardTitle}`);
    });
  });

  // "Talk to an Expert" CTA
  document
    .querySelector(".psp-help-strip__cta")
    ?.addEventListener("click", () => {
      if (typeof window.openQuoteModal === "function") window.openQuoteModal();
    });
});

/* ===== DOWNLOAD BUTTONS (Resources section) ===== */
document.querySelectorAll(".rd-download-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const original = btn.innerHTML;
    btn.innerHTML = "Downloading… ⏳";
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
    }, 1500);
  });
});

/* ===== CTA FORM ===== */
(function () {
  const form = document.getElementById("ctaForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const button = form.querySelector(".cta-submit-btn");
    button.textContent = "Submitting…";
    button.disabled = true;

    setTimeout(() => {
      button.textContent = "Request Custom Quote";
      button.disabled = false;
      alert("Form submitted successfully! We will be in touch shortly.");
      form.reset();
    }, 1500);
  });
})();

/* ===== FOOTER SOCIAL HOVER ===== */
document.querySelectorAll(".ftx-socials span").forEach((icon) => {
  icon.addEventListener("mouseenter", () => {
    icon.style.transform = "scale(1.2)";
  });
  icon.addEventListener("mouseleave", () => {
    icon.style.transform = "scale(1)";
  });
});
