var data = null;
var setting = null;

chrome.runtime.sendMessage({
	message: "init"
}, function(response) {
	data = response.data;
	setting = response.setting;
});

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
	if (request.message == "update") {
		this.data = request.data;
		this.setting = request.setting;
	}
});