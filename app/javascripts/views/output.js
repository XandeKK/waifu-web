document.querySelector("#form").addEventListener("submit", (event)=>{
	event.preventDefault();

	const output = document.querySelector("#output");
	const data = new FormData(event.target);
	const model = data.get('model');
	const files = [...document.querySelector("#files").files];

	files.forEach(async (file) => {
		const data_to_send = new FormData();

		data_to_send.append("model", model);
		data_to_send.append("file", file);

		const response = await postData("/upload", data_to_send);

		const img = document.createElement("img");
		img.src = "/image/" + response.image_path;

		output.append(img);
	})
})

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    body: data,
  });

  return response.json();
}
