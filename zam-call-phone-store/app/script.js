// ZAM CALL — small touches that make the page feel alive.

(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Live "today at the shop" ticker ────────────────────────────────────
  const term = document.getElementById("terminal-body");
  if (term) {
    const lines = [
      ["term-dim", "─ live from 21 New Rd, Gravesend ────────────────────────────"],
      ["term-prompt", "09:42  "],
      ["term-out", "iPhone 14 Pro · screen + back glass    "],
      ["term-key", "→ in progress"],
      ["term-prompt", "10:08  "],
      ["term-out", "Samsung S22 · battery replacement      "],
      ["term-ok", "✓ ready for collection"],
      ["term-prompt", "10:21  "],
      ["term-out", "iPad Air · charge port rebuild         "],
      ["term-key", "→ diagnostic"],
      ["term-prompt", "10:35  "],
      ["term-out", "Pixel 7 · cracked screen               "],
      ["term-ok", "✓ booked in"],
      ["term-prompt", "10:48  "],
      ["term-out", "iPhone 11 · water-damage rescue        "],
      ["term-warn", "⏳ ultrasonic clean"],
      ["term-prompt", "11:02  "],
      ["term-out", "OnePlus 10 · power button              "],
      ["term-ok", "✓ ready for collection"],
      ["term-dim", "──────────────────────────────────────────────────────────────"],
      ["term-out", "today · "],
      ["term-key", "14 repairs completed"],
      ["term-out", "  ·  avg wait "],
      ["term-key", "47 min"],
      ["term-out", "  ·  "],
      ["term-ok", "all customers happy ✦"],
      ["__cursor"],
    ];

    const writeChar = (parent, ch) => {
      parent.appendChild(document.createTextNode(ch));
    };

    let i = 0;
    let curEl = null;
    let pendingNewline = false;

    const tickToken = (cls, text) => {
      if (cls === "__cursor") {
        const c = document.createElement("span");
        c.className = "term-cursor";
        term.appendChild(c);
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        curEl = document.createElement("span");
        curEl.className = cls;
        term.appendChild(curEl);
        let k = 0;
        const step = () => {
          if (k >= text.length) {
            if (cls === "term-ok" || cls === "term-key" || cls === "term-warn" || cls === "term-dim") {
              term.appendChild(document.createTextNode("\n"));
            }
            resolve();
            return;
          }
          writeChar(curEl, text[k++]);
          // Fast typing, slow on punctuation
          const delay = reduce ? 0 : (text[k - 1] === " " ? 6 : 14);
          setTimeout(step, delay);
        };
        if (reduce) {
          curEl.textContent = text;
          if (cls === "term-ok" || cls === "term-key" || cls === "term-warn" || cls === "term-dim") {
            term.appendChild(document.createTextNode("\n"));
          }
          resolve();
        } else {
          step();
        }
      });
    };

    const run = async () => {
      for (const [cls, text] of lines) {
        await tickToken(cls, text || "");
      }
    };

    // Only animate when scrolled into view, so the typing greets the visitor.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            io.disconnect();
            run();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(term);
  }

  // ── "Copy phone number" / generic copy buttons ─────────────────────────
  document.querySelectorAll(".copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy || btn.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        const label = btn.querySelector(".copy__label");
        const old = label ? label.textContent : null;
        if (label) label.textContent = "Copied";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.classList.remove("copied");
          if (label && old) label.textContent = old;
        }, 1600);
      } catch {
        /* clipboard not available — ignore */
      }
    });
  });

  // ── Pointer-glow on feature cards ──────────────────────────────────────
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  // ── Scroll-reveal ──────────────────────────────────────────────────────
  if (!reduce) {
    const targets = document.querySelectorAll(
      ".section-head, .feature-grid > *, .steps > *, .plans > *, .cta__inner, .reviews > *, .visit__card, .terminal, .chips"
    );
    targets.forEach((el) => el.classList.add("reveal"));
    const io2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("is-visible"), i * 60);
            io2.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    targets.forEach((el) => io2.observe(el));
  }

  // ── Subtle parallax on the hero window ────────────────────────────────
  const win = document.querySelector(".window");
  if (win && !reduce && matchMedia("(pointer: fine)").matches) {
    const hero = win.closest(".hero") || document.body;
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      win.style.transform = `perspective(1600px) rotateY(${-6 + x * 4}deg) rotateX(${3 - y * 4}deg)`;
    });
    hero.addEventListener("pointerleave", () => {
      win.style.transform = "";
    });
  }
})();
