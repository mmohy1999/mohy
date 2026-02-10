(() => {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  const root = document.documentElement;
  const body = document.body;

  const elements = {
    backHome: document.getElementById("back-home"),
    projectTitle: document.getElementById("project-title"),
    projectDescription: document.getElementById("project-description"),
    projectCover: document.getElementById("project-cover"),
    projectLinks: document.getElementById("project-links"),
    projectFeatures: document.getElementById("project-features"),
    projectTech: document.getElementById("project-tech"),
    projectGallery: document.getElementById("project-gallery"),
    contactGrid: document.getElementById("contact-grid"),
    langToggle: document.querySelectorAll("[data-lang-toggle]"),
    themeToggle: document.querySelectorAll("[data-theme-toggle]"),
  };

  const social = {
    github: "https://github.com/mmohy1999",
    whatsapp: "https://wa.me/201015258644",
  };

  const urlParams = new URLSearchParams(window.location.search);

  const getInitialLocale = () => {
    const param = urlParams.get("lang");
    if (param && data[param]) {
      localStorage.setItem("locale", param);
      return param;
    }
    const stored = localStorage.getItem("locale");
    if (stored && data[stored]) return stored;
    return navigator.language && navigator.language.startsWith("ar") ? "ar" : "en";
  };

  const getInitialTheme = () => {
    const param = urlParams.get("theme");
    if (param === "dark" || param === "light") {
      localStorage.setItem("theme", param);
      return param;
    }
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const state = {
    locale: getInitialLocale(),
    theme: getInitialTheme(),
    mediaItems: [],
  };

  const projectId = urlParams.get("id");

  const iconWrapper = (path) =>
    `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

  const checkIcon = () => iconWrapper("<path d=\"M20 6 9 17l-5-5\"></path>");
  const photoIcon = () =>
    iconWrapper(
      "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"></rect><circle cx=\"8.5\" cy=\"9\" r=\"1.5\"></circle><path d=\"M21 15l-5-5L5 21\"></path>"
    );
  const googlePlayIcon = () =>
    "<i class=\"fa-brands fa-google-play\" aria-hidden=\"true\"></i>";
  const appStoreIcon = () => "<i class=\"fa-brands fa-apple\" aria-hidden=\"true\"></i>";
  const testFlightIcon = () => "<i class=\"fa-brands fa-apple\" aria-hidden=\"true\"></i>";
  const githubBrandIcon = () => "<i class=\"fa-brands fa-github\" aria-hidden=\"true\"></i>";
  const downloadIcon = () =>
    iconWrapper(
      "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><path d=\"M7 10l5 5 5-5\"></path><path d=\"M12 15V3\"></path>"
    );
  const codeIcon = () =>
    iconWrapper("<path d=\"M16 18 22 12 16 6\"></path><path d=\"M8 6 2 12 8 18\"></path>");
  const mailIcon = () =>
    iconWrapper(
      "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"></rect><path d=\"M3 7l9 6 9-6\"></path>"
    );
  const sunIcon = () =>
    iconWrapper(
      "<circle cx=\"12\" cy=\"12\" r=\"4\"></circle><path d=\"M12 2v2\"></path><path d=\"M12 20v2\"></path><path d=\"M4.93 4.93l1.41 1.41\"></path><path d=\"M17.66 17.66l1.41 1.41\"></path><path d=\"M2 12h2\"></path><path d=\"M20 12h2\"></path><path d=\"M4.93 19.07l1.41-1.41\"></path><path d=\"M17.66 6.34l1.41-1.41\"></path>"
    );
  const moonIcon = () =>
    iconWrapper(
      "<path d=\"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z\"></path>"
    );
  const closeIcon = () =>
    iconWrapper("<path d=\"M18 6 6 18\"></path><path d=\"M6 6 18 18\"></path>");
  const chevronLeft = () => iconWrapper("<path d=\"M15 18l-6-6 6-6\"></path>");
  const chevronRight = () => iconWrapper("<path d=\"M9 18l6-6-6-6\"></path>");
  const plusIcon = () => iconWrapper("<path d=\"M12 5v14\"></path><path d=\"M5 12h14\"></path>");
  const minusIcon = () => iconWrapper("<path d=\"M5 12h14\"></path>");

  const getProjectCategories = (project) => {
    if (Array.isArray(project.categories) && project.categories.length) {
      return project.categories;
    }
    if (Array.isArray(project.techTags)) return project.techTags;
    return [];
  };

  const modalState = {
    isOpen: false,
    index: 0,
    zoom: 1,
    baseWidth: 0,
    baseHeight: 0,
  };

  let modal = null;

  const updateI18n = (strings) => {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (strings[key]) el.textContent = strings[key];
    });
  };

  const updateLangToggle = (strings, locale) => {
    const label = locale === "ar" ? strings.languageEnglish : strings.languageArabic;
    elements.langToggle.forEach((btn) => {
      btn.textContent = label;
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
    });
  };

  const updateModalLabels = (strings) => {
    if (!modal) return;
    modal.prevBtn.setAttribute("aria-label", strings.mediaPrev);
    modal.nextBtn.setAttribute("aria-label", strings.mediaNext);
    modal.closeBtn.setAttribute("aria-label", strings.mediaClose);
    modal.zoomIn.setAttribute("aria-label", strings.mediaZoomIn);
    modal.zoomOut.setAttribute("aria-label", strings.mediaZoomOut);
    modal.zoomReset.setAttribute("aria-label", strings.mediaZoomReset);
  };

  const setTheme = (theme) => {
    state.theme = theme;
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);

    const strings = data[state.locale].strings;
    elements.themeToggle.forEach((btn) => {
      const label = theme === "dark" ? strings.lightModeLabel : strings.darkModeLabel;
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
      btn.innerHTML = theme === "dark" ? sunIcon() : moonIcon();
    });

    updateBackHomeLink();
  };

  const setLocale = (locale) => {
    state.locale = locale;
    root.lang = locale;
    root.dir = locale === "ar" ? "rtl" : "ltr";
    localStorage.setItem("locale", locale);

    const { strings, profile } = data[locale];
    updateI18n(strings);
    updateLangToggle(strings, locale);
    updateModalLabels(strings);
    renderProject();
    renderContact(profile, strings);
    setTheme(state.theme);
    updateBackHomeLink();
  };

  const updateBackHomeLink = () => {
    if (!elements.backHome) return;
    elements.backHome.href = `index.html?lang=${encodeURIComponent(state.locale)}&theme=${encodeURIComponent(state.theme)}`;
  };

  const syncPreferencesFromStorage = () => {
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale && data[storedLocale] && storedLocale !== state.locale) {
      setLocale(storedLocale);
    }

    const storedTheme = localStorage.getItem("theme");
    if ((storedTheme === "dark" || storedTheme === "light") && storedTheme !== state.theme) {
      setTheme(storedTheme);
    }
  };

  const buildMediaItems = (project) => {
    const items = [];
    if (project.videoAsset) {
      items.push({
        type: "video",
        src: project.videoAsset,
        alt: `${project.name} video`,
      });
    }
    (project.screenshots || []).forEach((shot) => {
      items.push({
        type: "image",
        src: shot,
        alt: `${project.name} screenshot`,
      });
    });
    return items;
  };

  const renderProject = () => {
    const { strings, projects } = data[state.locale];
    const project = projects.find((item) => item.id === projectId);

    if (!project) {
      document.title = strings.projectNotFoundTitle;
      if (elements.projectTitle) elements.projectTitle.textContent = strings.projectNotFoundTitle;
      if (elements.projectDescription) {
        elements.projectDescription.textContent = strings.pageNotFoundSubtitle;
      }
      if (elements.projectCover) {
        elements.projectCover.innerHTML = `
          <div class="placeholder project-cover-placeholder">
            <span class="text-2xl">${photoIcon()}</span>
            <span class="text-sm font-semibold">${strings.coverImageComingSoon}</span>
          </div>`;
      }
      if (elements.projectLinks) elements.projectLinks.innerHTML = "";
      if (elements.projectFeatures) elements.projectFeatures.innerHTML = "";
      if (elements.projectTech) elements.projectTech.innerHTML = "";
      if (elements.projectGallery) elements.projectGallery.innerHTML = "";
      state.mediaItems = [];
      return;
    }

    document.title = `${project.name} • ${strings.appTitle}`;

    if (elements.projectTitle) elements.projectTitle.textContent = project.name;
    if (elements.projectDescription) {
      elements.projectDescription.textContent = project.fullDescription;
    }

    if (elements.projectCover) {
      elements.projectCover.innerHTML = project.coverImage
        ? `<img src="${project.coverImage}" alt="${project.name}" class="project-cover-media" />`
        : `
          <div class="placeholder project-cover-placeholder">
            <span class="text-2xl">${photoIcon()}</span>
            <span class="text-sm font-semibold">${strings.coverImageComingSoon}</span>
          </div>`;
    }

    if (elements.projectLinks) {
      elements.projectLinks.innerHTML = renderStoreLinks(project, strings);
    }

    if (elements.projectFeatures) {
      elements.projectFeatures.innerHTML = project.features
        .map(
          (feature) => `
          <li class="flex items-start gap-3 text-start">
            <span class="text-accent">${checkIcon()}</span>
            <span class="text-muted leading-relaxed">${feature}</span>
          </li>`
        )
        .join("");
    }

    if (elements.projectTech) {
      elements.projectTech.innerHTML = (project.techTags || getProjectCategories(project))
        .map((tag) => `<span class="chip">${tag}</span>`)
        .join("");
    }

    state.mediaItems = buildMediaItems(project);

    if (elements.projectGallery) {
      if (!state.mediaItems.length) {
        elements.projectGallery.innerHTML = `<p class="text-muted">${strings.screenshotsComingSoon}</p>`;
      } else {
        elements.projectGallery.innerHTML = state.mediaItems
          .map((item, index) => {
            if (item.type === "video") {
              return `
                <video
                  class="project-media"
                  data-media-index="${index}"
                  data-media-type="video"
                  tabindex="0"
                  role="button"
                  aria-label="${item.alt}"
                  preload="metadata"
                  src="${item.src}"
                ></video>`;
            }
            return `
              <img
                src="${item.src}"
                alt="${item.alt}"
                class="project-media"
                data-media-index="${index}"
                data-media-type="image"
                tabindex="0"
                role="button"
              />`;
          })
          .join("");
        bindGalleryEvents();
      }
    }
  };

  const bindGalleryEvents = () => {
    if (!elements.projectGallery) return;
    elements.projectGallery.querySelectorAll("[data-media-index]").forEach((el) => {
      el.addEventListener("click", () => {
        openMedia(Number(el.dataset.mediaIndex || 0));
      });
      el.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openMedia(Number(el.dataset.mediaIndex || 0));
        }
      });
    });
  };

  const renderContact = (profile, strings) => {
    if (!elements.contactGrid) return;
    elements.contactGrid.innerHTML = `
      <div class="hover-card card-pad text-start flex flex-col gap-4">
        <h3 class="text-xl font-semibold">${strings.whatsappTitle}</h3>
        <p class="text-muted">+201015258644</p>
        <a class="btn btn-accent w-fit" href="${social.whatsapp}" target="_blank" rel="noopener">
          <img src="assets/images/whatsapp.png" alt="${strings.whatsappTitle}" class="w-5 h-5" />
          ${strings.openWhatsApp}
        </a>
      </div>
      <div class="hover-card card-pad text-start flex flex-col gap-4">
        <h3 class="text-xl font-semibold">${strings.emailTitle}</h3>
        <p class="text-muted">${profile.email}</p>
        <a class="btn btn-accent w-fit" href="mailto:${profile.email}">
          ${mailIcon()}
          ${strings.sendEmail}
        </a>
      </div>
      <div class="hover-card card-pad text-start flex flex-col gap-4">
        <h3 class="text-xl font-semibold">${strings.githubTitle}</h3>
        <p class="text-muted">${profile.github}</p>
        <a class="btn btn-outline w-fit" href="${social.github}" target="_blank" rel="noopener">
          ${codeIcon()}
          ${strings.visitGithub}
        </a>
      </div>
    `;
  };

  const renderStoreLinks = (project, strings) => {
    const links = [];
    if (project.playStoreUrl) {
      links.push(storeButton(project.playStoreUrl, strings.googlePlay, googlePlayIcon()));
    }
    if (project.appStoreUrl) {
      links.push(storeButton(project.appStoreUrl, strings.appStore, appStoreIcon()));
    }
    if (project.testFlightUrl) {
      links.push(
        storeButton(project.testFlightUrl, strings.testFlight, testFlightIcon())
      );
    }
    if (project.apkUrl) {
      links.push(storeButton(project.apkUrl, strings.downloadApk, downloadIcon()));
    }
    if (project.githubUrl) {
      links.push(storeButton(project.githubUrl, strings.githubTitle, githubBrandIcon()));
    }
    return links.join("");
  };

  const storeButton = (url, label, icon) => {
    return `
      <a class="btn btn-outline text-sm" href="${url}" target="_blank" rel="noopener">
        <span class="icon">${icon}</span>
        <span>${label}</span>
      </a>`;
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function createMediaModal() {
    const modal = document.createElement("div");
    modal.id = "media-modal";
    modal.className = "media-modal";
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
      <div class="media-modal__overlay" data-media-close></div>
      <div class="media-modal__dialog" role="dialog" aria-modal="true">
        <div class="media-modal__header">
          <div class="media-modal__counter" data-media-counter></div>
          <button class="btn-icon media-modal__close" data-media-close type="button">${closeIcon()}</button>
        </div>
        <div class="media-modal__viewport">
          <button class="btn-icon media-modal__nav prev" data-media-prev type="button">${chevronLeft()}</button>
          <div class="media-modal__frame" data-media-frame>
            <img class="media-modal__img" data-media-img alt="" />
            <video class="media-modal__video" data-media-video controls></video>
          </div>
          <button class="btn-icon media-modal__nav next" data-media-next type="button">${chevronRight()}</button>
        </div>
        <div class="media-modal__toolbar">
          <button class="btn btn-outline" data-media-zoom-out type="button">${minusIcon()}</button>
          <button class="btn btn-outline" data-media-zoom-reset type="button">100%</button>
          <button class="btn btn-outline" data-media-zoom-in type="button">${plusIcon()}</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const overlay = modal.querySelector("[data-media-close]");
    const closeBtn = modal.querySelector(".media-modal__close");
    const prevBtn = modal.querySelector("[data-media-prev]");
    const nextBtn = modal.querySelector("[data-media-next]");
    const frame = modal.querySelector("[data-media-frame]");
    const img = modal.querySelector("[data-media-img]");
    const video = modal.querySelector("[data-media-video]");
    const zoomOut = modal.querySelector("[data-media-zoom-out]");
    const zoomIn = modal.querySelector("[data-media-zoom-in]");
    const zoomReset = modal.querySelector("[data-media-zoom-reset]");
    const counter = modal.querySelector("[data-media-counter]");

    overlay.addEventListener("click", closeMedia);
    closeBtn.addEventListener("click", closeMedia);

    prevBtn.addEventListener("click", () => moveMedia(-1));
    nextBtn.addEventListener("click", () => moveMedia(1));

    zoomIn.addEventListener("click", () => adjustZoom(0.25));
    zoomOut.addEventListener("click", () => adjustZoom(-0.25));
    zoomReset.addEventListener("click", () => setZoom(1));

    frame.addEventListener("dblclick", () => {
      if (!isImageActive()) return;
      setZoom(modalState.zoom === 1 ? 2 : 1);
    });

    let touchStartX = 0;
    let touchStartY = 0;

    frame.addEventListener("touchstart", (event) => {
      if (!modalState.isOpen || event.touches.length !== 1) return;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    });

    frame.addEventListener("touchend", (event) => {
      if (!modalState.isOpen) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY)) {
        moveMedia(deltaX < 0 ? 1 : -1);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!modalState.isOpen) return;
      if (event.key === "Escape") {
        closeMedia();
        return;
      }
      if (event.key === "ArrowLeft") {
        moveMedia(-1);
      }
      if (event.key === "ArrowRight") {
        moveMedia(1);
      }
      if (event.key === "+" || event.key === "=") {
        adjustZoom(0.25);
      }
      if (event.key === "-") {
        adjustZoom(-0.25);
      }
      if (event.key === "0") {
        setZoom(1);
      }
    });

    return {
      container: modal,
      overlay,
      closeBtn,
      prevBtn,
      nextBtn,
      frame,
      img,
      video,
      zoomOut,
      zoomIn,
      zoomReset,
      counter,
    };
  }

  const isImageActive = () => {
    const item = state.mediaItems[modalState.index];
    return item && item.type === "image";
  };

  const openMedia = (index) => {
    if (!state.mediaItems.length) return;
    modalState.index = clamp(index, 0, state.mediaItems.length - 1);
    modalState.zoom = 1;
    modalState.isOpen = true;
    modal.container.classList.add("is-open");
    modal.container.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
    updateModalContent();
  };

  const closeMedia = () => {
    modalState.isOpen = false;
    modal.container.classList.remove("is-open");
    modal.container.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    if (modal.video) {
      modal.video.pause();
    }
  };

  const moveMedia = (direction) => {
    if (!state.mediaItems.length) return;
    const nextIndex = clamp(modalState.index + direction, 0, state.mediaItems.length - 1);
    if (nextIndex === modalState.index) return;
    modalState.index = nextIndex;
    modalState.zoom = 1;
    updateModalContent();
  };

  const updateModalContent = () => {
    if (!state.mediaItems.length) return;
    const item = state.mediaItems[modalState.index];

    modal.counter.textContent = `${modalState.index + 1} / ${state.mediaItems.length}`;

    if (item.type === "image") {
      modal.container.classList.remove("is-video");
      modal.video.pause();
      modal.video.removeAttribute("src");
      modal.video.style.display = "none";
      modal.img.style.display = "block";
      modal.img.style.width = "";
      modal.img.style.height = "";
      modalState.baseWidth = 0;
      modalState.baseHeight = 0;
      modal.img.src = item.src;
      modal.img.alt = item.alt;
      const applySizing = () => {
        updateBaseSize();
        setZoom(1);
      };
      if (modal.img.complete) {
        applySizing();
      } else {
        modal.img.onload = applySizing;
      }
    } else {
      modal.container.classList.add("is-video");
      modal.img.removeAttribute("src");
      modal.img.style.display = "none";
      modal.video.style.display = "block";
      modal.video.src = item.src;
    }

    modal.prevBtn.disabled = modalState.index === 0;
    modal.nextBtn.disabled = modalState.index === state.mediaItems.length - 1;
  };

  const adjustZoom = (delta) => {
    if (!isImageActive()) return;
    setZoom(modalState.zoom + delta);
  };

  const updateBaseSize = () => {
    if (!modal.img || !modal.frame) return;
    const frameWidth = modal.frame.clientWidth;
    const frameHeight = modal.frame.clientHeight;
    const naturalWidth = modal.img.naturalWidth || frameWidth;
    const naturalHeight = modal.img.naturalHeight || frameHeight;
    const scale = Math.min(frameWidth / naturalWidth, frameHeight / naturalHeight, 1);
    modalState.baseWidth = Math.max(1, Math.floor(naturalWidth * scale));
    modalState.baseHeight = Math.max(1, Math.floor(naturalHeight * scale));
  };

  const setZoom = (value) => {
    if (!isImageActive()) return;
    modalState.zoom = clamp(value, 1, 3);
    if (!modalState.baseWidth || !modalState.baseHeight) return;
    modal.img.style.width = `${modalState.baseWidth * modalState.zoom}px`;
    modal.img.style.height = `${modalState.baseHeight * modalState.zoom}px`;
    modal.zoomReset.textContent = `${Math.round(modalState.zoom * 100)}%`;
    requestAnimationFrame(() => {
      const frame = modal.frame;
      const img = modal.img;
      const maxScrollLeft = Math.max(0, img.scrollWidth - frame.clientWidth);
      const maxScrollTop = Math.max(0, img.scrollHeight - frame.clientHeight);
      frame.scrollLeft = maxScrollLeft / 2;
      frame.scrollTop = maxScrollTop / 2;
    });
  };

  const initToggles = () => {
    elements.langToggle.forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = state.locale === "ar" ? "en" : "ar";
        setLocale(next);
      });
    });

    elements.themeToggle.forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = state.theme === "dark" ? "light" : "dark";
        setTheme(next);
      });
    });
  };

  const initReveal = () => {
    const revealEls = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  };

  const initResizeHandler = () => {
    window.addEventListener("resize", () => {
      if (!modalState.isOpen || !isImageActive()) return;
      updateBaseSize();
      setZoom(modalState.zoom);
    });
  };

  modal = createMediaModal();
  setTheme(state.theme);
  setLocale(state.locale);
  initToggles();
  initReveal();
  initResizeHandler();

  window.addEventListener("storage", (event) => {
    if (event.key === "locale" || event.key === "theme") {
      syncPreferencesFromStorage();
    }
  });

  window.addEventListener("pageshow", () => {
    syncPreferencesFromStorage();
  });
})();
