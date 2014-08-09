var CurrentVersion = "1.0";

function SettingManager() {}

SettingManager.prototype.init = function() {
	// default setting for first time user
	var setting = {
		"audio": true
	};
	
	// save setting to local storage
	localStorage["Masutasupaku-setting"] = JSON.stringify(setting);
	localStorage["Masutasupaku-setting-version"] = 1.0;
	return setting;
}

SettingManager.prototype.isInit = function() {
	return (localStorage["Masutasupaku-setting-version"] != undefined);
}

SettingManager.prototype.isLatest = function() {
	return (localStorage["Masutasupaku-setting-version"] == CurrentVersion);
}

SettingManager.prototype.update = function() {
	if (!this.isInit()) {
		this.init();
	}
}

SettingManager.prototype.save = function(setting) {
	// remove any error messages from object (shouldn't be there)
	if (setting.hasOwnProperty("error")) {
		delete setting.error;
	}
	localStorage["Masutasupaku-setting"] = JSON.stringify(setting);
}

SettingManager.prototype.load = function() {
	// load data from local storage
	var data = localStorage["Masutasupaku-setting"];
	try {
		// parse, if unable then make the assumption it has been corrupted
		return JSON.parse(data)
	} catch(error) {
		var setting = this.init();
		setting.error = "Error: " + error + "|Data:" + data;
		return setting;
	}
}