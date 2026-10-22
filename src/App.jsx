import { useEffect, useRef, useState } from "react";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeWorkFilter, setActiveWorkFilter] = useState("all");
  const [theme, setTheme] = useState(() => (
    window.localStorage.getItem("portfolio-theme") === "light" ? "light" : "dark"
  ));
  const menuToggleRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const pathname = window.location.pathname;
  const currentPage = pathname.endsWith("/work.html")
    ? "work"
    : pathname.endsWith("/about.html")
      ? "about"
      : pathname.endsWith("/contact.html")
        ? "contact"
        : "home";
  const serviceOptions = [
    "SaaS & workflow support",
    "Web app or internal tool",
    "Business website",
    "E-commerce storefront",
    "Data & process improvement",
    "Other / not sure yet",
  ];
  const requestedService = new URLSearchParams(window.location.search).get("service") || "";
  const selectedService = serviceOptions.includes(requestedService) ? requestedService : "";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    let animationFrame = 0;
    const updateScrollProgress = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0
          ? (window.scrollY / scrollableHeight) * 100
          : 0;

        document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
      });
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
      document.documentElement.style.removeProperty("--scroll-progress");
    };
  }, []);

  function handleEnquirySubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const service = String(formData.get("service") || "Project enquiry").trim();
    const budget = String(formData.get("budget") || "Not specified").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = "Portfolio enquiry: " + service;
    const body = [
      "Hello Akash,",
      "",
      "I would like to discuss a project.",
      "",
      "Name: " + name,
      "Email: " + email,
      "Project type: " + service,
      "Estimated budget: " + budget,
      "",
      "Project details:",
      message,
      "",
      "Sent from the AKASH / WORKS portfolio enquiry form.",
    ].join("\n");

    window.location.href = "mailto:abhsingh76@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }
  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <div className="reading-progress" aria-hidden="true" />
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="nav-wrap">
        <nav
          className="nav container"
          aria-label="Main navigation"
          onKeyDown={(event) => {
            if (event.key === "Escape" && menuOpen) {
              closeMenu();
              menuToggleRef.current?.focus();
            }
          }}
        >
          <a className="brand" href="/" aria-label="Akash home">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 48 48" focusable="false">
                <path d="M11 34 23.5 10 36 34M16 25h15" />
                <circle cx="36" cy="12" r="3" />
              </svg>
            </span>
            <span>AKASH <span className="brand-slash">/</span> WORKS</span>
          </a>
          <button
            ref={menuToggleRef}
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="navLinks"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            {menuOpen ? "×" : "☰"}
          </button>
          <div className={`nav-links${menuOpen ? " open" : ""}`} id="navLinks">
            <a href="/" aria-current={currentPage === "home" ? "page" : undefined} onClick={closeMenu}>Home</a>
            <a href={currentPage === "home" ? "#work" : "/work.html"} aria-current={currentPage === "work" ? "page" : undefined} onClick={closeMenu}>Work</a>
            <a href={currentPage === "home" ? "#about" : "/about.html"} aria-current={currentPage === "about" ? "page" : undefined} onClick={closeMenu}>About</a>
            <a href={currentPage === "home" ? "#skills" : "/about.html#skills"} onClick={closeMenu}>Skills</a>
            <a href={currentPage === "home" ? "#services" : "/#services"} onClick={closeMenu}>Services</a>
            <a href={currentPage === "home" ? "#contact" : "/contact.html"} className="nav-cta" aria-current={currentPage === "contact" ? "page" : undefined} onClick={closeMenu}>Let's talk <span>↗</span></a>
            <button
              className="theme-toggle"
              type="button"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              aria-pressed={theme === "light"}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              onClick={() => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark")}
            >
              <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </nav>
      </header>

      <main className={`page page-${currentPage}`} id="main-content" tabIndex="-1">
        {currentPage === "home" && (
          <>
        <section className="hero container" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot" /> OPEN TO CAREER ROLES &amp; FREELANCE PROJECTS</div>
            <h1>Good ideas.<br />Useful systems.<br /><span className="gradient-text">Real-world impact.</span></h1>
            <p className="hero-sub">SAAS IMPLEMENTATION · PRODUCT BUILDING · WEB EXPERIENCES</p>
            <p className="hero-desc">I bridge business needs and technology—from implementing SaaS workflows with teams to building practical digital products for freelance clients.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">Explore selected work <span>↘</span></a>
              <a className="button button-quiet" href="#contact">Discuss a role or project <span>↗</span></a>
              <a className="button button-quiet" href="/resume.pdf" download="Akash-Singh-Resume.pdf">Download résumé <span>↓</span></a>
            </div>
            <div className="hero-meta">
              <div><strong>Career opportunities</strong><span>SaaS · Implementation · Product</span></div>
              <div><strong>Freelance projects</strong><span>Web apps · Websites · Workflows</span></div>
            </div>
          </div>
          <div className="hero-visual" role="img" aria-label="Abstract product dashboard illustration">
            <div className="orbit orbit-a" />
            <div className="orbit orbit-b" />
            <div className="visual-label label-top"><span className="tiny-square" /> SYSTEMS THINKING</div>
            <div className="dashboard-card">
              <div className="dash-top">
                <div className="window-dots"><i /><i /><i /></div>
                <span>WORKSPACE / OVERVIEW</span>
                <span className="dash-menu">···</span>
              </div>
              <div className="dash-body">
                <div className="dash-title">Everything in sync<span className="live-pill">UI CONCEPT</span></div>
                <div className="dash-stats">
                  <div><span>Programs</span><strong>Multi</strong><small>Program mapping</small></div>
                  <div><span>Constraints</span><strong>Rules</strong><small>Rule checks</small></div>
                </div>
                <div className="chart-area">
                  <div className="chart-grid" />
                  <svg viewBox="0 0 360 120" aria-hidden="true">
                    <defs>
                      <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor="#8b7bff" stopOpacity=".35" />
                        <stop offset="1" stopColor="#8b7bff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 96 C25 88 34 93 52 74 S87 88 111 58 S151 71 176 48 S214 64 240 35 S282 50 303 24 S337 35 360 8 L360 120 L0 120Z" fill="url(#area)" />
                    <path d="M0 96 C25 88 34 93 52 74 S87 88 111 58 S151 71 176 48 S214 64 240 35 S282 50 303 24 S337 35 360 8" fill="none" stroke="#a99bff" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="dash-footer"><span><i className="legend-purple" /> Performance</span><span>Illustrative visual <b>⌄</b></span></div>
              </div>
            </div>
            <div className="floating-chip chip-one"><span className="chip-icon">↗</span><div><strong>Built for impact</strong><small>Practical solutions</small></div></div>
            <div className="floating-chip chip-two"><span className="chip-icon chip-green">✓</span><div><strong>Ready to improve</strong><small>Iterate with purpose</small></div></div>
            <div className="visual-label label-bottom">IDEAS → IMPLEMENTATION → IMPACT</div>
          </div>
        </section>

        <section className="ticker" aria-label="Areas of focus">
          <div className="ticker-track">
            <span>PRODUCT IMPLEMENTATION</span><b aria-hidden="true">✳</b><span>FULL-STACK PROJECTS</span><b aria-hidden="true">✳</b><span>PROCESS AUTOMATION</span><b aria-hidden="true">✳</b><span>EDTECH SYSTEMS</span><b aria-hidden="true">✳</b>
            <span aria-hidden="true">PRODUCT IMPLEMENTATION</span><b aria-hidden="true">✳</b><span aria-hidden="true">FULL-STACK PROJECTS</span><b aria-hidden="true">✳</b><span aria-hidden="true">PROCESS AUTOMATION</span><b aria-hidden="true">✳</b>
          </div>
        </section>
            <section className="home-overview container" aria-labelledby="overview-title">
              <div className="home-overview-heading">
                <p className="section-kicker">A QUICK INTRODUCTION</p>
                <h2 id="overview-title">Thoughtful work,<br /><span className="muted-heading">made useful.</span></h2>
              </div>
              <div className="home-route-grid">
                <a className="home-route-card" href="#work">
                  <span className="home-route-index">01 / SELECTED WORK</span>
                  <strong>See what I build</strong>
                  <span>Explore products and digital experiences.</span>
                  <span className="home-route-arrow">↗</span>
                </a>
                <a className="home-route-card" href="#about">
                  <span className="home-route-index">02 / BACKGROUND</span>
                  <strong>How I think</strong>
                  <span>Learn how I connect people, process, and technology.</span>
                  <span className="home-route-arrow">↗</span>
                </a>
                <a className="home-route-card" href="#contact">
                  <span className="home-route-index">03 / GET IN TOUCH</span>
                  <strong>Let’s talk</strong>
                  <span>Start a conversation about a role or project.</span>
                  <span className="home-route-arrow">↗</span>
                </a>
              </div>
            </section>
          </>
        )}

        {(currentPage === "work" || currentPage === "home") && <section className="section container work-section" id="work">
          <div className="section-heading">
            <div><p className="section-kicker">SELECTED WORK / 01</p>{currentPage === "work" ? <h1 className="section-title">Work that solves<br /><span className="muted-heading">real problems.</span></h1> : <h2>Work that solves<br /><span className="muted-heading">real problems.</span></h2>}</div>
            <p className="section-intro">A mix of hands-on builds and digital experiences spanning academic scheduling, education workflows, commerce, and automotive care.</p>
          </div>
          <div className="work-toolbar" aria-label="Filter projects">
            <div className="work-filters" role="group" aria-label="Filter projects by type">
              {[
                { id: "all", label: "All projects", count: 5 },
                { id: "web-apps", label: "Web apps", count: 2 },
                { id: "websites", label: "Websites", count: 3 },
                { id: "commerce", label: "Commerce", count: 1 },
              ].map((filter) => (
                <button
                  className={`work-filter${activeWorkFilter === filter.id ? " active" : ""}`}
                  type="button"
                  aria-pressed={activeWorkFilter === filter.id}
                  key={filter.id}
                  onClick={() => setActiveWorkFilter(filter.id)}
                >
                  {filter.label}<span>{filter.count}</span>
                </button>
              ))}
            </div>
            <p className="work-count" aria-live="polite">
              {activeWorkFilter === "all" ? "05 projects" : `${{ "web-apps": 2, websites: 3, commerce: 1 }[activeWorkFilter]} shown`}
            </p>
          </div>
          <div className="project-grid" data-filter={activeWorkFilter}>
            <article className="project-card project-featured" data-category="web-app">
              <div className="project-art timetable-art">
                <div className="art-top"><span className="art-brand">scheduly<span>.</span></span><span className="art-tag">01 / SCHEDULING</span></div>
                <div className="mini-calendar">
                  <div className="calendar-side"><b>WEEKLY</b><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span></div>
                  <div className="calendar-grid">
                    <div className="cal-cell"><b>09:00</b><span className="slot slot-purple">BBA · ENT</span><span className="slot slot-blue">PGDM</span></div>
                    <div className="cal-cell"><b>10:00</b><span className="slot slot-green">BBA · COM</span><span className="slot slot-purple">BBA · IM</span></div>
                    <div className="cal-cell"><b>11:00</b><span className="slot slot-blue">PGDM</span><span className="slot slot-pink">Faculty 04</span></div>
                    <div className="cal-cell"><b>12:00</b><span className="slot slot-pink">BBA · ENT</span><span className="slot slot-green">BBA · COM</span></div>
                  </div>
                </div>
                <div className="art-caption">A smarter way to plan academic schedules.</div>
              </div>
              <div className="project-content">
                <div className="project-meta"><span>FULL-STACK WEB APP</span><span>PROJECT 01</span></div>
                <h3>Scheduly — Timetable Generator</h3>
                <p>Academic scheduling with program/semester mapping, faculty and room constraints, holiday management, validation, publishing, and timetable portals.</p>
                <div className="tag-list"><span>React</span><span>Node.js</span><span>Express</span><span>MongoDB</span></div>
                <details className="project-details"><summary>Case study: constraints &amp; approach</summary><div className="case-study"><p><strong>Problem</strong> Academic timetables need to coordinate multiple programs, semesters, period timings, faculty, sections, rooms, and holidays.</p><p><strong>Approach</strong> Model the academic setup and validate scheduling constraints, then make conflicts and unscheduled sessions easier to investigate.</p><p><strong>Capabilities</strong> Program/semester mapping, faculty and room conflict checks, holiday handling, publishing, and role-specific timetable portals.</p></div></details>
                <div className="project-links"><a href="https://time-table-beige-three.vercel.app" target="_blank" rel="noreferrer">Live product <span>↗</span></a></div>
              </div>
            </article>
            <article className="project-card" data-category="web-app">
              <div className="project-art results-art">
                <div className="results-window">
                  <div className="results-head"><span>RESULTS OVERVIEW</span><span>•••</span></div>
                  <div className="result-number"><small>Illustrative result card</small><strong>SGPA <em>preview</em></strong><div className="result-bars"><i style={{ height: "45%" }} /><i style={{ height: "68%" }} /><i style={{ height: "55%" }} /><i style={{ height: "82%" }} /><i style={{ height: "72%" }} /><i style={{ height: "96%" }} /><i style={{ height: "77%" }} /><i style={{ height: "88%" }} /></div></div>
                  <div className="result-row"><span>Workflow status</span><b>Demo state</b></div>
                </div>
              </div>
              <div className="project-content">
                <div className="project-meta"><span>EDTECH / ERP</span><span>PROJECT 02</span></div>
                <h3>Result Generator</h3>
                <p>A result management workflow for student records, marks, SGPA/CGPA calculations, rank lists, Excel uploads, and result publishing.</p>
                <div className="tag-list"><span>React</span><span>Express</span><span>MongoDB</span><span>REST API</span></div>
                <details className="project-details"><summary>Case study: results workflow</summary><div className="case-study"><p><strong>Problem</strong> Academic result preparation requires student and subject records, marks entry or imports, grade calculations, verification, and publication to work together reliably.</p><p><strong>Approach</strong> Organize the process around academic records and repeatable steps, from marks input to result review and publishing.</p><p><strong>Capabilities</strong> Student and faculty records, marks imports, SGPA/CGPA calculations, rank lists, and result publishing workflows.</p></div></details>
                <div className="project-links"><a href="mailto:abhsingh76@gmail.com?subject=Request%20a%20Result%20Generator%20walkthrough">Request a walkthrough <span>↗</span></a></div>
              </div>
            </article>
            <article className="project-card" data-category="website">
              <div className="project-art detailing-art">
                <svg className="detailing-visual" viewBox="0 0 720 440" role="img" aria-label="Illustration of a polished car in a dark green detailing studio" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="detail-background" x1="0" y1="0" x2="1" y2="1">
                      <stop stopColor="#102a27" />
                      <stop offset=".58" stopColor="#183b32" />
                      <stop offset="1" stopColor="#536349" />
                    </linearGradient>
                    <linearGradient id="detail-body" x1="0" y1="0" x2=".15" y2="1">
                      <stop stopColor="#edf0d7" />
                      <stop offset=".36" stopColor="#9db9a0" />
                      <stop offset=".68" stopColor="#526f64" />
                      <stop offset="1" stopColor="#243a36" />
                    </linearGradient>
                    <linearGradient id="detail-glass" x1="0" y1="0" x2="1" y2="1">
                      <stop stopColor="#a8c9b7" stopOpacity=".82" />
                      <stop offset=".45" stopColor="#294b46" stopOpacity=".94" />
                      <stop offset="1" stopColor="#172b2a" />
                    </linearGradient>
                    <radialGradient id="detail-glow">
                      <stop stopColor="#c5dba9" stopOpacity=".34" />
                      <stop offset="1" stopColor="#c5dba9" stopOpacity="0" />
                    </radialGradient>
                    <filter id="detail-shadow" x="-20%" y="-40%" width="140%" height="190%">
                      <feGaussianBlur stdDeviation="14" />
                    </filter>
                  </defs>
                  <path fill="url(#detail-background)" d="M0 0h720v440H0z" />
                  <ellipse cx="520" cy="130" rx="250" ry="220" fill="url(#detail-glow)" />
                  <path d="M0 334h720v106H0z" fill="#101b1c" fillOpacity=".65" />
                  <path d="M0 360h720M0 383h720M0 406h720" stroke="#d5e1c1" strokeOpacity=".08" />
                  <path d="M72 84h576M103 105h514" stroke="#e2e8cf" strokeOpacity=".08" />
                  <path d="M125 324c70-18 117-18 196-15 128 4 245 2 302 24 24 9 42 30 48 46H79c5-26 19-45 46-55Z" fill="#06100f" fillOpacity=".62" filter="url(#detail-shadow)" />
                  <path d="M91 294c15-28 44-49 86-62l65-19 54-60c15-17 34-27 59-29l111-3c25 0 43 8 62 24l72 62 54 20c29 11 43 29 47 57l3 34c1 13-9 23-22 23h-36a57 57 0 0 0-113 0H289a57 57 0 0 0-113 0h-62c-17 0-29-12-29-28v-6c0-6 2-10 6-13Z" fill="url(#detail-body)" stroke="#dce7ce" strokeOpacity=".68" strokeWidth="3" />
                  <path d="m261 205 50-54c12-13 27-19 46-20l54-2v77H261Zm169-76 45-1c20 0 34 6 50 20l60 53H430v-72Z" fill="url(#detail-glass)" stroke="#dce7ce" strokeOpacity=".58" strokeWidth="2" />
                  <path d="M421 133v72M268 210h324M127 278c34-23 83-34 129-38m44 69h218" fill="none" stroke="#f1f1d9" strokeOpacity=".65" strokeWidth="3" />
                  <path d="M99 284c21-9 48-15 75-18m400-3 62 16" fill="none" stroke="#f6edc7" strokeLinecap="round" strokeWidth="8" />
                  <path d="M591 278h45" stroke="#fff1c2" strokeLinecap="round" strokeWidth="5" />
                  <circle cx="232" cy="350" r="52" fill="#111a19" stroke="#d4dec4" strokeWidth="5" />
                  <circle cx="232" cy="350" r="34" fill="#30423d" stroke="#a5b69e" strokeWidth="3" />
                  <circle cx="232" cy="350" r="8" fill="#dce5c9" />
                  <path d="M232 317v66m-33-33h66m-56-23 46 46m0-46-46 46" stroke="#a9b9a2" strokeWidth="3" />
                  <circle cx="540" cy="350" r="52" fill="#111a19" stroke="#d4dec4" strokeWidth="5" />
                  <circle cx="540" cy="350" r="34" fill="#30423d" stroke="#a5b69e" strokeWidth="3" />
                  <circle cx="540" cy="350" r="8" fill="#dce5c9" />
                  <path d="M540 317v66m-33-33h66m-56-23 46 46m0-46-46 46" stroke="#a9b9a2" strokeWidth="3" />
                  <path d="M93 327h70m401 0h53" stroke="#eff0d5" strokeOpacity=".56" strokeWidth="2" />
                  <path d="m594 92 5 15 15 5-15 5-5 15-5-15-15-5 15-5 5-15Zm-75 45 3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9Z" fill="#e2e9cc" fillOpacity=".76" />
                  <text x="32" y="42" fill="#edf0da" fontFamily="monospace" fontSize="13" letterSpacing="2">THE DETAILING SHELTER</text>
                  <text x="32" y="414" fill="#e0e8d1" fillOpacity=".82" fontFamily="monospace" fontSize="11" letterSpacing="2">PRECISION · FINISH · PROTECTION</text>
                </svg>
              </div>
              <div className="project-content">
                <div className="project-meta"><span>AUTOMOTIVE / SERVICE WEBSITE</span><span>PROJECT 03</span></div>
                <h3>The Detailing Shelter</h3>
                <p>A customer-facing web experience for an automotive detailing brand, bringing its identity and services together.</p>
                <div className="tag-list"><span>Automotive</span><span>Service website</span><span>Responsive UI</span></div>
                <details className="project-details"><summary>Project highlights</summary><ul><li>Service-led presentation for an automotive brand</li><li>Brand-aligned visual design and page hierarchy</li><li>Responsive customer experience</li></ul></details>
                <div className="project-links"><a href="https://thedetailingshelter.in/" target="_blank" rel="noreferrer">Live website <span>↗</span></a></div>
              </div>
            </article>
            <article className="project-card" data-category="website commerce">
              <div className="project-art store-art"><div className="store-top"><span>MY SPECS / STUDIO</span><span>⌕　♡</span></div><div className="glasses"><div className="lens" /><div className="bridge" /><div className="lens" /></div><div className="store-bottom"><span>Find your frame.</span><span className="round-arrow">↗</span></div></div>
              <div className="project-content">
                <div className="project-meta"><span>COMMERCE CONCEPT</span><span>PROJECT 04</span></div>
                <h3>My Specs Store</h3>
                <p>An eyewear storefront concept focused on clear product discovery and a clean shopping experience.</p>
                <div className="tag-list"><span>Web design</span><span>E-commerce</span><span>Responsive UI</span></div>
                <details className="project-details"><summary>Project highlights</summary><ul><li>Eyewear catalogue and product discovery</li><li>Shopping cart and checkout journey</li><li>Storefront experience for online and cash-on-delivery orders</li></ul></details>
                <div className="project-links"><a href="https://my-specs-store.vercel.app" target="_blank" rel="noreferrer">Live website <span>↗</span></a></div>
              </div>
            </article>
            <article className="project-card project-wide" data-category="website">
              <div className="project-art vastu-art"><div className="vastu-sun" /><div className="vastu-copy"><span>SPACE · BALANCE · WELLBEING</span><strong>Tatvam<br />Vastu</strong><i>Thoughtful spaces, intentional living.</i></div><div className="vastu-lines" /></div>
              <div className="project-content">
                <div className="project-meta"><span>BRAND WEBSITE</span><span>PROJECT 05</span></div>
                <h3>Tatvam Vastu</h3>
                <p>A service-led website concept with a calm visual language, clear sections, and a focus on communicating trust.</p>
                <div className="tag-list"><span>UI / UX</span><span>CSS</span><span>Responsive design</span></div>
                <details className="project-details"><summary>Project highlights</summary><ul><li>Clear service information and page hierarchy</li><li>Calm visual language for a trust-led brand</li><li>Responsive service website structure</li></ul></details>
                <div className="project-links"><a href="https://tatvamvastu.com/" target="_blank" rel="noreferrer">Live website <span>↗</span></a></div>
              </div>
            </article>
          </div>
        </section>}

        {(currentPage === "about" || currentPage === "home") && <>
        <section className="about-section" id="about">
          <div className="container about-grid">
            <div><p className="section-kicker">A LITTLE ABOUT ME / 02</p>{currentPage === "about" ? <h1 className="section-title">Business context.<br /><span className="gradient-text">Builder mindset.</span></h1> : <h2>Business context.<br /><span className="gradient-text">Builder mindset.</span></h2>}</div>
            <div className="about-copy">
              <p className="about-lead">I connect people, processes, and technology.</p>
              <p>With a B.Tech background in Computer Science &amp; Engineering and experience in SaaS and EdTech implementation, I focus on understanding workflows, finding friction, and turning business requirements into systems people can use.</p>
              <p>My work combines implementation and stakeholder coordination with hands-on product building. Selected projects cover academic scheduling, result workflows, commerce, and customer-facing business websites.</p>
              <div className="about-facts"><div><strong>01</strong><span>Understand the problem</span></div><div><strong>02</strong><span>Design the workflow</span></div><div><strong>03</strong><span>Build and iterate</span></div></div>
              <div className="career-snapshot" aria-label="Career snapshot"><div><span>BACKGROUND</span><strong>B.Tech · Computer Science &amp; Engineering</strong></div><div><span>DOMAIN FOCUS</span><strong>SaaS &amp; EdTech implementation</strong></div><div><span>BUILDING WITH</span><strong>React · Node.js · MongoDB</strong></div></div>
            </div>
          </div>
        </section>

        <section className="section container" id="skills">
          <div className="section-heading">
            <div><p className="section-kicker">WHAT I BRING / 03</p><h2>Skills built around<br /><span className="muted-heading">getting things done.</span></h2></div>
            <p className="section-intro">A practical blend of implementation, product coordination, and hands-on development.</p>
          </div>
          <div className="skills-grid">
            <div className="skill-card"><div className="skill-icon">↗</div><h3>Implementation</h3><p>Requirement gathering, workflow mapping, configuration, onboarding, troubleshooting, and stakeholder coordination.</p><div className="skill-line"><span>01</span><span>MAKE IT WORK IN THE REAL WORLD</span></div></div>
            <div className="skill-card"><div className="skill-icon">{`{ }`}</div><h3>Web development</h3><p>React, JavaScript, Node.js, Express, REST APIs, MongoDB, and responsive interfaces.</p><div className="skill-line"><span>02</span><span>FROM INTERFACE TO API</span></div></div>
            <div className="skill-card"><div className="skill-icon">⌘</div><h3>Systems &amp; data</h3><p>Data imports, validation, reporting workflows, academic systems, and process improvement.</p><div className="skill-line"><span>03</span><span>STRUCTURE THAT SCALES</span></div></div>
            <div className="skill-card"><div className="skill-icon">✳</div><h3>Product thinking</h3><p>Usability, iterative improvement, clear navigation, practical features, and reliable delivery.</p><div className="skill-line"><span>04</span><span>USEFUL OVER UNNECESSARY</span></div></div>
          </div>
        </section>
        </>}

        {currentPage === "home" && <section className="section container services-section" id="services" aria-labelledby="services-title">
          <div className="section-heading">
            <div><p className="section-kicker">PRACTICAL WAYS I CAN HELP / 05</p><h2 id="services-title">Good work starts<br /><span className="muted-heading">with a clear need.</span></h2></div>
            <p className="section-intro">Focused support for teams and businesses that need clearer workflows, a useful web experience, or a practical digital tool.</p>
          </div>
          <div className="services-grid">
            <article className="service-card"><span className="service-index">01 / IMPLEMENTATION</span><div className="service-icon" aria-hidden="true">↗</div><h3>SaaS &amp; workflow support</h3><p>Map requirements, clarify user journeys, support configuration and onboarding, and make operational handoffs easier to follow.</p><a href="/contact.html?service=SaaS%20%26%20workflow%20support">Discuss this service <span>↗</span></a></article>
            <article className="service-card"><span className="service-index">02 / WEB APPS</span><div className="service-icon" aria-hidden="true">{ "{ }" }</div><h3>Web apps &amp; internal tools</h3><p>Plan and build practical dashboards, data-entry flows, portals, and reporting tools around a defined business process.</p><a href="/contact.html?service=Web%20app%20or%20internal%20tool">Discuss this service <span>↗</span></a></article>
            <article className="service-card"><span className="service-index">03 / WEB PRESENCE</span><div className="service-icon" aria-hidden="true">✳</div><h3>Business websites &amp; stores</h3><p>Create responsive, brand-aligned websites and storefront experiences with clear navigation and customer journeys.</p><a href="/contact.html?service=Business%20website">Discuss this service <span>↗</span></a></article>
            <article className="service-card"><span className="service-index">04 / DATA WORKFLOWS</span><div className="service-icon" aria-hidden="true">⌘</div><h3>Data &amp; process improvement</h3><p>Organize import, validation, and reporting steps to reduce avoidable manual work and make exceptions easier to spot.</p><a href="/contact.html?service=Data%20%26%20process%20improvement">Discuss this service <span>↗</span></a></article>
          </div>
        </section>}
        {currentPage === "home" && <section className="section container collaboration-section" aria-labelledby="collaboration-title">
          <div className="section-heading"><div><p className="section-kicker">WAYS TO WORK TOGETHER / 04</p><h2 id="collaboration-title">Two ways to create<br /><span className="muted-heading">useful impact.</span></h2></div><p className="section-intro">I’m open to both full-time opportunities and focused, project-based collaborations.</p></div>
          <div className="collaboration-grid">
            <article className="collaboration-card"><span className="collaboration-number">01 / CAREER</span><h3>Join a team</h3><p>Bring structured implementation, stakeholder coordination, SaaS workflows, and a product-minded approach to delivery.</p><a href="mailto:abhsingh76@gmail.com?subject=Career%20opportunity">Discuss a role <span>↗</span></a></article>
            <article className="collaboration-card"><span className="collaboration-number">02 / FREELANCE</span><h3>Build a useful solution</h3><p>Collaborate on responsive websites, practical web apps, and clearer workflows for a real business need.</p><a href="mailto:abhsingh76@gmail.com?subject=Freelance%20project">Discuss a project <span>↗</span></a></article>
          </div>
        </section>}

        {(currentPage === "contact" || currentPage === "home") && <section className="contact-section" id="contact">
          <div className="container contact-inner">
            <p className="section-kicker">CAREER OPPORTUNITIES &amp; FREELANCE / 04</p>
            {currentPage === "contact" ? <h1 className="section-title">Let’s make something<br /><span className="gradient-text">that matters.</span></h1> : <h2>Let’s make something<br /><span className="gradient-text">that matters.</span></h2>}
            <p>I’m open to career opportunities and freelance collaborations in SaaS implementation, web products, and workflow improvement.</p>
            <div className="contact-actions"><a className="button button-primary" href="mailto:abhsingh76@gmail.com?subject=Let%27s%20connect">Email me <span>↗</span></a><a className="button button-whatsapp" href="https://wa.me/919956191939" target="_blank" rel="noreferrer">WhatsApp me <span>↗</span></a></div>
          </div>
          {currentPage === "contact" && <div className="container enquiry-wrap" id="project-enquiry">
            <div className="enquiry-intro"><p className="section-kicker">FREELANCE PROJECT ENQUIRY</p><h2>Tell me a little<br /><span className="muted-heading">about the work.</span></h2><p>Share the basics so I can understand what you need and prepare for a useful first conversation.</p></div>
            <form className="enquiry-form" onSubmit={handleEnquirySubmit}>
              <div className="enquiry-fields enquiry-fields-two">
                <div className="enquiry-field"><label htmlFor="enquiry-name">Your name</label><input id="enquiry-name" name="name" type="text" autoComplete="name" placeholder="Name" maxLength={100} required /></div>
                <div className="enquiry-field"><label htmlFor="enquiry-email">Email address</label><input id="enquiry-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" maxLength={160} required /></div>
              </div>
              <div className="enquiry-fields enquiry-fields-two">
                <div className="enquiry-field"><label htmlFor="enquiry-service">What do you need?</label><select id="enquiry-service" name="service" defaultValue={selectedService} required><option value="" disabled>Select a service</option><option>SaaS &amp; workflow support</option><option>Web app or internal tool</option><option>Business website</option><option>E-commerce storefront</option><option>Data &amp; process improvement</option><option>Other / not sure yet</option></select></div>
                <div className="enquiry-field"><label htmlFor="enquiry-budget">Estimated budget (optional)</label><select id="enquiry-budget" name="budget" defaultValue=""><option value="">Not decided yet</option><option>Under ₹25,000</option><option>₹25,000–₹75,000</option><option>₹75,000+</option><option>Need help estimating</option></select></div>
              </div>
              <div className="enquiry-field"><label htmlFor="enquiry-message">Project brief</label><textarea id="enquiry-message" name="message" placeholder="What are you trying to improve or build? Include any key requirements or target date." rows={5} maxLength={1500} required /></div>
              <div className="enquiry-submit-row"><button className="button button-primary" type="submit">Prepare enquiry email <span>↗</span></button><p>Your email app will open with a draft addressed to Akash. Nothing is sent automatically.</p></div>
            </form>
          </div>}
        </section>}
      </main>

      <footer className="footer container">
        <a className="brand" href="/" aria-label="Akash home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" focusable="false">
              <path d="M11 34 23.5 10 36 34M16 25h15" />
              <circle cx="36" cy="12" r="3" />
            </svg>
          </span>
          <span>AKASH <span className="brand-slash">/</span> WORKS</span>
        </a>
        <a href="/">Back to home ↑</a>
        <span className="copyright">© <span>{currentYear}</span> Akash Singh</span>
      </footer>
    </>
  );
}

export default App;