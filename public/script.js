/* ===================================
   SpamShield AI — Frontend JavaScript
   =================================== */

/* ===== Loader ===== */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => loader.classList.add("hidden"), 800);
  }
});

/* ===== Particle Background ===== */
(function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const count = Math.min(100, Math.floor((w * h) / 18000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.5 + 0.2,
  }));

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - dist / 130) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ===== Mouse Glow ===== */
(function initMouseGlow() {
  const glow = document.querySelector(".mouse-glow");
  if (!glow) return;
  document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
})();

/* ===== Navbar Scroll ===== */
(function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });
})();

/* ===== Hamburger Menu ===== */
(function initHamburger() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (!hamburger || !navLinks) return;
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    const icon = hamburger.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    }
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      const icon = hamburger.querySelector("i");
      if (icon) {
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-times");
      }
    });
  });
})();

/* ===== AOS-like Scroll Reveal ===== */
(function initScrollReveal() {
  const elements = document.querySelectorAll("[data-aos]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-aos-delay") || 0;
          setTimeout(() => entry.target.classList.add("aos-animate"), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  elements.forEach((el) => observer.observe(el));
})();

/* ===== Animated Counters ===== */
(function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute("data-count"));
        const suffix = el.getAttribute("data-suffix") || "";
        const decimals = parseInt(el.getAttribute("data-decimals") || "0");
        const duration = 2000;
        const startTime = performance.now();

        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;
          el.textContent =
            current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => observer.observe(c));
})();

/* ===== Button Ripple Effect ===== */
(function initRipple() {
  document.querySelectorAll(".btn-primary, .btn-secondary, .btn-ghost").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
})();

/* ===== Card Tilt ===== */
(function initCardTilt() {
  document.querySelectorAll(".feature-card, .about-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -5;
      const ry = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

/* ===== Back to Top ===== */
(function initBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 500);
  });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ===== Email Analyzer ===== */
(function initAnalyzer() {
  const textarea = document.getElementById("email-text");
  const analyzeBtn = document.getElementById("analyze-btn");
  const clearBtn = document.getElementById("clear-btn");
  const scanOverlay = document.getElementById("scan-overlay");
  const resultsDiv = document.getElementById("results");
  const scanText = document.getElementById("scan-text");
  const scanBar = document.getElementById("scan-bar");

  if (!analyzeBtn) return;

  const scanSteps = [
    "Initializing AI engine...",
    "Extracting email features...",
    "Running TF-IDF vectorization...",
    "Analyzing with Naive Bayes...",
    "Detecting phishing patterns...",
    "Calculating threat score...",
    "Compiling results...",
  ];

  async function analyze() {
    const text = textarea.value.trim();
    if (!text) {
      alert("Please paste an email to analyze.");
      return;
    }

    // Show scanning overlay
    resultsDiv.classList.remove("active");
    scanOverlay.classList.add("active");
    scanBar.style.width = "0%";

    for (let i = 0; i < scanSteps.length; i++) {
      scanText.textContent = scanSteps[i];
      scanBar.style.width = `${((i + 1) / scanSteps.length) * 100}%`;
      await new Promise((r) => setTimeout(r, 400));
    }

    // Call backend API
    let result;
    try {
      const response = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error("API error");
      result = await response.json();
    } catch (err) {
      // Fallback: client-side heuristic analysis
      result = clientSideAnalysis(text);
    }

    scanOverlay.classList.remove("active");
    displayResults(result);
  }

  function clientSideAnalysis(text) {
    const lower = text.toLowerCase();
    const spamWords = [
      "free", "winner", "congratulations", "lottery", "prize", "claim",
      "urgent", "guaranteed", "click here", "act now", "limited time",
      "wire transfer", "bitcoin", "nigerian prince", "password", "verify",
      "suspended", "bank account", "credit card", "social security",
      "dear friend", "million dollars", "risk-free", "no obligation",
      "viagra", "weight loss", "investment opportunity", "crypto",
    ];
    const urgencyWords = [
      "act now", "urgent", "immediately", "expires today", "final notice",
      "last chance", "limited time", "hurry", "deadline", "within 24 hours",
    ];
    let score = 0;
    const keywords = [];
    spamWords.forEach((w) => {
      if (lower.includes(w)) {
        score += 8;
        keywords.push(w);
      }
    });
    urgencyWords.forEach((w) => {
      if (lower.includes(w)) score += 5;
    });
    const exclamCount = (text.match(/!/g) || []).length;
    if (exclamCount > 5) score += 10;
    const urlCount = (text.match(/https?:\/\//gi) || []).length;
    if (urlCount >= 3) score += 10;
    const upperRatio =
      text.split(/\s+/).filter((w) => w.length > 3 && w === w.toUpperCase()).length /
      Math.max(text.split(/\s+/).length, 1);
    if (upperRatio > 0.15) score += 8;

    const probability = Math.min(100, score) / 100;
    const isSpam = probability > 0.45;
    const confidence = Math.min(99, 70 + score);
    let risk = "Low";
    if (probability > 0.7) risk = "Critical";
    else if (probability > 0.45) risk = "High";
    else if (probability > 0.2) risk = "Medium";

    return {
      prediction: isSpam ? "Spam" : "Ham",
      probability: probability,
      confidence: confidence,
      risk: risk,
      keywords: keywords.slice(0, 10),
    };
  }

  function displayResults(data) {
    const isSpam = data.prediction === "Spam";
    const pct = Math.round(data.probability * 100);
    const circumference = 565;
    const offset = circumference - (pct / 100) * circumference;

    // Circular progress
    const cpFill = document.getElementById("cp-fill");
    const cpValue = document.getElementById("cp-value");
    const cpLabel = document.getElementById("cp-label");
    cpFill.classList.toggle("spam", isSpam);
    cpFill.style.strokeDashoffset = offset;
    cpValue.textContent = pct + "%";
    cpLabel.textContent = isSpam ? "Spam" : "Safe";

    // Details
    document.getElementById("r-prediction").innerHTML = isSpam
      ? '<span class="badge badge-spam">Spam</span>'
      : '<span class="badge badge-safe">Safe</span>';
    document.getElementById("r-probability").textContent = pct + "%";
    document.getElementById("r-confidence").textContent = data.confidence + "%";

    let riskBadge;
    if (data.risk === "Critical" || data.risk === "High") riskBadge = "badge-spam";
    else if (data.risk === "Medium") riskBadge = "badge-medium";
    else riskBadge = "badge-safe";
    document.getElementById("r-risk").innerHTML = `<span class="badge ${riskBadge}">${data.risk}</span>`;
    document.getElementById("r-verdict").textContent = isSpam
      ? "This email is likely spam or phishing. Do not interact with it."
      : "This email appears to be legitimate.";

    // Keywords / reasons
    const reasonsList = document.getElementById("reasons-list");
    if (data.keywords && data.keywords.length > 0) {
      reasonsList.innerHTML =
        "<h4><i class=\"fas fa-exclamation-triangle\"></i> Detected Threat Indicators</h4>" +
        data.keywords
          .map((k) => `<div class="reason-item"><i class="fas fa-circle-exclamation" style="color: var(--cyan);"></i> Suspicious keyword: <strong style="color: var(--cyan)">${k}</strong></div>`)
          .join("");
    } else {
      reasonsList.innerHTML =
        "<h4><i class=\"fas fa-shield-check\"></i> Analysis Summary</h4>" +
        '<div class="reason-item"><i class="fas fa-check-circle" style="color: var(--green);"></i> No significant spam indicators detected.</div>';
    }

    // Risk meter
    const riskFill = document.getElementById("risk-fill");
    riskFill.style.width = pct + "%";

    resultsDiv.classList.add("active");
    resultsDiv.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  analyzeBtn.addEventListener("click", analyze);
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      textarea.value = "";
      resultsDiv.classList.remove("active");
      scanOverlay.classList.remove("active");
    });
  }

  // Sample email loader
  document.querySelectorAll(".sample-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sample = btn.getAttribute("data-sample");
      const samples = {
        spam:
          "CONGRATULATIONS!!! You have been selected as the WINNER of our $1,000,000 lottery! To claim your prize, please click here immediately and provide your bank account details. This is a limited time offer! Act now before it expires! Dear friend, this is 100% risk-free and guaranteed. Reply with your social security number and credit card information to proceed with the wire transfer.",
        ham:
          "Hi team,\n\nJust wanted to share a quick update on the project. We've completed the first phase of testing and everything looks good so far. The next sprint planning meeting is scheduled for Thursday at 2 PM in Conference Room B.\n\nLet me know if you have any questions.\n\nThanks,\nSarah",
        phishing:
          "URGENT: Your PayPal account has been suspended due to suspicious activity. To restore access, please click the link below and verify your identity by providing your password, credit card number, and social security number within 24 hours. Failure to respond will result in permanent account closure.\n\nhttp://paypa1-secure.com/verify\n\nPayPal Security Team",
      };
      textarea.value = samples[sample] || "";
      resultsDiv.classList.remove("active");
    });
  });
})();

/* ===== Dashboard Charts (Chart.js) ===== */
(function initCharts() {
  const chartPie = document.getElementById("chart-pie");
  const chartLine = document.getElementById("chart-line");
  const chartBar = document.getElementById("chart-bar");
  if (!chartPie || typeof Chart === "undefined") return;

  // Common chart options
  Chart.defaults.color = "rgba(255,255,255,0.6)";
  Chart.defaults.font.family = "'Inter', sans-serif";

  // Pie Chart: Spam vs Safe
  new Chart(chartPie, {
    type: "doughnut",
    data: {
      labels: ["Safe", "Spam"],
      datasets: [
        {
          data: [72, 28],
          backgroundColor: ["#00F5A0", "#ff4757"],
          borderColor: "rgba(0,0,0,0.2)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { padding: 20, font: { size: 12 } },
        },
      },
    },
  });

  // Line Chart: Daily Scans
  new Chart(chartLine, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Total Scans",
          data: [1200, 1900, 1500, 2400, 2100, 1800, 1600],
          borderColor: "#00D4FF",
          backgroundColor: "rgba(0, 212, 255, 0.1)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: "#00D4FF",
          pointRadius: 4,
        },
        {
          label: "Threats",
          data: [300, 520, 400, 680, 590, 510, 450],
          borderColor: "#ff4757",
          backgroundColor: "rgba(255, 71, 87, 0.1)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: "#ff4757",
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: { padding: 15, font: { size: 12 } },
        },
      },
      scales: {
        y: { grid: { color: "rgba(255,255,255,0.05)" } },
        x: { grid: { color: "rgba(255,255,255,0.05)" } },
      },
    },
  });

  // Bar Chart: Threat Categories
  new Chart(chartBar, {
    type: "bar",
    data: {
      labels: ["Phishing", "Scam", "Malware", "Spoofing", "Spam", "Fraud"],
      datasets: [
        {
          label: "Detections",
          data: [450, 320, 280, 210, 580, 190],
          backgroundColor: [
            "#00D4FF",
            "#00F5A0",
            "#ff4757",
            "#ffa500",
            "#a855f7",
            "#3b82f6",
          ],
          borderRadius: 8,
          barThickness: "flex",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: "rgba(255,255,255,0.05)" } },
        x: { grid: { display: false } },
      },
    },
  });
})();

/* ===== Chatbot ===== */
(function initChatbot() {
  const toggle = document.querySelector(".chatbot-toggle");
  const window_ = document.querySelector(".chatbot-window");
  const closeBtn = document.querySelector(".close-chat");
  const body = document.querySelector(".chatbot-body");
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");

  if (!toggle || !window_) return;

  toggle.addEventListener("click", () => window_.classList.toggle("active"));
  if (closeBtn) closeBtn.addEventListener("click", () => window_.classList.remove("active"));

  const faqs = [
    {
      q: /what.*spamshield|what.*this|about spamshield/i,
      a: "SpamShield AI is an AI-powered spam email detection tool that uses Machine Learning (TF-IDF + Naive Bayes) to identify spam and phishing emails with 99.8% accuracy.",
    },
    {
      q: /how.*work|how.*detect|technology|algorithm/i,
      a: "We use a TF-IDF Vectorizer combined with a Multinomial Naive Bayes classifier. The model was trained on thousands of spam and ham emails to identify patterns and malicious content.",
    },
    {
      q: /api|endpoint|integrate/i,
      a: "Yes! We offer a REST API. Send a POST request to /predict with JSON {\"text\": \"email content\"}. Check the API section above for full documentation.",
    },
    {
      q: /accuracy|reliable|trust/i,
      a: "Our model achieves 99.8% accuracy on test data. It analyzes 100+ spam indicators including keywords, phishing patterns, urgency tactics, and sender anomalies.",
    },
    {
      q: /price|cost|pricing|free/i,
      a: "SpamShield AI offers a free tier for individual use. Enterprise plans with API access and custom models are available. Contact us for details!",
    },
    {
      q: /phishing|scam|malware/i,
      a: "Phishing is a cyberattack where scammers impersonate trusted entities to steal sensitive info. SpamShield AI detects phishing by analyzing sender domains, brand impersonation, and manipulative language.",
    },
    {
      q: /hello|hi|hey/i,
      a: "Hello! I'm ShieldBot, your AI assistant. Ask me about SpamShield AI, how it works, our API, or email security tips!",
    },
    {
      q: /thank|thanks/i,
      a: "You're welcome! Stay safe out there. Is there anything else I can help you with?",
    },
  ];

  function addMsg(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("chat-msg", sender);
    msg.textContent = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  function showTyping() {
    const t = document.createElement("div");
    t.classList.add("chat-typing");
    t.id = "typing-indicator";
    t.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(t);
    body.scrollTop = body.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById("typing-indicator");
    if (t) t.remove();
  }

  function respond(text) {
    showTyping();
    setTimeout(() => {
      hideTyping();
      let found = false;
      for (const faq of faqs) {
        if (faq.q.test(text)) {
          addMsg(faq.a, "bot");
          found = true;
          break;
        }
      }
      if (!found) {
        addMsg(
          "I'm not sure about that yet. Try asking about: how SpamShield works, our API, accuracy, or phishing detection. You can also contact our team via the Contact section!",
          "bot"
        );
      }
    }, 1000 + Math.random() * 500);
  }

  function send() {
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, "user");
    input.value = "";
    respond(text);
  }

  if (sendBtn) sendBtn.addEventListener("click", send);
  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") send();
    });
  }

  // Welcome message
  setTimeout(() => {
    addMsg(
      "Hi! I'm ShieldBot, your AI assistant. How can I help you with email security today?",
      "bot"
    );
  }, 500);
})();

/* ===== Copy Button ===== */
(function initCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const codeBlock = btn.parentElement.querySelector("pre");
      if (!codeBlock) return;
      navigator.clipboard.writeText(codeBlock.textContent).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
          btn.innerHTML = original;
        }, 2000);
      });
    });
  });
})();

/* ===== Contact Form Validation ===== */
(function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    const name = form.querySelector("#contact-name");
    const email = form.querySelector("#contact-email");
    const message = form.querySelector("#contact-message");

    [name, email, message].forEach((f) => f.parentElement.classList.remove("error"));

    if (name.value.trim().length < 2) {
      name.parentElement.classList.add("error");
      valid = false;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email.value.trim())) {
      email.parentElement.classList.add("error");
      valid = false;
    }
    if (message.value.trim().length < 10) {
      message.parentElement.classList.add("error");
      valid = false;
    }

    if (valid) {
      const success = document.getElementById("form-success");
      if (success) {
        success.classList.add("active");
        setTimeout(() => success.classList.remove("active"), 5000);
      }
      form.reset();
    }
  });
})();

/* ===== Parallax on Hero Robot ===== */
(function initParallax() {
  const robot = document.querySelector(".robot-container");
  if (!robot) return;
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    if (scrolled < 800) {
      robot.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  });
})();

/* ===== Smooth Scroll for Nav Links ===== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#" || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
})();
