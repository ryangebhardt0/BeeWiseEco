/* ============ BeeWise — vanilla JS app ============ */
(() => {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Products ---------- */
  const PRODUCTS = [
    // Honey
    { id: "honey-raw-500",       cat: "honey",    name: "Raw Highveld Honey",    blurb: "Pure, unfiltered raw honey harvested from Gauteng wildflowers.",              size: "500g jar",     price: 120,                     swatch: "linear-gradient(135deg, #f4a821 0%, #d97706 100%)", icon: "jar"      },
    { id: "honey-creamed-500",   cat: "honey",    name: "Creamed Honey",         blurb: "Velvety smooth, slow-crystallised honey — perfect for spreading.",            size: "500g jar",     price: 150,                     swatch: "linear-gradient(135deg, #ffd24a 0%, #e8a317 100%)", icon: "jar"      },
    { id: "honey-comb-500",      cat: "honey",    name: "Raw Honey with Comb",   blurb: "Raw honey bottled with a chunk of natural honeycomb inside.",                 size: "500g jar",     price: 190,                     swatch: "linear-gradient(135deg, #ffc629 0%, #b07509 100%)", icon: "comb"     },
    { id: "honey-bulk-1kg",      cat: "honey",    name: "Bulk Raw Honey",        blurb: "Our bestselling raw honey in a generous 1 kg jar — great value.",             size: "1kg jar",      price: 230, tag: "Best seller", swatch: "linear-gradient(135deg, #f0b429 0%, #c77a1b 100%)", icon: "jar"      },
    // Beeswax
    { id: "beeswax-lip-balm",    cat: "beeswax",  name: "Natural Lip Balm",      blurb: "Pure beeswax lip balm with shea butter and a hint of honey.",                 size: "10g tin",      price:  65,                     swatch: "linear-gradient(135deg, #fff1b8 0%, #e8b64a 100%)", icon: "tin"      },
    { id: "beeswax-moisturiser", cat: "beeswax",  name: "Beeswax Moisturiser",   blurb: "Rich, healing skin cream blended with natural beeswax and oils.",             size: "100ml",        price: 180,                     swatch: "linear-gradient(135deg, #ffe08a 0%, #d99c2b 100%)", icon: "tin"      },
    { id: "beeswax-candle",      cat: "beeswax",  name: "Hand-Poured Candle",    blurb: "Naturally scented beeswax pillar candle, slow-burning and clean.",            size: "~40hr burn",   price:  95,                     swatch: "linear-gradient(135deg, #f0c060 0%, #c77a1b 100%)", icon: "candle"   },
    { id: "beeswax-foundation",  cat: "beeswax",  name: "Foundation Sheets",     blurb: "Hexagonal beeswax foundation sheets, ready to fit Langstroth frames.",        size: "pack of 10",   price: 280,                     swatch: "linear-gradient(135deg, #ffc629 0%, #b07509 100%)", icon: "comb"     },
    // Propolis
    { id: "propolis-tincture",   cat: "propolis", name: "Propolis Tincture",     blurb: "High-strength liquid propolis extract with easy dropper applicator.",         size: "30ml dropper", price: 160,                     swatch: "linear-gradient(135deg, #8b5a2b 0%, #3a1f10 100%)", icon: "dropper"  },
    { id: "propolis-capsules",   cat: "propolis", name: "Propolis Capsules",     blurb: "Standardised propolis extract in easy-to-swallow vegetarian capsules.",       size: "60 caps",      price: 220,                     swatch: "linear-gradient(135deg, #a06a33 0%, #4a2a12 100%)", icon: "capsules" },
    { id: "propolis-spray",      cat: "propolis", name: "Propolis Throat Spray", blurb: "Soothing throat spray combining propolis with natural menthol.",              size: "30ml",         price: 145,                     swatch: "linear-gradient(135deg, #96602c 0%, #2e180a 100%)", icon: "spray"    },
    { id: "propolis-cream",      cat: "propolis", name: "Propolis Skin Cream",   blurb: "Gentle blemish cream harnessing propolis's natural antimicrobial action.",    size: "50ml",         price: 185,                     swatch: "linear-gradient(135deg, #8b5a2b 0%, #46270f 100%)", icon: "tin"      },
  ];

  const HONEY = "#FFC629";
  const INK = "#111111";

  /* ---------- Product icons (returns SVG string) ---------- */
  function productIconSvg(kind, size = 64) {
    const s = size;
    if (kind === "jar") return `
      <svg viewBox="0 0 100 100" width="${s}" height="${s}" aria-hidden="true">
        <rect x="30" y="15" width="40" height="8" rx="2" fill="${INK}"/>
        <path d="M28 28 L72 28 L70 80 Q70 88 62 88 L38 88 Q30 88 30 80 Z" fill="${HONEY}" stroke="${INK}" stroke-width="2.5"/>
        <rect x="36" y="48" width="28" height="18" rx="2" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
        <text x="50" y="61" font-family="Bricolage Grotesque" font-weight="700" font-size="9" text-anchor="middle" fill="${INK}">HONEY</text>
      </svg>`;
    if (kind === "block") return `
      <svg viewBox="0 0 100 100" width="${s}" height="${s}" aria-hidden="true">
        <polygon points="50,18 78,32 78,68 50,82 22,68 22,32" fill="${HONEY}" stroke="${INK}" stroke-width="2.5"/>
        <polygon points="50,18 78,32 50,46 22,32" fill="#fff7d8" stroke="${INK}" stroke-width="2"/>
        <line x1="50" y1="46" x2="50" y2="82" stroke="${INK}" stroke-width="1.5" opacity="0.4"/>
      </svg>`;
    if (kind === "dropper") return `
      <svg viewBox="0 0 100 100" width="${s}" height="${s}" aria-hidden="true">
        <rect x="36" y="14" width="28" height="10" rx="2" fill="${INK}"/>
        <rect x="40" y="6" width="20" height="10" rx="2" fill="${INK}"/>
        <path d="M34 26 L66 26 L64 80 Q64 88 56 88 L44 88 Q36 88 36 80 Z" fill="#8B5A2B" stroke="${INK}" stroke-width="2.5"/>
        <rect x="42" y="50" width="16" height="22" fill="#3a1f10" opacity="0.5"/>
      </svg>`;
    if (kind === "comb") {
      const cells = [[28,30],[50,30],[72,30],[28,55],[50,55],[72,55],[39,42],[61,42],[39,67],[61,67]];
      const polys = cells.map(([x,y]) =>
        `<polygon points="${x},${y-12} ${x+10.4},${y-6} ${x+10.4},${y+6} ${x},${y+12} ${x-10.4},${y+6} ${x-10.4},${y-6}" fill="${HONEY}" stroke="${INK}" stroke-width="1.8"/>`
      ).join("");
      return `<svg viewBox="0 0 100 100" width="${s}" height="${s}" aria-hidden="true">${polys}</svg>`;
    }
    if (kind === "candle") return `
      <svg viewBox="0 0 100 100" width="${s}" height="${s}" aria-hidden="true">
        <rect x="22" y="40" width="18" height="42" rx="2" fill="${HONEY}" stroke="${INK}" stroke-width="2"/>
        <rect x="42" y="32" width="18" height="50" rx="2" fill="${HONEY}" stroke="${INK}" stroke-width="2"/>
        <rect x="62" y="46" width="18" height="36" rx="2" fill="${HONEY}" stroke="${INK}" stroke-width="2"/>
        <path d="M31 40 q-2 -6 0 -10 q2 4 0 10" fill="#F26B38"/>
        <path d="M51 32 q-2 -6 0 -10 q2 4 0 10" fill="#F26B38"/>
        <path d="M71 46 q-2 -6 0 -10 q2 4 0 10" fill="#F26B38"/>
      </svg>`;
    if (kind === "tin") return `
      <svg viewBox="0 0 100 100" width="${s}" height="${s}" aria-hidden="true">
        <rect x="24" y="28" width="52" height="14" rx="7" fill="#fff7d8" stroke="${INK}" stroke-width="2.5"/>
        <rect x="20" y="42" width="60" height="36" rx="6" fill="${HONEY}" stroke="${INK}" stroke-width="2.5"/>
        <rect x="34" y="52" width="32" height="16" rx="2" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
      </svg>`;
    if (kind === "capsules") return `
      <svg viewBox="0 0 100 100" width="${s}" height="${s}" aria-hidden="true">
        <rect x="36" y="12" width="28" height="12" rx="3" fill="${INK}"/>
        <path d="M32 28 L68 28 L68 78 Q68 86 60 86 L40 86 Q32 86 32 78 Z" fill="#8B5A2B" stroke="${INK}" stroke-width="2.5"/>
        <rect x="38" y="44" width="24" height="16" rx="2" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
        <rect x="40" y="68" width="12" height="6" rx="3" fill="${HONEY}" stroke="${INK}" stroke-width="1.5"/>
        <rect x="50" y="74" width="12" height="6" rx="3" fill="${HONEY}" stroke="${INK}" stroke-width="1.5"/>
      </svg>`;
    if (kind === "spray") return `
      <svg viewBox="0 0 100 100" width="${s}" height="${s}" aria-hidden="true">
        <rect x="40" y="8" width="14" height="12" rx="2" fill="${INK}"/>
        <rect x="54" y="10" width="12" height="7" rx="3" fill="${INK}"/>
        <rect x="36" y="20" width="22" height="10" rx="2" fill="${INK}" opacity="0.85"/>
        <path d="M32 34 L62 34 L60 80 Q60 88 52 88 L40 88 Q32 88 32 80 Z" fill="#96602C" stroke="${INK}" stroke-width="2.5"/>
        <rect x="38" y="50" width="18" height="16" rx="2" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
      </svg>`;
    return "";
  }

  /* ---------- Render product grids ---------- */
  function productCardHtml(p) {
    return `
      <article class="product reveal" data-id="${p.id}">
        <div class="product__media" style="background:${p.swatch}">
          ${p.tag ? `<span class="product__tag">${p.tag}</span>` : ""}
          <div class="product__icon">${productIconSvg(p.icon, 64)}</div>
        </div>
        <div class="product__body">
          <div class="product__head">
            <h3 class="product__name">${p.name}</h3>
            <span class="product__price">R${p.price}</span>
          </div>
          <p class="product__blurb">${p.blurb}</p>
          <div class="product__foot">
            <span class="product__size">${p.size}</span>
            <button class="product__add" data-add="${p.id}" aria-label="Add ${p.name} to cart">
              Add to cart
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </article>`;
  }

  function renderProducts() {
    const catGrids = document.querySelectorAll("[data-product-category]");
    if (catGrids.length) {
      catGrids.forEach(grid => {
        const cat = grid.getAttribute("data-product-category");
        grid.innerHTML = PRODUCTS.filter(p => p.cat === cat).map(productCardHtml).join("");
      });
      return;
    }
    const grid = document.getElementById("product-grid");
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(productCardHtml).join("");
  }

  /* ---------- Honeycomb pulse ---------- */
  function initHoneycomb() {
    const host = document.getElementById("honeycomb");
    if (!host) return;

    const cols = 18, rows = 10, cellSize = 64, speed = 1.0;
    const w = Math.sqrt(3) * cellSize;
    const h = 2 * cellSize;
    const xStep = w;
    const yStep = h * 0.75;

    const viewW = cols * xStep + xStep / 2;
    const viewH = rows * cellSize * 1.5 + cellSize * 0.5;

    // hex polygon points (pointy-top) centered at origin
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      pts.push(`${(Math.cos(a) * cellSize * 0.92).toFixed(3)},${(Math.sin(a) * cellSize * 0.92).toFixed(3)}`);
    }
    const hexPoints = pts.join(" ");

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${viewW} ${viewH}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.setAttribute("aria-hidden", "true");
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.display = "block";

    const defs = document.createElementNS(SVG_NS, "defs");
    defs.innerHTML = `
      <radialGradient id="hc-vignette" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.15"/>
      </radialGradient>`;
    svg.appendChild(defs);

    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * xStep + (r % 2 === 1 ? xStep / 2 : 0) + xStep / 2;
        const y = r * yStep + h / 2;
        const poly = document.createElementNS(SVG_NS, "polygon");
        poly.setAttribute("points", hexPoints);
        poly.setAttribute("fill", HONEY);
        poly.setAttribute("stroke", INK);
        poly.setAttribute("stroke-width", "1.2");
        poly.setAttribute("stroke-opacity", "0.18");
        poly.setAttribute("fill-opacity", "0.1");
        poly.setAttribute("transform", `translate(${x},${y})`);
        poly.style.transformBox = "fill-box";
        poly.style.transformOrigin = "center";
        svg.appendChild(poly);
        cells.push({ x, y, el: poly });
      }
    }

    const vignette = document.createElementNS(SVG_NS, "rect");
    vignette.setAttribute("width", viewW);
    vignette.setAttribute("height", viewH);
    vignette.setAttribute("fill", "url(#hc-vignette)");
    vignette.setAttribute("pointer-events", "none");
    svg.appendChild(vignette);

    host.appendChild(svg);

    const cx = viewW / 2;
    const cy = viewH / 2;

    // Reduced motion: freeze at intensity 0.3
    if (prefersReducedMotion) {
      const intensity = 0.3;
      const fillOp = (0.06 + intensity * 0.94).toFixed(3);
      const scale = (0.92 + intensity * 0.08).toFixed(3);
      for (const cell of cells) {
        cell.el.setAttribute("fill-opacity", fillOp);
        cell.el.setAttribute("transform", `translate(${cell.x},${cell.y}) scale(${scale})`);
      }
      return;
    }

    const start = performance.now();
    function tick(now) {
      const t = (now - start) / 1000;
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const dx = cell.x - cx;
        const dy = cell.y - cy;
        const d = Math.sqrt(dx * dx + dy * dy);
        const wave = Math.sin((d / 80) - t * 1.5 * speed);
        let intensity = (wave + 1) / 2;
        intensity = Math.pow(intensity, 1.6);
        const fillOp = (0.06 + intensity * 0.94).toFixed(3);
        const scale = (0.92 + intensity * 0.08).toFixed(3);
        cell.el.setAttribute("fill-opacity", fillOp);
        cell.el.setAttribute("transform", `translate(${cell.x},${cell.y}) scale(${scale})`);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Nav: scroll progress + scrolled state ---------- */
  function initNav() {
    const nav = document.getElementById("nav");
    const progress = document.getElementById("nav-progress");
    if (!nav || !progress) return;

    function onScroll() {
      const y = window.scrollY;
      nav.classList.toggle("scrolled", y > 12);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (y / h) * 100 : 0;
      progress.style.width = pct + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll reveals ---------- */
  function initReveals() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(el => io.observe(el));
  }

  /* ---------- Animated counters ---------- */
  function initCounters() {
    const counters = document.querySelectorAll(".counter");
    if (!("IntersectionObserver" in window)) {
      counters.forEach(el => {
        const to = parseInt(el.dataset.to, 10) || 0;
        const suffix = el.dataset.suffix || "";
        el.innerHTML = `${to.toLocaleString()}<span class="unit">${suffix}</span>`;
      });
      return;
    }
    const duration = 1600;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        if (el.dataset.started) return;
        el.dataset.started = "1";
        const to = parseInt(el.dataset.to, 10) || 0;
        const suffix = el.dataset.suffix || "";
        if (prefersReducedMotion) {
          el.innerHTML = `${to.toLocaleString()}<span class="unit">${suffix}</span>`;
          io.unobserve(el);
          return;
        }
        const start = performance.now();
        function tick(now) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const val = Math.round(to * eased);
          el.innerHTML = `${val.toLocaleString()}<span class="unit">${suffix}</span>`;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => io.observe(el));
  }

  /* ---------- Cart ---------- */
  const cart = {};
  let lastFocus = null;

  function saveCart() {
    try { localStorage.setItem("beewise_cart", JSON.stringify(cart)); } catch {}
  }
  function loadCart() {
    try {
      const raw = localStorage.getItem("beewise_cart");
      if (!raw) return;
      const obj = JSON.parse(raw);
      Object.keys(obj).forEach(k => { cart[k] = obj[k]; });
    } catch {}
  }

  function cartCount() {
    return Object.values(cart).reduce((s, i) => s + i.qty, 0);
  }
  function cartTotal() {
    return Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
  }

  function updateCartBadge() {
    const count = cartCount();
    const badge = document.getElementById("cart-count");
    const btn = document.getElementById("cart-open");
    if (!badge || !btn) return;
    if (count > 0) {
      badge.textContent = String(count);
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
    btn.setAttribute("aria-label", `Open cart (${count})`);
  }

  function renderCart() {
    const body = document.getElementById("cart-body");
    const totalEl = document.getElementById("cart-total");
    const checkout = document.getElementById("cart-checkout");
    if (!body || !totalEl || !checkout) return;

    const items = Object.values(cart);
    if (items.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty__hex">⬢</div>
          <p>Nothing in here yet.<br/>Go grab some honey.</p>
        </div>`;
    } else {
      body.innerHTML = `
        <ul class="cart-list">
          ${items.map(it => `
            <li class="cart-item" data-id="${it.id}">
              <div class="cart-item__thumb" style="background:${it.swatch}">
                ${productIconSvg(it.icon, 44)}
              </div>
              <div class="cart-item__body">
                <div class="cart-item__name">${it.name}</div>
                <div class="cart-item__size">${it.size}</div>
                <div class="cart-item__row">
                  <div class="qty">
                    <button data-qty="-1" data-id="${it.id}" aria-label="Decrease ${it.name}">−</button>
                    <span>${it.qty}</span>
                    <button data-qty="1" data-id="${it.id}" aria-label="Increase ${it.name}">+</button>
                  </div>
                  <span class="cart-item__price">R${it.price * it.qty}</span>
                </div>
              </div>
            </li>`).join("")}
        </ul>`;
    }
    totalEl.textContent = String(cartTotal());
    checkout.disabled = items.length === 0;
    updateCartBadge();
  }

  function addToCart(productId) {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return;
    if (cart[p.id]) {
      cart[p.id] = { ...cart[p.id], qty: cart[p.id].qty + 1 };
    } else {
      cart[p.id] = { ...p, qty: 1 };
    }
    saveCart();
    renderCart();
    openCart();
  }

  function adjustQty(productId, delta) {
    if (!cart[productId]) return;
    const next = cart[productId].qty + delta;
    if (next <= 0) delete cart[productId];
    else cart[productId] = { ...cart[productId], qty: next };
    saveCart();
    renderCart();
  }

  function openCart() {
    const drawer = document.getElementById("cart-drawer");
    const scrim = document.getElementById("cart-scrim");
    if (!drawer || !scrim) return;
    lastFocus = document.activeElement;
    drawer.classList.add("open");
    scrim.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const close = document.getElementById("cart-close");
    if (close) close.focus();
  }

  function closeCart() {
    const drawer = document.getElementById("cart-drawer");
    const scrim = document.getElementById("cart-scrim");
    if (!drawer || !scrim) return;
    drawer.classList.remove("open");
    scrim.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function initCart() {
    loadCart();
    renderCart();

    document.getElementById("cart-open")?.addEventListener("click", openCart);
    document.getElementById("cart-close")?.addEventListener("click", closeCart);
    document.getElementById("cart-scrim")?.addEventListener("click", closeCart);
    document.getElementById("cart-checkout")?.addEventListener("click", () => {
      if (cartCount() === 0) return;
      alert(
        "Payment gateway integration coming soon.\n\n" +
        "For now, please contact us:\nTel: 081 305 4398\nEmail: ryangebhardt0@gmail.com\n\n" +
        "Reference your cart total: R " + cartTotal().toFixed(2)
      );
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const drawer = document.getElementById("cart-drawer");
        if (drawer?.classList.contains("open")) closeCart();
      }
    });

    // Delegated handlers for add + qty
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const addBtn = target.closest("[data-add]");
      if (addBtn) {
        addToCart(addBtn.getAttribute("data-add"));
        return;
      }
      const qtyBtn = target.closest("[data-qty]");
      if (qtyBtn) {
        adjustQty(qtyBtn.getAttribute("data-id"), parseInt(qtyBtn.getAttribute("data-qty"), 10));
      }
    });
  }

  /* ---------- Contact form ---------- */
  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fields = form.querySelector(".contact__form-fields");
      const success = form.querySelector(".contact__form-success");
      if (fields) fields.hidden = true;
      if (success) success.hidden = false;
    });
  }

  /* ---------- Preloader ---------- */
  function hidePreloader() {
    const pre = document.getElementById("preload");
    if (!pre) return;
    requestAnimationFrame(() => {
      pre.classList.add("hide");
      setTimeout(() => pre.remove(), 500);
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    renderProducts();
    initHoneycomb();
    initNav();
    initReveals();
    initCounters();
    initCart();
    initContactForm();
    hidePreloader();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
