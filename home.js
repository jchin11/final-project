const STORAGE_KEY = "archives_v1"; //ai storage stuff

//see add.js
function loadArchives() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveArchives(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
//delete
function deleteArchive(id) {
    const del = confirm(
        "Delete this archive from this local storage? Permanent!"
    );
    if (!del) return;

    const archives = loadArchives().filter(a => a.id !== id);
    saveArchives(archives);
    renderArchives();
}
//go thru all archives + display structure for each card
function renderArchives() {
    const archives = loadArchives();
    const list = document.getElementById("your-archives");
    const msg = document.getElementById("no-archives-message");

    list.innerHTML = "";

    if (!archives.length) { //failsafe
        msg.style.display = "block";
        return;
    }

    msg.style.display = "none";

 //internal card structure.  
    archives.forEach(a => {
        const card = document.createElement("article");
        card.className = "archive-card";

        // thumb from first image
        if (a.images && a.images.length && a.images[0].dataUrl) {
            const thumb = document.createElement("img");
            thumb.className = "archive-thumb";
            thumb.src = a.images[0].dataUrl;
            card.appendChild(thumb);
        }
        const title = document.createElement("h3"); 
        title.textContent = a.name;
        card.appendChild(title);

        const meta = document.createElement("p"); 
        meta.textContent = `${a.images.length} images`;
        card.appendChild(meta);

        if (a.description) {
            const desc = document.createElement("p"); 
            desc.className = "archive-description";
            desc.textContent = a.description;
            card.appendChild(desc);
        }

        const controls = document.createElement("div");
        controls.className = "controls archive-controls";

        const viewnav = document.createElement("a");
        viewnav.className = "nav-button";
        viewnav.href = `viewer.html?id=${a.id}`;
        viewnav.textContent = "View";

        const addnav = document.createElement("a");
        addnav.className = "nav-button";
        addnav.href = `add.html?id=${a.id}`;
        addnav.textContent = "+";

        const deletebtn = document.createElement("button");
        deletebtn.className = "nav-button delete-button";
        deletebtn.textContent = "Delete";
        deletebtn.addEventListener("click", () => deleteArchive(a.id));

        controls.appendChild(viewnav);
        controls.appendChild(addnav);
        controls.appendChild(deletebtn);

        card.appendChild(controls);

        list.appendChild(card);
    });
}

renderArchives();
