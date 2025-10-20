const garden = document.getElementById("garden");
const form = document.getElementById("thoughtForm");
const input = document.getElementById("thoughtInput");
const resetBtn = document.getElementById("resetBtn");

let thoughts = JSON.parse(localStorage.getItem("thoughts")) || [];

/* --- Colori pastello per i fiori --- */
function randomColor() {
  const colors = ["#eac7c7", "#c7e9b0", "#dcd6f7", "#f7e3af", "#f5c4d0"];
  return colors[Math.floor(Math.random() * colors.length)];
}

/* --- Calcola dimensione fiore e distanza in base allo schermo --- */
function getFlowerSettings() {
  const width = window.innerWidth;
  let flowerSize, minDistance;

  if (width <= 600) {
    flowerSize = 35;        // telefoni
    minDistance = 45;
  } else if (width <= 1024) {
    flowerSize = 45;        // tablet
    minDistance = 55;
  } else {
    flowerSize = 55;        // desktop
    minDistance = 65;
  }

  return { flowerSize, minDistance };
}

/* --- Disegna tutti i fiori nel giardino --- */
function renderGarden() {
  garden.innerHTML = "";

  setTimeout(() => {
    const rectGarden = garden.getBoundingClientRect();
    const placedFlowers = [];

    const { flowerSize, minDistance } = getFlowerSettings();

    thoughts.forEach(t => {
      const flower = document.createElement("div");
      flower.classList.add("flower");
// imposta la dimensione desiderata del fiore
const { flowerSize } = getFlowerSettings(); // o un numero fisso tipo 38
flower.style.setProperty('--size', `${flowerSize}px`);

      // struttura interna
      const flowerInner = document.createElement("div");
      flowerInner.classList.add("flower-inner");

      const flowerFront = document.createElement("div");
      flowerFront.classList.add("flower-front");

      // petali
      for (let i = 0; i < 5; i++) {
        const petal = document.createElement("div");
        petal.classList.add("petal");
        petal.style.background = t.color;
        // prima era: translate(10px)
petal.style.transform = `rotate(${i * 72}deg) translate(var(--petalOffset))`;

        flowerFront.appendChild(petal);
      }

      // centro
      const center = document.createElement("div");
      center.classList.add("center");
      flowerFront.appendChild(center);

      // retro (messaggio)
      const flowerBack = document.createElement("div");
      flowerBack.classList.add("flower-back");
      flowerBack.textContent = t.text;

      flowerInner.appendChild(flowerFront);
      flowerInner.appendChild(flowerBack);
      flower.appendChild(flowerInner);
      garden.appendChild(flower);

      /* --- POSIZIONAMENTO SICURO --- */
      const paddingTop = flowerSize * 0.8;
      const paddingBottom = flowerSize * 1.6;
      let attempts = 0;
      let placed = false;

      while (!placed && attempts < 400) {
        attempts++;
        const left = Math.random() * (rectGarden.width - flowerSize);
        const bottom =
          Math.random() *
            (rectGarden.height - flowerSize - paddingBottom - paddingTop) +
          paddingTop;

        const overlapping = placedFlowers.some(pos => {
          const dx = pos.left - left;
          const dy = pos.bottom - bottom;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < minDistance;
        });

        if (!overlapping) {
          flower.style.width = `${flowerSize}px`;
          flower.style.height = `${flowerSize}px`;
          flower.style.left = (left / rectGarden.width) * 100 + "%";
          flower.style.bottom = (bottom / rectGarden.height) * 100 + "%";
          placedFlowers.push({ left, bottom });
          placed = true;
        }
      }

      // --- MOVIMENTO E INTERAZIONE ---
      flower.style.animationDelay = `${Math.random() * 3}s`;
      flower.style.animationDuration = `${6 + Math.random() * 4}s`;

      flower.addEventListener("click", () => {
        flower.classList.toggle("flipped");
      });
    });
  }, 80);
}

/* --- Aggiungi un nuovo pensiero --- */
form.addEventListener("submit", e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const color = randomColor();
  const newThought = { text, color };

  thoughts.push(newThought);
  localStorage.setItem("thoughts", JSON.stringify(thoughts));
  input.value = "";
  renderGarden();
});

/* --- Reset giardino --- */
resetBtn.addEventListener("click", () => {
  if (confirm("Vuoi davvero resettare il giardino? 🌱")) {
    thoughts = [];
    localStorage.removeItem("thoughts");
    renderGarden();
  }
});

/* --- Render iniziale e ridisegno al resize --- */
window.addEventListener("load", renderGarden);
window.addEventListener("resize", () => {
  renderGarden();
});
