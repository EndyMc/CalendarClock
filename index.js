function handleClientLoad() {
	gapi.load("client:auth2", initClient);
}

function initClient() {
	// Client ID and API key from the Developer Console
	var CLIENT_ID = '967759234224-l9a4t1miivg1acl993a8curb8er9uj45.apps.googleusercontent.com';
	var API_KEY = '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';

	// Array of API discovery doc URLs for APIs used by the quickstart
	var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

	// Authorization scopes required by the API; multiple scopes can be
	// included, separated by spaces.
	var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

	gapi.client.init({
		apiKey: API_KEY,
		clientId: CLIENT_ID,
		discoveryDocs: DISCOVERY_DOCS,
		scope: SCOPES
	  }).then(() => {
		// Listen for sign-in state changes.
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

		// Handle the initial sign-in state.
		if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
			CalendarEvent.update();
		} else {
			gapi.auth2.getAuthInstance().signIn();
		}
	  }, console.error);
}

function init() {
	render();
}

function render() {
	renderClock();
	renderEvent();

	setTimeout(render, new Date().getTime() % 1000);
}

function renderClock() {
	var d = new Date();
	
	var clock = document.getElementById('clock');
	clock.innerHTML = addPadding(d.getHours(), 2) + ":" + addPadding(d.getMinutes(), 2) + "<span style='font-size: 5vw;'>" + addPadding(d.getSeconds(), 2) + "</span>";
}	

function addPadding(text, maxlength) {
	text = String(text);
	while (text.length < maxlength) {
		text = "0" + text;
	}
	
	return text;
}

function renderEvent() {

}

/*function renderLesson() {
	var lesson = lessons.getCurrentLesson();
	var lessonC = document.getElementById('lesson');
	
	var typeColor = "coral";
	var startColor = "lightgreen";
	var endColor = "aqua";
	var placeColor = "red";

	if (lesson == undefined) {
		var d = new Date();
		var clock = document.getElementById('clock-top');
		document.title = "Clock: " + addPadding(d.getHours(), 2) + ":" + addPadding(d.getMinutes(), 2)
		lessonC.innerHTML = "";
		
		clock.style.top = "calc((100vh - " + clock.offsetHeight + "px) / 2)";
	} else if (lesson.type == "Rast") {
		var next = lessons.getNextLesson();
		document.title = lesson.type + " -> " + next.type.replace("&auml;", "\u00E4").replace("&ouml;", "\u00F6").replace("&aring;", "\u00E5") + " (" + addPadding(next.startTime.getHours(), 2) + ":" + addPadding(next.startTime.getMinutes(), 2) + " - " + addPadding(next.endTime.getHours(), 2) + ":" + addPadding(next.endTime.getMinutes(), 2) + ", " + next.place + ")";
		
		lessonC.innerHTML = "N&auml;sta lektion: <span style='color: " + typeColor + ";'>" + next.type + "</span> (<span style='color: " + startColor + ";'>" + addPadding(next.startTime.getHours(), 2) + "<span style='color: white;'>:</span>" + addPadding(next.startTime.getMinutes(), 2) + "</span> - <span style='color: " + endColor + ";'>" + addPadding(next.endTime.getHours(), 2) + "<span style='color: white;'>:</span>" + addPadding(next.endTime.getMinutes(), 2) + "</span>)<br> Plats: (<span style='color: " + placeColor + ";'>" + next.place + "</span>)";
	} else {
		document.title = lesson.type.replace("&auml;", "\u00E4").replace("&ouml;", "\u00F6").replace("&aring;", "\u00E5") + " (" + addPadding(lesson.startTime.getHours(), 2) + ":" + addPadding(lesson.startTime.getMinutes(), 2) + " - " + addPadding(lesson.endTime.getHours(), 2) + ":" + addPadding(lesson.endTime.getMinutes(), 2) + ", " + lesson.place + ")";
		
		lessonC.innerHTML = "Nuvarande lektion: <span style='color: " + typeColor + ";'>" + lesson.type + "</span> (<span style='color: " + startColor + ";'>" + addPadding(lesson.startTime.getHours(), 2) + "<span style='color: white;'>:</span>" + addPadding(lesson.startTime.getMinutes(), 2) + "</span> - <span style='color: " + endColor + ";'>" + addPadding(lesson.endTime.getHours(), 2) + "<span style='color: white;'>:</span>" + addPadding(lesson.endTime.getMinutes(), 2) + "</span>)<br> Plats: (<span style='color: " + placeColor + ";'>" + lesson.place + "</span>)";
	}
}*/