window.notificationID = 1;
window.dataManager = new DataManager();
window.settingManager = new SettingManager();

/* Set icon */
if (window.settingManager.load().audio) {
	chrome.browserAction.setIcon({path:"assets/images/Hakkero32.png"}, function() {});
} else {
	chrome.browserAction.setIcon({path:"assets/images/Hakkero32off.png"}, function() {});
}
/* This is for the icon click audio toggle */
chrome.browserAction.onClicked.addListener(function() {
	if (window.settingManager.load().audio) {
		chrome.browserAction.setIcon({path:"assets/images/Hakkero32off.png"}, function() {});
	} else {
		chrome.browserAction.setIcon({path:"assets/images/Hakkero32.png"}, function() {});
	}
	var save = window.settingManager.load();
	save.audio = !save.audio;
	window.settingManager.save(save);
});

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
	switch (request.message) {
	case "init":
		callback({
			data: window.dataManager.load(),
			setting: window.settingManager.load()
		});
		break;
	case "update":
		window.dataManager.save(request.data);
		window.settingManager.save(request.setting);
		chrome.windows.getAll({
			populate: true
		}, function(windowList) {
			windowList.forEach(function(window) {
				window.tabs.forEach(function(tab) {
					chrome.tabs.sendMessage(tab.id, {
						message: 'update',
						data: window.dataManager.load(),
						setting: window.settingManager.load()
					}, null);
				})
			})
		});
		break;
	case "getSetting":
		callback(window.settingManager.load());
		break;
	case "getData":
		callback(window.dataManager.load());
		break;
	case "setSetting":
		window.settingManager.save(request.setting);
		callback(window.settingManager.load());
		break;
	case "setData":
		window.dataManager.save(request.data);
		callback(window.dataManager.load());
		break;
	}
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (tab.url.match(/http:\/\/dulst.com\/touhourso\/play\//gi) != null) {
		if (changeInfo.status == "complete") {
			chrome.notifications.create((window.notificationID++).toString(), {
				type: "basic",
				title: "RSO Match",
				message: "Your match is ready",
				iconUrl: chrome.runtime.getURL("assets/images/Hakkero128x64.png")
			}, function() {});
			if (window.settingManager.load().audio) {
				new Audio (window.dataManager.load().audio.intro).play();
			}
		}
	}
});


if (!window.dataManager.isInit()) {
	// initialize data manager with defaults and to stop this appearing again
	window.dataManager.init();
	
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
} else if (!window.dataManager.isLatest()) {
	window.dataManager.update();
}

if (!window.settingManager.isInit()) {
	// initialize setting manager with defaults and to stop this appearing again
	window.settingManager.init();
	
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
} else if (!window.settingManager.isLatest()) {
	window.settingManager.update();
}