var settingManager = new SettingManager();
var dataManager = new DataManager();


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
		callback({
			data: dataManager.load(),
			setting: settingManager.load()
		});
		break;
	case "update":
		dataManager.save(request.data);
		settingManager.save(request.setting);
		chrome.windows.getAll({
			populate: true
		}, function(windowList) {
			windowList.forEach(function(window) {
				window.tabs.forEach(function(tab) {
					chrome.tabs.sendMessage(tab.id, {
						message: 'update',
						data: dataManager.load(),
						setting: settingManager.load()
					}, null);
				})
			})
		});
		break;
	}
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (tab.url.match(/http:\/\/dulst.com\/touhourso\/play\//gi) != null) {
		if (settingManager.load().audio && changeInfo.status == "complete") {
			new Audio (dataManager.load().audio.intro).play();
		}
	}
});


if (!dataManager.isInit()) {
	// initialize data manager with defaults and to stop this appearing again
	dataManager.init();
	
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
} else if (!dataManager.isLatest()) {
	dataManager.update();
}

if (!settingManager.isInit()) {
	// initialize setting manager with defaults and to stop this appearing again
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