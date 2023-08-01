chrome.cookies.get({ url: "http://localhost:3000", name: "jwt" });

chrome.contextMenus.create({
    id: "save-menu",
    title: "Save to Memcache",
});

chrome.contextMenus.onClicked.addListener((info) => {
    chrome.tabs.create({
        url: `http://localhost:3000/browser-extension?url=${info.pageUrl}`,
    });
});
