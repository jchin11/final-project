const STORAGE_KEY = "archives_v1"; //ai storage stuff
const params = new URLSearchParams(window.location.search); //ai variable meant to label specific archives so you dont pull the wrong one
const archiveId = params.get("id"); //ai variable for selected archive

//features
const fileupload = document.getElementById("file-input");
const addbtn = document.getElementById("add-btn");
const title = document.getElementById("archive-title");
const captioninput = document.getElementById("add-caption");

function loadArchives() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveArchives(list) { //ai made this as a failsafe incase local storage blows up
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
        console.error("Error saving archives:", e);
        alert(
            "Your browser storage is full.\n\n" +
            "Try deleting some older archives or adding fewer / smaller images."
        );
    }
}

// convert to base64
function readAsDataURL(fileObj) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(fileObj);
    });
}

const archives = loadArchives();
const archive = archives.find(a => a.id === archiveId); //pulling browser data 

// check archive validity
if (!archive) {
    title.textContent = "Archive Not Found";
    if (addbtn) addbtn.disabled = true;
} else {
    title.textContent = `Add Images to "${archive.name}"`;
}

// add images feature
if (addbtn) {
    addbtn.addEventListener("click", async () => {
        const files = Array.from(fileupload.files || []);
        if (!files.length) {
            alert("select some images first.");
            return;
        }
        const caption = captioninput.value.trim();
        const newImages = await Promise.all(
            files.map(async f => ({
                name: f.name,
                dataUrl: await readAsDataURL(f),
                caption: caption || ""          //caption loc
            }))
        );
        if (!Array.isArray(archive.images)) {
            archive.images = [];
        }
        archive.images.push(...newImages);
        archive.updatedAt = new Date().toISOString(); //just would not work
        saveArchives(archives);
        if (confirm("Images added! View the archive now?")) {
            window.location.href = `viewer.html?id=${archive.id}`;
        } else {
            window.location.href = "index.html";
        }
    });
}
