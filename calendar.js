class Calendar {
	static events = [];

	static update() {
		// This day, at 00:00.
		var minTime = new Time(undefined, undefined, undefined, 0, 0, 0).getRFCDate();
		// This day, at 23:59.
		var maxTime = new Time(undefined, undefined, undefined, 23, 59, 59).getRFCDate();

		// Fetch the events that happen this day.
		gapi.client.calendar.events.list({
			'calendarId': "primary",
			'timeMin': minTime,
			'timeMax': maxTime
		}).then((res) => {
			var events = res.result.items;
			var date = new Date();
			var ids = {};

			// Save the start and end-time for the event for easier comparasion
			events.forEach(ev => { 
				var start = Time.fromRFCDate(ev.start.date == undefined ? ev.start.dateTime : ev.start.date).getDate().getTime();
				var end = Time.fromRFCDate(ev.end.date == undefined ? ev.end.dateTime : ev.end.date).getDate().getTime();

				Calendar.events.push(new CalendarEvent(ev.summary, ev.id, start, end));
			});

			// Sort the events according to time (earliest first)
			Calendar.events.sort((ev1, ev2) => ev1.getStartTime() - ev2.getStartTime());

			// Remove all duplicate and/or expired events
			Calendar.events = Calendar.events.filter(obj => { 
				var isSingleton = ids[obj.id] == undefined;
				var isFullDayEvent = obj.getEndTime() - obj.getStartTime() == 1000 * 60 * 60 * 24;
				var hasExpired = obj.getEndTime() <= date.getTime();

				ids[obj.id] = true;
				
				return isSingleton && !hasExpired && !isFullDayEvent;
			});

			// Logging
			console.debug("Updated calendar-events");
			console.debug(Calendar.events);
		});
	}

	static getCurrentEvent() {
		if (Calendar.events.length > 0) {
			return Calendar.events[0];
		} else {
			throw new Error("There are no more scheduled events for today");
		}
	}
}

class CalendarEvent {
	/**
	 * 
	 * @param {string} name The name to be displayed
	 * @param {string} id The id given by Google
	 * @param {number} start The starttime in unix format
	 * @param {number} end The endtime in unix format
	 */
	constructor(name, id, start, end) {
		this.name = name;
		this.id = id;

		this.start = start;
		this.end = end;
	}

	getName() {
		return this.name;
	}

	getId() {
		return this.id;
	}

	getStartTime() {
		return this.start;
	}

	getStartTimeAsText() {
		var d = new Date(this.getStartTime() + (new Date().getTimezoneOffset() * 1000 * 60));

		return addPadding(d.getHours(), 2) + ":" + addPadding(d.getMinutes(), 2);
	}

	getEndTime() {
		return this.end;
	}

	getEndTimeAsText() {
		var d = new Date(this.getEndTime() + (new Date().getTimezoneOffset() * 1000 * 60));

		return addPadding(d.getHours(), 2) + ":" + addPadding(d.getMinutes(), 2);
	}

	getTimeAsText() {
		var timeUntilStart = this.getStartTime() - new Date().getTime() + (new Date().getTimezoneOffset() * 1000 * 60);
		var timeUntilEnd = this.getEndTime() - new Date().getTime() + (new Date().getTimezoneOffset() * 1000 * 60);

		if (timeUntilStart >= 0) {
			return ((Math.floor(timeUntilStart / (1000 * 60 * 60)) > 0 ? Math.floor(timeUntilStart / (1000 * 60 * 60)) + " hour(s)" : Math.floor(timeUntilStart / (1000 * 60)) % 60 > 0 ? Math.floor(timeUntilStart / (1000 * 60)) % 60 + " minute(s)" : Math.floor(timeUntilStart / 1000) % 60 + " second(s)") + " until start");
		} else if (timeUntilEnd >= 0) {
			return ((Math.floor(timeUntilEnd / (1000 * 60 * 60)) > 0 ? Math.floor(timeUntilEnd / (1000 * 60 * 60)) + " hour(s)" : Math.floor(timeUntilEnd / (1000 * 60)) % 60 > 0 ? Math.floor(timeUntilEnd / (1000 * 60)) % 60 + " minute(s)" : Math.floor(timeUntilEnd / 1000) % 60 + " second(s)") +  " left");
		} else {
			throw Error("There are no more scheduled events for today");
		}
	}
}

class Time {
	/**
	 * 
	 * @param {number} year The Year
	 * @param {number} month The Month
	 * @param {number} day The Day of the Month
	 * @param {number} hour The Hour (in military time, e.g. 22:00)
	 * @param {number} minute The Minute
	 * @param {number} second The Second
	 * @param {string} timezone The Timezone (e.g. +01:00)
	 */
	constructor(year, month, day, hour, minute, second) {
		var d = new Date();

		this.year = year == undefined ? d.getFullYear() : year;
		this.month = month == undefined ? d.getMonth() + 1 : month;
		this.day = day == undefined ? d.getDate() : day;
		this.hour = hour == undefined ? d.getHours() : hour;
		this.minute = minute == undefined ? d.getMinutes() : minute;
		this.second = second == undefined ? d.getSeconds() : second;
		
		this.date = new Date(this.year, this.month - 1, this.day, this.hour, this.minute, this.second);
		
		this.timezone = this.date.getTimezoneOffset() / -60;
	}

	/**
	 * 
	 * @param {string} rfcDate A string with the RFC3339 format (e.g. 2022-02-04T06:30:00+01:00)
	 */
	static fromRFCDate(rfcDate) {
		var t = new Time();

		t.date.setUTCFullYear(Number(rfcDate.substring(0, 4)));
		t.date.setUTCMonth(Number(rfcDate.substring(5, 7)) - 1);
		t.date.setUTCDate(Number(rfcDate.substring(8, 10)));
		t.date.setUTCHours(Number(rfcDate.substring(11, 13)));
		t.date.setUTCMinutes(Number(rfcDate.substring(14, 16)));
		t.date.setUTCSeconds(Number(rfcDate.substring(17, 19)));
		t.date.setUTCMilliseconds(Number(rfcDate.substring(20, 22)));

		return t;
	}
	
	getDate() {
		return this.date;
	}
	
	getTimezone() {
		return (this.timezone >= 0 ? "+" : "-") + addPadding(this.timezone, 2) + ":00";
	}
	
	getRFCDate() {
		return this.date.toISOString(); //this.year + "-" + addPadding(this.month, 2) + "-" + addPadding(this.day, 2) + "T" + addPadding(this.hour, 2) + ":" + addPadding(this.minute, 2) + ":" + addPadding(this.second, 2) + this.getTimezone();
	}
}