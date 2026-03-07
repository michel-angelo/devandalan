AOS.init({
  once: true,
  easing: "ease-out-quart",
  offset: 50,
  duration: 650,
});

// ─── PORTO PREVIEW via Microlink API ───────────────────────────────────────
async function loadPortoPreviews() {
  const cards = document.querySelectorAll(".portocard[data-url]");

  cards.forEach(async (card) => {
    const url = card.dataset.url;
    if (!url || url === "#") return;

    const portoImg = card.querySelector(".portoimg");
    const previewEl = card.querySelector(".porto-preview");
    if (!portoImg || !previewEl) return;

    portoImg.classList.add("fetching");

    try {
      const res = await fetch(
        `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&screenshot.type=jpeg&screenshot.quality=80&screenshot.fullPage=false`,
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const screenshotUrl = data?.data?.screenshot?.url;

      if (screenshotUrl) {
        previewEl.src = screenshotUrl;
        previewEl.onload = () => {
          previewEl.classList.add("loaded");
          portoImg.classList.remove("fetching");
        };
        previewEl.onerror = () => {
          portoImg.classList.remove("fetching");
        };
      } else {
        portoImg.classList.remove("fetching");
      }
    } catch (e) {
      portoImg.classList.remove("fetching");
      console.warn("Microlink gagal untuk:", url, e.message);
    }
  });
}

loadPortoPreviews();
// ────────────────────────────────────────────────────────────────────────────

// mobile menu
const ham = document.getElementById("ham"),
  mmenu = document.getElementById("mmenu");
ham.addEventListener("click", () => {
  ham.classList.toggle("open");
  mmenu.classList.toggle("open");
});
function cM() {
  ham.classList.remove("open");
  mmenu.classList.remove("open");
}

// custom cursor logic (ditambahin .portocard biar cursor responsif pas kena portofolio)
const cur = document.getElementById("cur"),
  cring = document.getElementById("cring");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
});
(function aC() {
  cur.style.left = mx + "px";
  cur.style.top = my + "px";
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cring.style.left = rx + "px";
  cring.style.top = ry + "px";
  requestAnimationFrame(aC);
})();

document
  .querySelectorAll(
    "a,button,.srow,.pc,.procitem,.tcard,.faqbtn,.float-wa,.portocard",
  )
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cur.classList.add("hov");
      cring.classList.add("hov");
    });
    el.addEventListener("mouseleave", () => {
      cur.classList.remove("hov");
      cring.classList.remove("hov");
    });
  });

// FAQ ACCORDION LOGIC
const faqBtns = document.querySelectorAll(".faqbtn");
faqBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    this.classList.toggle("active");
    const content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

// GSAP AFFINITY PARALLAX
gsap.registerPlugin(ScrollTrigger);

let affTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#aff-sec",
    start: "top top",
    end: "+=250%",
    pin: "#aff-pinned",
    scrub: 1,
  },
});

gsap.utils.toArray(".acard").forEach((card, i) => {
  let speed = 1.2 + i * 0.35;
  let rot = i % 2 === 0 ? 12 : -12;

  affTl.to(
    card,
    {
      y: () => -window.innerHeight * 2.5 * speed,
      rotation: rot,
      ease: "none",
    },
    0,
  );
});

affTl.to(".aff-text", { scale: 1.15, opacity: 0.15, ease: "none" }, 0);

// ─── PROMO COUNTDOWN TIMER (promo banner + sticky bar synced) ────────────────
(function startCountdown() {
  function getMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(23, 59, 59, 0);
    return midnight;
  }

  // Pricing section elements
  const hEl = document.getElementById("pct-h");
  const mEl = document.getElementById("pct-m");
  const sEl = document.getElementById("pct-s");
  // Sticky bar elements
  const spH = document.getElementById("sp-h");
  const spM = document.getElementById("sp-m");
  const spS = document.getElementById("sp-s");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const now = new Date();
    const diff = getMidnight() - now;
    const h = diff > 0 ? Math.floor(diff / 3600000) : 0;
    const m = diff > 0 ? Math.floor((diff % 3600000) / 60000) : 0;
    const s = diff > 0 ? Math.floor((diff % 60000) / 1000) : 0;

    if (sEl) {
      sEl.classList.remove("tick");
      void sEl.offsetWidth;
      sEl.classList.add("tick");
      hEl.textContent = pad(h);
      mEl.textContent = pad(m);
      sEl.textContent = pad(s);
    }
    if (spS) {
      spS.classList.remove("tick");
      void spS.offsetWidth;
      spS.classList.add("tick");
      spH.textContent = pad(h);
      spM.textContent = pad(m);
      spS.textContent = pad(s);
    }
  }

  tick();
  setInterval(tick, 1000);

  // Close button
  const bar = document.getElementById("sticky-promo");
  const nav = document.querySelector("nav");
  const closeBtn = document.getElementById("sp-close");
  if (closeBtn && bar) {
    closeBtn.addEventListener("click", () => {
      bar.classList.add("hidden");
      if (nav) nav.classList.add("promo-gone");
    });
  }
})();
// ─────────────────────────────────────────────────────────────────────────────

function aC2(el) {
  const t = +el.dataset.t,
    dur = 1300;
  let s = null;
  const step = (ts) => {
    if (!s) s = ts;
    const pr = Math.min((ts - s) / dur, 1);
    const e = 1 - Math.pow(1 - pr, 3);
    el.textContent = Math.floor(e * t);
    if (pr < 1) requestAnimationFrame(step);
    else el.textContent = t;
  };
  requestAnimationFrame(step);
}
const sobs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        document.querySelectorAll(".cnt").forEach(aC2);
        sobs.disconnect();
      }
    });
  },
  { threshold: 0.4 },
);
const sb = document.querySelector(".sbar");
if (sb) sobs.observe(sb);
