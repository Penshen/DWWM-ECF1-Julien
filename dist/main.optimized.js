(() => {
  document.addEventListener("DOMContentLoaded", () => {
    let h = document.getElementById("background-music"),
      C = document.querySelector(".equalizer"),
      E = document.querySelector(".equalizer-toggle");
    if (h && C && E) {
      let i = parseFloat(localStorage.getItem("audioTime") || "0"),
        l = localStorage.getItem("audioPlaying") !== "false";
      h.currentTime = i;
      let e = () => {
        h.paused
          ? h
              .play()
              .then(() => {
                C.classList.remove("paused"),
                  E.classList.remove("paused"),
                  localStorage.setItem("audioPlaying", "true");
              })
              .catch((r) => {
                console.error("Audio playback failed:", r),
                  C.classList.add("paused"),
                  E.classList.add("paused"),
                  localStorage.setItem("audioPlaying", "false");
              })
          : (h.pause(),
            C.classList.add("paused"),
            E.classList.add("paused"),
            localStorage.setItem("audioPlaying", "false"));
      };
      E.addEventListener("click", e),
        h.addEventListener("ended", () => {
          C.classList.add("paused"),
            E.classList.add("paused"),
            localStorage.setItem("audioPlaying", "false");
        }),
        h.addEventListener("pause", () => {
          C.classList.add("paused"),
            E.classList.add("paused"),
            localStorage.setItem("audioPlaying", "false");
        }),
        h.addEventListener("play", () => {
          C.classList.remove("paused"),
            E.classList.remove("paused"),
            localStorage.setItem("audioPlaying", "true");
        }),
        setInterval(() => {
          h.paused ||
            localStorage.setItem("audioTime", h.currentTime.toString());
        }, 1e3),
        document.addEventListener("visibilitychange", () => {
          document.hidden &&
            localStorage.setItem("audioTime", h.currentTime.toString());
        }),
        h
          .play()
          .then(() => {
            C.classList.remove("paused"),
              E.classList.remove("paused"),
              localStorage.setItem("audioPlaying", "true");
          })
          .catch((r) => {
            console.log("Autoplay blocked:", r),
              C.classList.add("paused"),
              E.classList.add("paused"),
              localStorage.setItem("audioPlaying", "false");
          });
    }
    function I(i) {
      return new Date(i).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    let j = window.location.pathname.includes("program.html"),
      F = window.location.pathname.includes("info.html"),
      R = window.location.pathname.includes("tickets.html"),
      z = document.querySelector(".burger-menu"),
      T = document.querySelector(".menu-overlay"),
      H = document.querySelector(".close-menu"),
      U = document.body;
    if (z && T && H) {
      let i = (e) => {
        T.classList.toggle("active", e), U.classList.toggle("menu-open", e);
      };
      z.addEventListener("click", () => {
        i(!0);
      }),
        H.addEventListener("click", () => {
          i(!1);
        }),
        T.addEventListener("click", (e) => {
          e.target === T && i(!1);
        }),
        document.querySelectorAll(".mobile-nav a").forEach((e) => {
          e.addEventListener("click", () => {
            i(!1);
          });
        }),
        document.addEventListener("keydown", (e) => {
          e.key === "Escape" && T.classList.contains("active") && i(!1);
        });
    }
    if (j) {
      let l = function (e) {
        let r = document.createElement("div");
        r.className = "program-card";
        let p = document.createElement("div");
        p.className = "card-image";
        let o = document.createElement("img"),
          s = e.artist
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[']/g, "")
            .replace(/\s+/g, "-");
        (o.src = `img/${s}.jpg`),
          (o.alt = `Artiste : ${e.artist}`),
          p.appendChild(o);
        let g = document.createElement("div");
        g.className = "card-content";
        let v = document.createElement("h2");
        (v.className = "band-name"), (v.textContent = e.artist.toUpperCase());
        let u = document.createElement("div");
        (u.className = "datetime-container"),
          (u.innerHTML = `
        <p class="datetime">
          <span class="icon">\u231A</span> ${e.time}
        </p>
      `);
        let y = document.createElement("div");
        y.className = "description-container";
        let f = document.createElement("p");
        (f.className = "description"),
          (f.textContent = e.description),
          (f.style.display = "none");
        let L = document.createElement("button");
        return (
          (L.className = "button-info"),
          (L.textContent = "?"),
          L.addEventListener("click", () => {
            (f.style.display = f.style.display === "none" ? "block" : "none"),
              L.classList.toggle("active");
          }),
          y.appendChild(f),
          y.appendChild(L),
          g.appendChild(v),
          g.appendChild(u),
          g.appendChild(y),
          r.appendChild(p),
          r.appendChild(g),
          r
        );
      };
      var K = l;
      let i = document.querySelector(".program-days");
      fetch("data/festival.json")
        .then((e) => e.json())
        .then((e) => {
          let r = e.reduce(
            (o, s) => (o[s.date] || (o[s.date] = []), o[s.date].push(s), o),
            {}
          );
          Object.keys(r)
            .sort()
            .forEach((o) => {
              let s = document.createElement("div");
              s.className = "program-day";
              let g = document.createElement("div");
              (g.className = "day-header"), (g.innerHTML = `<h3>${I(o)}</h3>`);
              let v = document.createElement("div");
              (v.className = "day-cards"),
                r[o]
                  .sort((y, f) => y.time.localeCompare(f.time))
                  .forEach((y) => {
                    let f = l(y);
                    v.appendChild(f);
                  }),
                s.appendChild(g),
                s.appendChild(v),
                i.appendChild(s);
            });
        })
        .catch((e) => {
          console.error("Erreur:", e),
            (i.innerHTML = `<p style="color: white;">Erreur lors du chargement des donn\xE9es: ${e.message}</p>`);
        });
      return;
    }
    if (F) {
      document.querySelectorAll(".toggle-button").forEach((l) => {
        l.addEventListener("click", () => {
          let e = l.nextElementSibling,
            r = l.querySelector(".toggle-icon");
          l.classList.toggle("active"),
            e.classList.toggle("active"),
            (r.textContent = l.classList.contains("active") ? "\xD7" : "+");
        });
      });
      return;
    }
    if (R) {
      let y = function (n, S = !1) {
          let t = document.createElement("div");
          (t.className = S ? "card-reverse" : "card"), (t.artistData = n);
          let c = 1e3 - n.ticketsSold,
            a = c < 5;
          a && t.setAttribute("data-sold-out", "true");
          let d = document.createElement("div");
          d.className = "card-image";
          let m = document.createElement("img"),
            q = n.artist
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[']/g, "")
              .replace(/\s+/g, "-");
          (m.src = `img/${q}.jpg`),
            (m.alt = `Artiste : ${n.artist}`),
            d.appendChild(m);
          let k = document.createElement("div");
          k.className = "card-content";
          let A = document.createElement("h2");
          (A.className = "band-name"), (A.textContent = n.artist.toUpperCase());
          let P = document.createElement("div");
          P.className = "datetime-container";
          let w = document.createElement("p");
          w.className = "datetime";
          let V = new Date(n.date).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          (w.innerHTML = `
        <span class="icon">\u{1F4C5}</span> ${V}
        <span class="separator">\u2022</span>
        <span class="icon">\u231A</span> ${n.time}
      `),
            P.appendChild(w);
          let B = document.createElement("p");
          (B.className = "description"), (B.textContent = n.description);
          let N = document.createElement("div");
          N.className = "progress-container";
          let O = document.createElement("div");
          O.className = "progress-bar";
          let G = (n.ticketsSold / 1e3) * 100;
          O.style.width = `${G}%`;
          let D = document.createElement("span");
          (D.className = "tickets-text"),
            (D.textContent = a ? "SOLD OUT" : `${c} places restantes`),
            N.setAttribute("data-sold-out", a),
            (N.title = `${n.ticketsSold}/1000 tickets vendus`),
            N.appendChild(O),
            N.appendChild(D);
          let $ = document.createElement("div");
          $.className = "reservation";
          let x = document.createElement("button");
          (x.className = "reserve-button"),
            (x.textContent = a ? "SOLD OUT" : "JE R\xC9SERVE MA PLACE !"),
            a || x.addEventListener("click", () => {});
          let M = document.createElement("span");
          if (
            ((M.className = "price"),
            (M.textContent = `${n.price} \u20AC`),
            $.appendChild(x),
            $.appendChild(M),
            k.appendChild(A),
            k.appendChild(P),
            k.appendChild(B),
            k.appendChild(N),
            k.appendChild($),
            t.appendChild(d),
            t.appendChild(k),
            a)
          ) {
            let b = document.createElement("div");
            (b.className = "sold-out-badge"),
              (b.textContent = "SOLD OUT"),
              t.appendChild(b);
          } else if (c <= 10) {
            let b = document.createElement("div");
            (b.className = "last-tickets-badge"),
              (b.textContent = `DERNI\xC8RES PLACES ! (${c})`),
              t.appendChild(b);
          }
          return t;
        },
        f = function (n) {
          if (!s) return;
          let S = [...new Set(n.map((t) => t.date))].sort();
          s.innerHTML = `
        <h3 class="dropdown-title">Filtrer par date</h3>
        <div class="date-option ${u === "all" ? "selected" : ""}">
          <input type="radio" name="date-filter" id="date-all" value="all" ${
            u === "all" ? "checked" : ""
          } hidden>
          <span class="radio-custom"></span>
          <label for="date-all">Toutes les dates</label>
        </div>
        
        ${S.map(
          (t) => `
            <div class="date-option ${u === t ? "selected" : ""}">
              <input type="radio" name="date-filter" id="date-${t}" value="${t}" ${
            u === t ? "checked" : ""
          } hidden>
              <span class="radio-custom"></span>
              <label for="date-${t}">${I(t)}</label>
            </div>
          `
        ).join("")}
        <button class="apply-button">Appliquer</button>
      `;
        },
        L = function () {
          let n = p.querySelectorAll(".card, .card-reverse"),
            S = i.value.toLowerCase(),
            t = 0,
            c = 0;
          if (
            (n.forEach((a) => {
              let d = a.artistData,
                m = !0;
              S && (m = d.artist.toLowerCase().includes(S)),
                m && u !== "all" && (m = d.date === u),
                m && g && (m = 1e3 - d.ticketsSold >= 5),
                (a.style.display = m ? "" : "none"),
                m && (t++, a.querySelector(".sold-out-badge") && c++);
            }),
            o)
          ) {
            let a = u === "all" ? "Dates" : I(u);
            o.innerHTML = `
          <span class="filter-icon">\u{1F4C5}</span>
          <span class="button-text">${a}</span>
        `;
          }
        };
      var Q = y,
        W = f,
        X = L;
      let i = document.getElementById("search-input"),
        l = document.getElementById("hide-sold-out"),
        e = document.getElementById("sort-price"),
        r = document.getElementById("reset-filters"),
        p = document.querySelector(".cards-container"),
        o = document.getElementById("date-filter"),
        s = document.getElementById("date-dropdown"),
        g = !1,
        v = "asc",
        u = "all";
      fetch("data/festival.json")
        .then((n) => n.json())
        .then((n) => {
          if (
            (n.forEach((t, c) => {
              let a = y(t, c % 2 !== 0);
              p.appendChild(a);
            }),
            f(n),
            o && s)
          ) {
            o.addEventListener("click", (c) => {
              c.stopPropagation(),
                s.classList.toggle("active"),
                o.classList.toggle("active");
            }),
              s.addEventListener("click", (c) => {
                let a = c.target.closest(".date-option");
                if (a) {
                  let d = a.querySelector('input[type="radio"]');
                  d && ((u = d.value), L());
                }
              });
            let t = s.querySelector(".apply-button");
            t &&
              t.addEventListener("click", () => {
                s.classList.remove("active"), o.classList.remove("active");
              }),
              document.addEventListener("click", (c) => {
                !o.contains(c.target) &&
                  !s.contains(c.target) &&
                  (s.classList.remove("active"), o.classList.remove("active"));
              });
          }
          l &&
            l.addEventListener("click", () => {
              (g = !g), l.classList.toggle("active"), L();
            }),
            e &&
              e.addEventListener("click", () => {
                (v = v === "asc" ? "desc" : "asc"),
                  (e.innerHTML = `
              <span class="filter-icon">\u{1F4B0}</span>
              <span class="button-text">Prix: ${
                v === "asc" ? "Croissant" : "D\xE9croissant"
              }</span>
            `),
                  e.classList.toggle("active"),
                  S();
              }),
            r &&
              r.addEventListener("click", () => {
                (i.value = ""),
                  (g = !1),
                  (v = "asc"),
                  (u = "all"),
                  l.classList.remove("active"),
                  e.classList.remove("active"),
                  o.classList.remove("active"),
                  s.classList.remove("active"),
                  (e.innerHTML = `
              <span class="filter-icon">\u{1F4B0}</span>
              <span class="button-text">Prix: Croissant</span>
            `),
                  (o.innerHTML = `
              <span class="filter-icon">\u{1F4C5}</span>
              <span class="button-text">Dates</span>
            `);
                let t = s.querySelector("#date-all");
                t && (t.checked = !0);
                let c = Array.from(p.querySelectorAll(".card, .card-reverse"));
                c.sort((a, d) => {
                  let m = Array.from(p.children).indexOf(a),
                    q = Array.from(p.children).indexOf(d);
                  return m - q;
                }),
                  c.forEach((a, d) => {
                    (a.className = d % 2 !== 0 ? "card-reverse" : "card"),
                      p.appendChild(a);
                  }),
                  L();
              });
          function S() {
            let t = Array.from(p.querySelectorAll(".card, .card-reverse"));
            t.sort((c, a) => {
              let d = c.artistData.price,
                m = a.artistData.price;
              return v === "asc" ? d - m : m - d;
            }),
              t.forEach((c, a) => {
                (c.className = a % 2 !== 0 ? "card-reverse" : "card"),
                  p.appendChild(c);
              });
          }
          i &&
            i.addEventListener("input", () => {
              L();
            });
        })
        .catch((n) => {
          console.error("Erreur:", n),
            (p.innerHTML = `<p style="color: white;">Erreur lors du chargement des donn\xE9es: ${n.message}</p>`);
        });
    }
    function J() {
      let i = document.querySelector(".equalizer-toggle"),
        l = document.querySelector(".equalizer");
      i &&
        l &&
        i.addEventListener("click", function () {
          this.classList.toggle("paused"), l.classList.toggle("paused");
        });
    }
    J();
  });
})();
