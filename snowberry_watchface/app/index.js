import { padNumber } from "../common/utilities";
import { battery } from "power";
import clock from "clock";
import { display } from "display";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import me from "appbit";
import { preferences } from "user-settings";
import userActivity from "user-activity";
let newDocument = require("document");

clock.granularity = "minutes";

var months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
};

var weekdays = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    0: "Sunday",
};

const clockFaceLabel = newDocument.getElementById("clockFaceLabel");
let weekdayLabel = newDocument.getElementById("weekdayLabel");
let dateLabel = newDocument.getElementById("dateLabel");
let batteryStatusLabel = newDocument.getElementById("batteryStatusLabel");
let heartRateLabel = newDocument.getElementById("heartRateLabel");
let distanceKmLabel = newDocument.getElementById("distanceKmLabel");

heartRateLabel.text = "--";


clock.ontick = (event) => {
    let today = event.date;

    let month = months[today.getMonth()];
    let weekday = weekdays[today.getDay()];
    let day = today.getDate();
    let hours = today.getHours();
    let mins = padNumber(today.getMinutes());

    let batteryLevel = Math.floor(battery.chargeLevel);

    if (preferences.clockDisplay === "12h") {
        hours = hours % 12 || 12;
    } else {
        hours = padNumber(hours);
    }

    clockFaceLabel.text = `${hours}:${mins}`;
    dateLabel.text = `${month} ${day}`;
    weekdayLabel.text = `${weekday}`;
    batteryStatusLabel.text = `${batteryLevel}%`;

    if (me.permissions.granted("access_activity")) {
        let kilometers = userActivity.today.adjusted.distance / 1000;
        distanceKmLabel.text = kilometers.toFixed(2);
    }
};

if (HeartRateSensor && me.permissions.granted("access_heart_rate")) {
    const heartRateReading = new HeartRateSensor();
    heartRateReading.addEventListener("reading", () => {
        heartRateLabel.text = heartRateReading.heartRate;
    });
    display.addEventListener("change", () => {
        display.on ? heartRateReading.start() : heartRateReading.stop();
    });
    heartRateReading.start();
}
