var CurrentVersion = "1.0";

function DataManager() {}

DataManager.prototype.init = function() {
	// default data for first time user
	var data = {
		"audio": {
			"intro": "http://cdn4.dulst.com/cardSrcMedia/18uauavl4_op1.mp3",
			"nudge": "http://cdn4.dulst.com/cardSrcMedia/18uat6irv_mukyuu.mp3"
		}
	};
	
	// save data to local storage
	localStorage["Masutasupaku-data"] = JSON.stringify(data);
	localStorage["Masutasupaku-data-version"] = 1.0;
	return data;
}

DataManager.prototype.isInit = function() {
	return (localStorage["Masutasupaku-data-version"] != undefined);
}

DataManager.prototype.isLatest = function() {
	return (localStorage["Masutasupaku-data-version"] == CurrentVersion);
}

DataManager.prototype.update = function() {
	if (!this.isInit()) {
		this.init();
	}
}

DataManager.prototype.save = function(data) {
	// remove any error messages from object (shouldn't be there)
	if (data.hasOwnProperty("error")) {
		delete data.error;
	}
	localStorage["Masutasupaku-data"] = JSON.stringify(data);
}

DataManager.prototype.load = function() {
	// load data from local storage
	var data = localStorage["Masutasupaku-data"];
	try {
		// parse, if unable then make the assumption it has been corrupted
		return JSON.parse(data)
	} catch(error) {
		var data = this.init();
		data.error = "Error: " + error + "|Data:" + data;
		return data;
	}
}