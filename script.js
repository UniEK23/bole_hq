const CONFIG = {
  name: "Bole HQ",
  whatsapp: "2348129465116",
  address: "26 Sylvanus Okon Ave, Uyo 520101, Akwa Ibom",
  opens: "10 AM",
  comboPrice: 3500, // from Bole HQ's own combo flyer
};

// Shows "Ask for price". Fill prices once confirmed.
const MENU = [
  {
    name: "Bole (roasted plantain)",
    desc: "Grilled to perfection with our secret blend of spices, served with onions and sauce.",
    price: null,
    star: true,
  },
  {
    name: "Grilled fish",
    desc: "Fresh fish grilled over the fire and finished with spicy pepper sauce.",
    price: null,
  },
  {
    name: "Chicken gizzard",
    desc: "Tender, spicy and grilled until golden.",
    price: null,
  },
  {
    name: "Yam fries",
    desc: "Crispy, seasoned and perfect beside your bole.",
    price: null,
  },
  {
    name: "Potato fries",
    desc: "Golden fries with a light seasoning.",
    price: null,
  },
  {
    name: "Skewers",
    desc: "Spiced, grilled meat on a stick. Great on its own or with bole.",
    price: null,
  },
];
/* ================================== */

const naira = (n) => "₦" + n.toLocaleString("en-NG");
const wa = (text) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

// menu
const grid = document.getElementById("menuGrid");
MENU.forEach((m) => {
  const el = document.createElement("article");
  el.className = "item reveal" + (m.star ? " star" : "");
  const price = m.price
    ? `<span class="price">${naira(m.price)}</span>`
    : `<span class="price ask">Ask for price</span>`;
  el.innerHTML = `<h3></h3><p></p><div class="row">${price}<a class="add" target="_blank" rel="noopener">Order</a></div>`;
  el.querySelector("h3").textContent = m.name;
  el.querySelector("p").textContent = m.desc;
  el.querySelector(".add").href = wa(
    `Hi ${CONFIG.name}, I'd like to order: ${m.name}.`,
  );
  grid.appendChild(el);
});

// generic WhatsApp links
document.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = wa(a.dataset.wa);
  a.target = "_blank";
  a.rel = "noopener";
});

// combo builder
let qty = 1;
const qtyEl = document.getElementById("qty");
const totalEl = document.getElementById("total");
const orderBtn = document.getElementById("comboOrder");
const val = (name) =>
  document.querySelector(`input[name="${name}"]:checked`).value;

function update() {
  qtyEl.textContent = qty;
  totalEl.textContent = naira(CONFIG.comboPrice * qty);
  const msg = `Hi ${CONFIG.name}, I'd like to order ${qty} combo${qty > 1 ? "s" : ""} (${naira(CONFIG.comboPrice)} each): bole + ${val("fries")} + ${val("grill")} + Coca-Cola. Total ${naira(CONFIG.comboPrice * qty)}.`;
  orderBtn.href = wa(msg);
  orderBtn.target = "_blank";
  orderBtn.rel = "noopener";
}
document.getElementById("plus").onclick = () => {
  qty = Math.min(qty + 1, 20);
  update();
};
document.getElementById("minus").onclick = () => {
  qty = Math.max(qty - 1, 1);
  update();
};
document
  .querySelectorAll(".builder input")
  .forEach((i) => i.addEventListener("change", update));
update();

// mobile nav
const btn = document.getElementById("menuBtn"),
  nav = document.getElementById("nav");
btn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }),
);

// reveal on scroll
const io =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 },
      )
    : null;
document
  .querySelectorAll(".reveal")
  .forEach((el) => (io ? io.observe(el) : el.classList.add("in")));

// lightbox
const lb = document.getElementById("lb"),
  lbImg = lb.querySelector("img");
document.querySelectorAll("[data-lb]").forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    lbImg.src = a.href;
    lbImg.alt = a.querySelector("img").alt;
    lb.hidden = false;
  }),
);
const closeLb = () => {
  lb.hidden = true;
};
lb.addEventListener("click", (e) => {
  if (e.target !== lbImg) closeLb();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLb();
});

document.getElementById("year").textContent = new Date().getFullYear();
