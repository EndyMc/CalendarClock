/*class Lesson {
	constructor(startTime, endTime, type, place) {
		var d = new Date();

		this.startTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Number(startTime.split(":")[0]), Number(startTime.split(":")[1]), 0, 1);
		this.endTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Number(endTime.split(":")[0]), Number(endTime.split(":")[1]), 0, 1);
		this.duration = (this.endTime.getHours() * 60 + this.endTime.getMinutes()) - (this.startTime.getHours() * 60 + this.startTime.getMinutes());
		
		this.type = type;
		this.place = place;
	}
}

class Lessons {
	constructor(monday, tuesday, wednesday, thursday, friday) {
		this.monday = monday;
		this.tuesday = tuesday;
		this.wednesday = wednesday;
		this.thursday = thursday;
		this.friday = friday;

		this.all = [monday, tuesday, wednesday, thursday, friday];
	}
	
	getCurrentLesson() {
		var cur = this.getCurrentDay();
		var i = String(this.getCurrentLessonIndex());
		if (i == undefined || cur == undefined) return undefined;

		if (i.includes(",")) {
			return new Lesson(cur[Number(i.split(", ")[0])].endTime.getHours() + ":" + cur[Number(i.split(", ")[0])].endTime.getMinutes(), cur[Number(i.split(", ")[1])].startTime.getHours() + ":" + cur[Number(i.split(", ")[1])].startTime.getMinutes(), "Rast");
		}
		
		return cur[i];
	}
	
	getCurrentLessonIndex() {
		var cur = this.getCurrentDay();
		var d = new Date();
		if (d.getDay() == 0 || d.getDay() == 6) return undefined;

		for (var i = 0; i < cur.length; i++) {
			if (cur[i].startTime.getTime() <= d.getTime() && cur[i].endTime.getTime() >= d.getTime()) {
				return i;
			} else if (i >= 1 && (cur[i].startTime.getTime() > d.getTime() && cur[i - 1].endTime.getTime() < d.getTime())) {
				return (i - 1) + ", " + i;
			}

		}
		
		return undefined;
	
	}
	
	getNextLesson() {
		var i = String(this.getCurrentLessonIndex());
		return this.getCurrentDay()[i.includes(",") ? Number(i.split(", ")[1]) : Number(i) + 1];
	}
	
	getCurrentDay() {
		return this.all[new Date().getDay() - 1];
	}

	getAllDays() {
		return this.all;
	}
	
	getDay(day) {
		switch(day) {
			case "monday":
				return this.monday;
			case "tuesday":
				return this.tuesday;
			case "wednesday":
				return this.wednesday;
			case "thursday":
				return this.thursday;
			case "friday":
				return this.friday;
			default:
				return undefined;
		}
	}
}

var lessons;
function createLessons() {
	var monday = [
		new Lesson("09:00", "09:30", "Mentorstid", 1034),
		new Lesson("09:35", "10:20", "Matematik", 1034),
		new Lesson("10:30", "11:10", "Tyska", 1042),
		new Lesson("11:25", "12:20", "Engelska", 1034),
		new Lesson("12:25", "12:45", "Lunch", "Matsalen"),
		new Lesson("13:00", "13:50", "SO", 1034),
		new Lesson("14:15", "15:15", "Idrott", "Sl&auml;tt&auml;ngshallen")
	]

	var tuesday = [
		new Lesson("08:00", "09:00", "Matematik", 1034),
		new Lesson("09:10", "10:05", "Svenska", 1034),
		new Lesson("10:15", "11:20", "NO", 1034),
		new Lesson("11:25", "11:45", "Lunch", "Matsalen"),
		new Lesson("12:20", "13:25", "SO", 1034),
		new Lesson("13:55", "14:40", "Idrott", "Vinstorpshallen")
	]
	
	var wednesday = [
		new Lesson("08:00", "08:50", "Tyska", 1042),
		new Lesson("09:00", "09:50", "Matematik", 1034),
		new Lesson("10:00", "11:15", "Sl&ouml;jd", 1071),
		new Lesson("11:35", "11:55", "Lunch", "Matsalen"),
		new Lesson("12:15", "13:10", "Svenska", 1034),
		new Lesson("13:20", "14:10", "Teknik", 1032),
		new Lesson("14:10", "14:50", "NO", 1032)
	]
	
	var thursday = [
		new Lesson("08:00", "08:45", "NO", 1032),
		new Lesson("09:10", "10:05", "Idrott", "Vinstorpshallen"),
		new Lesson("11:15", "12:15", "NO-Lab", 1032),
		new Lesson("10:30", "12:10", "Hkk", 1102),
		new Lesson("12:25", "12:45", "Lunch", "Matsalen"),
		new Lesson("12:50", "13:30", "Matematik", 1034),
		new Lesson("13:40", "14:40", "Tyska", 1042),
		new Lesson("14:50", "15:35", "SO", 1034)
	]
	
	var friday = [
		new Lesson("08:00", "09:30", "Musik", 1067),
		new Lesson("09:40", "10:40", "Svenska", 1034),
		new Lesson("10:50", "11:45", "Engelska", 1034),
		new Lesson("11:50", "12:10", "Lunch", "Matsalen"),
		new Lesson("12:20", "12:50", "Matematik", 1034),
		new Lesson("13:05", "13:55", "SO", 1034),
		new Lesson("14:05", "15:05", "Bild", 1061)
	]
	
	return (lessons = new Lessons(monday, tuesday, wednesday, thursday, friday));
}*/

class Calendar {
	static events = [];

	static update() {
		var minTime = new Time(undefined, undefined, undefined, 0, 0, 0).getRFCDate();
		var maxTime = new Time(undefined, undefined, undefined, 23, 59, 59).getRFCDate();

		gapi.client.calendar.events.list({
			'calendarId': "primary",
			'timeMin': minTime,
			'timeMax': maxTime
		}).then((res) => {
			var events = res.result.items;
			var ids = {};

			// Add the fetched events to the events-list
			Calendar.events.push(...events);

			// Remove all duplicate events
			Calendar.events.filter(obj => { isSingleton = ids[obj.id] == undefined;  ids[obj.id] = true; return isSingleton; });

			// Sort the events according to time (earliest first)
			Calendar.events.sort((e1, e2) => (e1.start.date == undefined ? e1.start.dateTime : e1.start.date) - (e2.start.date == undefined ? e2.start.dateTime : e2.start.date));
		});

		console.debug("Updated calendar-events");
		console.debug(Calendar.events);
	}
}

class Time {
	/**
	 * 
	 * @param {number} year 
	 * @param {number} month 
	 * @param {number} day 
	 * @param {number} hour 
	 * @param {number} minute 
	 * @param {number} second 
	 * @param {string} timezone 
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