const STORAGE_KEY = "archives_v1";//ai storage stuff

let images = [];
let currentIndex = 0;
//title/text
const title = document.getElementById("archive-title");
const subtitle = document.getElementById("archive-subtitle");
const viewport = document.getElementById("viewer-section");
const error = document.getElementById("error-section"); //failsafe but shouldn't be necessary atp
//elments
const img = document.getElementById("screenshot-image");
const caption = document.getElementById("image-caption");
const story = document.getElementById("archive-story");
//controls
const first = document.getElementById("first");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const last = document.getElementById("last");
const random = document.getElementById("random");
const counter = document.getElementById("counter");

function loadArchives() { //see uploads.js
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error("Could not parse archives_v1", e);
        return [];
    }
}

function getArchiveIdFromUrl() { // tracking correct archive
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function showImage(index) { //may set limit cause space issues
    if (index < 0) index = 0;
    if (index >= images.length) index = images.length - 1;
    currentIndex = index;
    const imgData = images[currentIndex];
    img.src = imgData.dataUrl;
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
    if (caption) {
        const captext = imgData.caption ? imgData.caption.trim() : "";
        if (captext) { // have not tested stuff like accents
            caption.textContent = captext;
            caption.classList.remove("no-caption");
        } else {
            caption.textContent = "no caption";
            caption.classList.add("no-caption");
        }
        caption.style.display = "block";
    }
}

//initialize display process
function init() {
    const archiveId = getArchiveIdFromUrl();
    const archives = loadArchives();
    const archive = archives.find(a => a.id === archiveId);
    images = archive.images || [];
    title.textContent = archive.name || "Archive";
    if (archive.description) {
        subtitle.textContent = archive.description;
    } else {
        subtitle.textContent = "";
    }
    if (!images.length) {
        viewport.style.display = "none";
        error.style.display = "block";
        const msg = error.querySelector(".subheader-text");
        if (msg) msg.textContent = "This archive has no images yet."; // this shouldn't be a possible issue (rn) but i added this anyways
        return;
    }
    if (story) {
        if (archive.longDescription) {
            story.textContent = archive.longDescription;
            story.style.display = "block";
        } else {
            story.style.display = "none";
        }
    }
    viewport.style.display = "block";
    error.style.display = "none";
    // controls
    first.addEventListener("click", () => showImage(0));
    last.addEventListener("click", () => showImage(images.length - 1));
    prev.addEventListener("click", () => showImage(currentIndex - 1));
    next.addEventListener("click", () => showImage(currentIndex + 1));
    random.addEventListener("click", () => {
        const randomIndex = Math.floor(Math.random() * images.length);
        showImage(randomIndex);
    });
    showImage(0);
}

init();
