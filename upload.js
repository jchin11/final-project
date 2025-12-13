const STORAGE_KEY = "archives_v1"; //ai storage stuff

//features for upload process
const nameInput = document.getElementById("archive-name");
const desc = document.getElementById("archive-description");
const longdesc = document.getElementById("archive-story");
const file = document.getElementById("file-input");
const save = document.getElementById("save-archive");
// Couldn't figure out how to configure backend + external server, so asked ai for a local solution for this project. gave me this set of functions (the first 3 here + a couple more lines for text -> image) that basically retains data until the user clears their browser storage. Turns the images into base64 (text) to mitigate space usage.

function loadArchives() {  //retrieve all the saved archives
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveArchives(list) { //load saved archives + failsafe ai made incase local storage exceeds certain limit (unsure the specifics on size limits could be browser specific )
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

// convert an uploaded File into a Base64 data URL
function readAsDataURL(fileObj) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(fileObj);
    });
}

//save archive locally
save.addEventListener("click", async () => {
    const files = Array.from(file.files);
    if (!files.length) {
        alert("Select some images first.");
        return;
    }
    const archiveName = nameInput.value.trim() || "Untitled Archive";
    let description = desc.value.trim();
    if (description) {
        const words = description.split(/\s+/).filter(Boolean); // word max 
        if (words.length > 20) {
            alert("Short description must be 20 words or fewer.");
            return;
        }
    }
    const longDescription = longdesc.value.trim();
    // image -> text
    const images = await Promise.all(
        files.map(async f => ({
            name: f.name,
            dataUrl: await readAsDataURL(f)
        }))
    );
    const archives = loadArchives();
    const newArchive = { //all saved data
        id: "archive-" + Date.now(),
        name: archiveName,
        description,
        longDescription,
        createdAt: new Date().toISOString(), //not visible yet, was creating issues
        images
    };
    archives.push(newArchive);
    saveArchives(archives);
    if (confirm("Success. Would you like to view it now?")) {
        window.location.href = `viewer.html?id=${newArchive.id}`;
    } else {
        window.location.href = "index.html";
    }
});
