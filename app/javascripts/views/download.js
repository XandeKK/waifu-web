const download = document.querySelector("#download");
const output = document.querySelector("#output");

download.addEventListener("click", ()=> {
	var zip = new JSZip();

	window.images.forEach((img)=> {
		zip.file(img['filename'], img['blob']);
	});

	zip.generateAsync({type:"blob"})
	.then(function(content) {
	    saveAs(content, crypto.randomUUID() + ".zip");
	});
});
