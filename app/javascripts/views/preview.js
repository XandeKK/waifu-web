const preview = (file) => {
    let doc_preview = document.querySelector('#preview');
    doc_preview.innerHTML = "";
    const fr = new FileReader();
    fr.onload = () => {
        const img = document.createElement("img");
        img.src = fr.result;  // String Base64 
        img.alt = file.name;
        img.classList.add("h-28")
        doc_preview.append(img);
    };
    fr.readAsDataURL(file);
};

document.querySelector("#files").addEventListener("change", (ev) => {
    if (!ev.target.files) return; // Do nothing.
    [...ev.target.files].forEach(preview);
});