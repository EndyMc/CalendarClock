function handleClientLoad() {
	gapi.load("client:auth2", initClient);
}

function initClient() {
	// Client ID and API key from the Developer Console
	var CLIENT_ID = '967759234224-l9a4t1miivg1acl993a8curb8er9uj45.apps.googleusercontent.com';
	var API_KEY = 'AIzaSyARog187NEwKAzOEA-Bq-J6_HI2dI5fbTU';

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
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

		// Start the calendar-updater
		updateCalendarEvents();
	}).catch(console.error);
}

function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
		Calendar.update();
	} else {
		gapi.auth2.getAuthInstance().signIn();
	}
}

function init() {
	render();
}

function updateCalendarEvents() {
	// 1 hour in milliseconds
	var updateRate = 1e3 * 60 * 60;

	// Fetch calendar events
	Calendar.update();

	// Wait until the next hour. Then re-fetch.
	setTimeout(updateCalendarEvents, updateRate - (new Date().getTime() % updateRate));
}

function render() {
	// 1 second in milliseconds
	var updateRate = 1e3;

	// Render
	renderClock();
	renderEvent();

	// Wait until the next second. Then re-render.
	setTimeout(render, updateRate - (new Date().getTime() % updateRate));
}

function renderClock() {
	var d = new Date();
	
	var clock = document.getElementById('clock');
	clock.innerHTML = addPadding(d.getHours(), 2) + ":" + addPadding(d.getMinutes(), 2) + "<span style='font-size: 5vw;'>" + addPadding(d.getSeconds(), 2) + "</span>";
}	

function addPadding(text, maxlength) {
	// Make the given text to a string (could be given a number or other non-string element)
	text = String(text);

	// Prepend a "0" to the given text until it's the wanted length.
	while (text.length < maxlength) {
		text = "0" + text;
	}
	
	return text;
}

function renderEvent() {
	var d = new Date();
	var calendarEventClock = document.getElementById('calendar-event');

	document.title = "Clock: " + addPadding(d.getHours(), 2) + ":" + addPadding(d.getMinutes(), 2);

	try {
		var event = Calendar.getCurrentEvent();

		calendarEventClock.innerHTML = "<span>" + event.getName() + "</span><br><span>" + event.getStartTimeAsText() + "</span> - <span>" + event.getEndTimeAsText() + "</span><br><span>" + event.getTimeAsText() + "</span>";

	} catch(err) {
		calendarEventClock.innerHTML = "There are no more scheduled events for today";
	}
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