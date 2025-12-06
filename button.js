let currentIndex = 0;


const img = document.getElementById("screenshot-image");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const counte = document.getElementById("counter");

const first = document.getElementById("first");
const last = document.getElementById("last");
const random = document.getElementById("random");

function showImage(index) {
  if (!images || images.length === 0) return;
  if (index < 0) index = 0;
  if (index >= images.length) index = images.length - 1;

  currentIndex = index;

  img.src = images[currentIndex];
  counter.textContent = `${currentIndex + 1} / ${images.length}`;

  prev.disabled = currentIndex === 0;
  next.disabled = currentIndex === images.length - 1;
}

prev.addEventListener("click", () => showImage(currentIndex - 1));
next.addEventListener("click", () => showImage(currentIndex + 1));

first.addEventListener("click", () => showImage(0));
last.addEventListener("click", () => showImage(images.length - 1));

random.addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * images.length);
  showImage(randomIndex);
});

showImage(0);
