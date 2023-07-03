const page = document.getElementById("page");

chrome.tabs.query({ active: true, lastFocusedWindow: true }).then((result) => {
    console.log(result[0].url);
    page.setAttribute("src", `http://localhost:3000/browser?url=${result[0].url}`);
});
