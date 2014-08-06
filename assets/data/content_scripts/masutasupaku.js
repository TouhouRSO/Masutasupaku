var setting = null;

chrome.runtime.sendMessage({
	message: "init"
}, function(response) {
	setting = response;
});

chrome.runtime.onMessage.addListener(function(request, sender, callback){
	if (request.message == "update") {
		this.setting = request.setting;
	}
});