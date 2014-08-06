var settingManager = new SettingManager();


function openTab(url, window_id) {
	chrome.tabs.create({
			windowId: window_id,
			url: url,
			selected: false
	}, function(tab) {
		chrome.tabs.update(tab.id, {selected: true});
		setTimeout(function() {
			chrome.tabs.executeScript(tab.id, {
				code: "document.getElementById(\"play\").click();",
				//runAt: "document_idle" -> not reliable
			});
		} ,5000); // 5 seconds after creating the page?
	});
}

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
	switch (request.message) {
	case "match":
			chrome.windows.getCurrent(function(window) {
				openTab(request.info[0].url, window.id);
			});
		break;
	case "init":
		callback(settingManager.load());
		break;
	case "update":
		settingManager.save(request.setting);
		chrome.windows.getAll({
			populate: true
		}, function(windowList) {
			windowList.forEach(function(window) {
				window.tabs.forEach(function(tab) {
					chrome.tabs.sendMessage(tab.id, {
						message: 'update',
						settings: settingManager.load()
					}, null);
				})
			})
		});
		break;
	}
});


if (!settingManager.isInit()) {
	// initialize settings manager with defaults and to stop this appearing again
	settingManager.init();
	
	// inject content script into windows currently open to apply extension
	chrome.windows.getAll({ populate: true }, function(windows) {
		for (var i = 0; i < windows.length; ++i) {
			for (var j = 0; j < windows[i].tabs.length; ++j) {
				// if doesn't match http://dulst.com/touhourso, then skip
				if (!/^http:\/\/dulst.com\/touhourso/.test(windows[i].tabs[j].url)) continue;
				chrome.tabs.executeScript(windows[i].tabs[j].id, { 
					file: "../content_scripts/masutasupaku.js" 
				});
			}
		}
	});
} else if (!settingManager.isLatest()) {
	settingManager.update();
}