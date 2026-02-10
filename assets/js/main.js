(() => {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  const root = document.documentElement;
  const body = document.body;

  const sections = ["home", "about", "skills", "experience", "projects", "contact"];

  const elements = {
    brand: document.querySelectorAll("[data-brand]"),
    heroTitle: document.getElementById("hero-title"),
    heroName: document.getElementById("hero-name"),
    heroSummary: document.getElementById("hero-summary"),
    heroLocation: document.getElementById("hero-location"),
    aboutText: document.getElementById("about-text"),
    educationInstitution: document.getElementById("education-institution"),
    educationDegree: document.getElementById("education-degree"),
    educationPeriod: document.getElementById("education-period"),
    highlightsList: document.getElementById("highlights-list"),
    skillsGrid: document.getElementById("skills-grid"),
    experienceList: document.getElementById("experience-list"),
    projectsGrid: document.getElementById("projects-grid"),
    contactGrid: document.getElementById("contact-grid"),
    footerBuilt: document.getElementById("footer-built"),
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
    currentFilter: "all",
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

    // Refresh project links so theme param stays in sync
    renderProjects(data[state.locale].projects, strings);
  };

  const setLocale = (locale) => {
    state.locale = locale;
    state.currentFilter = "all";
    root.lang = locale;
    root.dir = locale === "ar" ? "rtl" : "ltr";
    localStorage.setItem("locale", locale);

    const { strings, profile } = data[locale];
    document.title = strings.appTitle;

    elements.brand.forEach((el) => (el.textContent = profile.name));
    
    // Keep the typing animation text
    if (!elements.heroTitle.dataset.typed) {
      elements.heroTitle.textContent = profile.title;
    }
    
    elements.heroName.textContent = profile.name;
    elements.heroSummary.textContent = profile.summary;
    elements.heroLocation.textContent = profile.location;
    elements.aboutText.textContent = profile.about;
    elements.educationInstitution.textContent = profile.education.institution;
    elements.educationDegree.textContent = profile.education.degree;
    elements.educationPeriod.textContent = profile.education.period;
    if (elements.footerBuilt) {
      elements.footerBuilt.textContent = strings.builtWithFlutter;
    }

    renderHighlights(profile.highlights);
    renderSkills(data[locale].skillCategories);
    renderExperience(data[locale].experiences, strings);
    renderProjects(data[locale].projects, strings);
    renderContact(profile, strings);

    updateI18n(strings);
    updateLinks(profile, strings);
    updateLangToggle(strings, locale);
    updateFloatingContactLabel(strings);
    
    // Re-init typing after language change
    initTypingAnimation();
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

  const updateFloatingContactLabel = (strings) => {
    const btn = document.getElementById("floating-contact");
    if (!btn) return;
    const label = btn.querySelector(".floating-contact-label");
    if (label) label.textContent = strings.contact || "Contact";
    btn.setAttribute("aria-label", strings.contactTitle || strings.contact || "Contact");
  };

  const updateI18n = (strings) => {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (strings[key]) {
        el.textContent = strings[key];
      }
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.dataset.i18nTitle;
      if (strings[key]) {
        el.setAttribute("title", strings[key]);
        el.setAttribute("aria-label", strings[key]);
      }
    });
  };

  const updateLinks = (profile, strings) => {
    document.querySelectorAll("[data-download-cv]").forEach((el) => {
      el.setAttribute("href", "assets/cv/mohamed_mohy_cv.pdf");
      el.setAttribute("download", "");
    });

    document.querySelectorAll("[data-open-github]").forEach((el) => {
      el.setAttribute("href", social.github);
    });

    document.querySelectorAll("[data-open-whatsapp]").forEach((el) => {
      el.setAttribute("href", social.whatsapp);
    });

    document.querySelectorAll("[data-open-email]").forEach((el) => {
      el.setAttribute("href", `mailto:${profile.email}`);
    });

    const whatsappNumber = document.getElementById("whatsapp-number");
    if (whatsappNumber) whatsappNumber.textContent = "+201015258644";

    const emailValue = document.getElementById("email-value");
    if (emailValue) emailValue.textContent = profile.email;

    const githubValue = document.getElementById("github-value");
    if (githubValue) githubValue.textContent = profile.github;

    document.querySelectorAll("[data-open-whatsapp-label]").forEach((el) => {
      el.textContent = strings.openWhatsApp;
    });

    document.querySelectorAll("[data-open-email-label]").forEach((el) => {
      el.textContent = strings.sendEmail;
    });

    document.querySelectorAll("[data-open-github-label]").forEach((el) => {
      el.textContent = strings.visitGithub;
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

  const renderHighlights = (highlights) => {
    if (!elements.highlightsList) return;
    elements.highlightsList.innerHTML = highlights
      .map(
        (item) => `
        <li class="flex items-start gap-3 text-start">
          <span class="text-accent">${checkIcon()}</span>
          <span class="text-muted leading-relaxed">${item}</span>
        </li>`
      )
      .join("");
  };

  const renderSkills = (categories) => {
    if (!elements.skillsGrid) return;
    elements.skillsGrid.innerHTML = categories
      .map(
        (category) => `
        <div class="hover-card card-pad h-full flex flex-col gap-4">
          <h3 class="text-xl font-semibold">${category.title}</h3>
          <div class="flex flex-wrap gap-3">
            ${category.skills.map((skill) => `<span class="chip">${skill}</span>`).join("")}
          </div>
        </div>`
      )
      .join("");
  };

  const renderExperience = (experiences, strings) => {
    if (!elements.experienceList) return;
    elements.experienceList.innerHTML = experiences
      .map((exp, index) => {
        const isLast = index === experiences.length - 1;
        return `
        <div class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="timeline-dot"></div>
            ${isLast ? "" : `<div class="timeline-line"></div>`}
          </div>
          <div class="hover-card card-pad flex-1 text-start">
            <div class="flex flex-wrap items-center gap-3">
              <h3 class="text-xl font-semibold">${exp.role}</h3>
              ${exp.type ? `<span class="badge">${exp.type}</span>` : ""}
            </div>
            <p class="mt-2 font-semibold">${exp.company}</p>
            <p class="text-subtle text-sm mt-1">${exp.period}</p>
            <ul class="mt-4 flex flex-col gap-2">
              ${exp.highlights.map((h) => `<li class="flex items-start gap-2"><span class="text-accent">${arrowIcon()}</span><span class="text-muted">${h}</span></li>`).join("")}
            </ul>
          </div>
        </div>`;
      })
      .join("");
  };

  const getProjectCategories = (project) => {
    if (Array.isArray(project.categories) && project.categories.length) {
      return project.categories;
    }
    if (Array.isArray(project.techTags)) return project.techTags;
    return [];
  };

  const renderProjects = (projects, strings) => {
    if (!elements.projectsGrid) return;
    
    // Add filter buttons
    const projectsSection = document.getElementById("projects");
    let filterTitle = projectsSection.querySelector(".filter-title");
    let filterContainer = projectsSection.querySelector(".filter-container");
    
    if (!filterContainer || !filterTitle) {
      const subtitle = projectsSection.querySelector(".text-muted");
      if (!filterTitle) {
        filterTitle = document.createElement("p");
        filterTitle.className = "filter-title text-sm font-semibold text-subtle mt-6";
        filterTitle.setAttribute("data-i18n", "categoryFilterTitle");
        filterTitle.textContent = strings.categoryFilterTitle;
        subtitle.parentNode.insertBefore(filterTitle, subtitle.nextSibling);
      }
      if (!filterContainer) {
        filterContainer = document.createElement("div");
        filterContainer.className = "filter-container flex flex-wrap gap-2 justify-center mt-3";
        filterTitle.parentNode.insertBefore(filterContainer, filterTitle.nextSibling);
      }
    }
    
    // Get all unique categories
    const allTags = new Set();
    projects.forEach((p) => getProjectCategories(p).forEach((tag) => allTags.add(tag)));
    const tags = ["all", ...Array.from(allTags).sort()];
    
    filterContainer.innerHTML = tags.map(tag => `
      <button class="filter-btn ${state.currentFilter === tag ? 'active' : ''}" data-filter="${tag}">
        ${tag === "all" ? (state.locale === "ar" ? "الكل" : "All") : tag}
      </button>
    `).join("");
    
    // Add filter event listeners
    filterContainer.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.currentFilter = btn.dataset.filter;
        filterContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filterProjects();
      });
    });
    
    renderProjectCards(projects, strings);
  };

  const renderProjectCards = (projects, strings) => {
    const filteredProjects =
      state.currentFilter === "all"
        ? projects
        : projects.filter((p) => getProjectCategories(p).includes(state.currentFilter));
    
    elements.projectsGrid.innerHTML = filteredProjects
      .map((project) => {
        const cover = project.coverImage
          ? `<img src="${project.coverImage}" alt="${project.name}" class="h-44 w-full object-contain" />`
          : `
            <div class="placeholder h-44 flex flex-col items-center justify-center gap-2">
              <span class="text-2xl">${photoIcon()}</span>
              <span class="text-sm font-semibold">${strings.previewComingSoon}</span>
            </div>`;

        const storeLinks = renderStoreLinks(project, strings);

        return `
        <article class="hover-card card-pad flex flex-col gap-4 text-start project-card">
          <div class="overflow-hidden rounded-xl border border-divider">${cover}</div>
          <div>
            <h3 class="text-xl font-bold">${project.name}</h3>
            <p class="text-muted mt-2 leading-relaxed">${project.shortDescription}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            ${(project.techTags || getProjectCategories(project))
              .map((tag) => `<span class="chip">${tag}</span>`)
              .join("")}
          </div>
          ${storeLinks}
          <div>
            <a class="text-accent font-semibold" href="project.html?id=${project.id}&lang=${encodeURIComponent(state.locale)}&theme=${encodeURIComponent(state.theme)}">${strings.viewDetails}</a>
          </div>
        </article>`;
      })
      .join("");
      
    // Re-observe new cards for reveal animation
    initReveal();
  };

  const filterProjects = () => {
    const { strings, projects } = data[state.locale];
    renderProjectCards(projects, strings);
  };

  const renderStoreLinks = (project, strings) => {
    const links = [];
    if (project.playStoreUrl) {
      links.push(
        storeButton(project.playStoreUrl, strings.googlePlay, googlePlayIcon())
      );
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
    if (!links.length) return "";
    return `<div class="flex flex-wrap gap-2">${links.join("")}</div>`;
  };

  const storeButton = (url, label, icon) => {
    return `
      <a class="btn btn-outline text-sm" href="${url}" target="_blank" rel="noopener">
        <span class="icon">${icon}</span>
        <span>${label}</span>
      </a>`;
  };

  const renderContact = (profile, strings) => {
    if (!elements.contactGrid) return;
    elements.contactGrid.innerHTML = `
      <div class="hover-card card-pad text-start flex flex-col gap-4">
        <h3 class="text-xl font-semibold">${strings.whatsappTitle}</h3>
        <p class="text-muted" id="whatsapp-number">+201015258644</p>
        <a class="btn btn-accent w-fit" href="${social.whatsapp}" target="_blank" rel="noopener" data-open-whatsapp-label>
          <img src="assets/images/whatsapp.png" alt="${strings.whatsappTitle}" class="w-5 h-5" />
          ${strings.openWhatsApp}
        </a>
      </div>
      <div class="hover-card card-pad text-start flex flex-col gap-4">
        <h3 class="text-xl font-semibold">${strings.emailTitle}</h3>
        <p class="text-muted" id="email-value">${profile.email}</p>
        <a class="btn btn-accent w-fit" href="mailto:${profile.email}" data-open-email-label>
          ${mailIcon()}
          ${strings.sendEmail}
        </a>
      </div>
      <div class="hover-card card-pad text-start flex flex-col gap-4">
        <h3 class="text-xl font-semibold">${strings.githubTitle}</h3>
        <p class="text-muted" id="github-value">${profile.github}</p>
        <a class="btn btn-outline w-fit" href="${social.github}" target="_blank" rel="noopener" data-open-github-label>
          ${codeIcon()}
          ${strings.visitGithub}
        </a>
      </div>
    `;
  };

  const initNav = () => {
    const navLinks = document.querySelectorAll("[data-nav]");

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });

    const updateActive = () => {
      const offset = window.scrollY + 120;
      let active = sections[0];
      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= offset) {
          active = id;
        }
      });
      navLinks.forEach((link) => {
        if (link.dataset.nav === active) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    };

    window.addEventListener("scroll", updateActive);
    window.addEventListener("resize", updateActive);
    updateActive();
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

  const initMenu = () => {
    const openBtn = document.getElementById("menu-open");
    const closeBtn = document.getElementById("menu-close");
    const container = document.getElementById("mobile-menu");
    const overlay = document.getElementById("menu-overlay");
    const panel = document.getElementById("mobile-panel");

    if (!openBtn || !closeBtn || !container || !overlay || !panel) return;

    openBtn.addEventListener("click", () => {
      container.classList.remove("hidden");
      setTimeout(() => {
        panel.classList.remove("translate-x-full");
      }, 10);
    });

    closeBtn.addEventListener("click", closeMobileMenu);
    overlay.addEventListener("click", closeMobileMenu);
  };

  const closeMobileMenu = () => {
    const overlay = document.getElementById("mobile-menu");
    const panel = document.getElementById("mobile-panel");
    if (!overlay || !panel) return;
    panel.classList.add("translate-x-full");
    setTimeout(() => {
      overlay.classList.add("hidden");
    }, 200);
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

  // ✨ MAGIC FEATURES ✨

  // Typing Animation
  const initTypingAnimation = () => {
    const heroTitle = document.getElementById("hero-title");
    if (!heroTitle || heroTitle.dataset.typed) return;
    
    const { profile } = data[state.locale];
    const text = profile.title;
    heroTitle.textContent = "";
    heroTitle.dataset.typed = "true";
    
    let index = 0;
    const typeChar = () => {
      if (index < text.length) {
        heroTitle.textContent += text[index];
        index++;
        setTimeout(typeChar, 80);
      } else {
        heroTitle.classList.add("typing-done");
      }
    };
    
    setTimeout(typeChar, 500);
  };

  // Particle Background
  const initParticles = () => {
    const canvas = document.createElement("canvas");
    canvas.id = "particles-canvas";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "1";
    
    const homeSection = document.getElementById("home");
    if (!homeSection) return;
    
    const container = homeSection.querySelector(".container");
    if (container) {
      container.style.position = "relative";
      container.insertBefore(canvas, container.firstChild);
    }
    
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationId;
    
    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      
      draw() {
        ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const init = () => {
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle, i) => {
        particle.update();
        particle.draw();
        
        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.strokeStyle = `rgba(255, 215, 0, ${0.15 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
      animationId = requestAnimationFrame(animate);
    };
    
    resize();
    init();
    animate();
    
    window.addEventListener("resize", () => {
      resize();
      init();
    });
  };

  // Cursor Trail
  const initCursorTrail = () => {
    const canvas = document.createElement("canvas");
    canvas.id = "cursor-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const maxParticles = 20;
    
    class TrailParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;
        this.life = 1;
        this.decay = 0.02;
      }
      
      update() {
        this.life -= this.decay;
      }
      
      draw() {
        ctx.fillStyle = `rgba(255, 215, 0, ${this.life * 0.5})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      particles.push(new TrailParticle(mouseX, mouseY));
      if (particles.length > maxParticles) {
        particles.shift();
      }
    });
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  };

  // Floating Contact Button
  const initFloatingContact = () => {
    const btn = document.createElement("a");
    btn.id = "floating-contact";
    btn.className = "floating-contact-btn";
    btn.href = "#contact";
    btn.innerHTML = `
      <span class="floating-contact-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
        </svg>
      </span>
      <span class="floating-contact-label">Contact</span>
    `;
    btn.setAttribute("aria-label", "Contact");
    
    document.body.appendChild(btn);
    updateFloatingContactLabel(data[state.locale].strings);
    
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.getElementById("contact");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.hash = "#contact";
      }
    });
    
    // Show/hide on scroll
    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    });
  };

  // Loading Screen
  const initLoadingScreen = () => {
    const loader = document.createElement("div");
    loader.id = "page-loader";
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-spinner"></div>
        <p class="loader-text">Mohamed Mohy</p>
      </div>
    `;
    document.body.appendChild(loader);
    
    window.addEventListener("load", () => {
      setTimeout(() => {
        loader.classList.add("fade-out");
        setTimeout(() => {
          loader.remove();
        }, 500);
      }, 800);
    });
  };

  // Easter Egg - Konami Code
  const initKonamiCode = () => {
    const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let konamiIndex = 0;
    
    document.addEventListener("keydown", (e) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          triggerEasterEgg();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    });
  };

  const triggerEasterEgg = () => {
    // Create confetti effect
    const colors = ["#FFD700", "#FFA500", "#FF6347", "#4169E1", "#32CD32"];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 3 + 2) + "s";
        confetti.style.animationDelay = (Math.random() * 0.5) + "s";
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
      }, i * 20);
    }
    
    // Show message
    const message = document.createElement("div");
    message.className = "easter-egg-message";
    message.textContent = "🎉 You found the secret! 🎉";
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.classList.add("show");
    }, 100);
    
    setTimeout(() => {
      message.classList.remove("show");
      setTimeout(() => message.remove(), 500);
    }, 3000);
  };

  const iconWrapper = (path) =>
    `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

  const checkIcon = () => iconWrapper("<path d=\"M20 6 9 17l-5-5\"></path>");
  const arrowIcon = () => iconWrapper("<path d=\"M5 12h14\"></path><path d=\"m13 5 7 7-7 7\"></path>");
  const googlePlayIcon = () => "<i class=\"fa-brands fa-google-play\" aria-hidden=\"true\"></i>";
  const appStoreIcon = () => "<i class=\"fa-brands fa-apple\" aria-hidden=\"true\"></i>";
  const testFlightIcon = () => "<i class=\"fa-brands fa-apple\" aria-hidden=\"true\"></i>";
  const githubBrandIcon = () => "<i class=\"fa-brands fa-github\" aria-hidden=\"true\"></i>";
  const downloadIcon = () => iconWrapper("<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><path d=\"M7 10l5 5 5-5\"></path><path d=\"M12 15V3\"></path>");
  const codeIcon = () => iconWrapper("<path d=\"M16 18 22 12 16 6\"></path><path d=\"M8 6 2 12 8 18\"></path>");
  const mailIcon = () => iconWrapper("<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"></rect><path d=\"M3 7l9 6 9-6\"></path>");
  const photoIcon = () => iconWrapper("<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"></rect><circle cx=\"8.5\" cy=\"9\" r=\"1.5\"></circle><path d=\"M21 15l-5-5L5 21\"></path>");
  const sunIcon = () => iconWrapper("<circle cx=\"12\" cy=\"12\" r=\"4\"></circle><path d=\"M12 2v2\"></path><path d=\"M12 20v2\"></path><path d=\"M4.93 4.93l1.41 1.41\"></path><path d=\"M17.66 17.66l1.41 1.41\"></path><path d=\"M2 12h2\"></path><path d=\"M20 12h2\"></path><path d=\"M4.93 19.07l1.41-1.41\"></path><path d=\"M17.66 6.34l1.41-1.41\"></path>");
  const moonIcon = () => iconWrapper("<path d=\"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z\"></path>");

  // Initialize everything
  setTheme(state.theme);
  setLocale(state.locale);
  initToggles();
  initMenu();
  initNav();
  initReveal();
  
  // Initialize magic features
  initTypingAnimation();
  initParticles();
  initCursorTrail();
  initFloatingContact();
  initLoadingScreen();
  initKonamiCode();

  window.addEventListener("storage", (event) => {
    if (event.key === "locale" || event.key === "theme") {
      syncPreferencesFromStorage();
    }
  });

  window.addEventListener("pageshow", () => {
    syncPreferencesFromStorage();
  });
})();
