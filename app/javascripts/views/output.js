document.querySelector("#form").addEventListener("submit", (event)=>{
	event.preventDefault();

	window.images = []
	const output = document.querySelector("#output");
	const data = new FormData(event.target);
	const model = data.get('model');
	const noise_level = data.get('noise_level');
	const scale = data.get('scale');
	const gpu = data.get('gpu');
	const load_proc_save = data.get('load_proc_save');
	const files = [...document.querySelector("#files").files];

	files.forEach(async (file) => {
		const data_to_send = new FormData();

		data_to_send.append("model", model);
		data_to_send.append("noise_level", noise_level);
		data_to_send.append("scale", scale);
		data_to_send.append("gpu", gpu);
		data_to_send.append("load_proc_save", load_proc_save);
		data_to_send.append("file", file);

		const response = await postData("/upload", data_to_send);

		const img = document.createElement("img");
		const blob = await response.blob();
		window.images.push({'filename': file['name'],'img': response, 'blob': blob});
		img.src = URL.createObjectURL(blob);

		output.append(img);
	})
})

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    body: data,
  });

  return response;
}
