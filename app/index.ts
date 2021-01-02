import clock from "clock";
import document from "document";
import { preferences, units } from "user-settings";
import * as util from "../common/utils";

import * as activityData from './activity.js';
import { BodyPresenceSensor } from "body-presence";
import { HeartRateSensor } from "heart-rate";
import { display } from 'display';

import { battery } from "power";
import { vibration } from "haptics";
import { goals, today } from "user-activity";

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",];
let months = ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug",  "Sep",  "Oct",  "Nov", "Dec"];

// CLOCK--------------------------------------------------------------------------------
// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element


// Update the <text> element every tick with the current time
clock.ontick = (evt): void => {
    let now = evt.date;
    let hours = now.getHours();
    let ampm = " ";
    let weekday = Number(now.getDay());
    let monthday = Number(now.getDate());
    let month = Number(now.getMonth());
  
    if (preferences.clockDisplay === "12h") {
        // 12h format
        ampm = hours >= 12 ? "PM" : "AM";
        //hours = hours % 12 || 12;
      
    } else {
        // 24h format
        ampm = "";
        //hours = util.zeroPad(hours);
        //console.log("hours: "+hours)
    }
    let hours12 = String(hours % 12 || 12);
    let mins = util.zeroPad(now.getMinutes());
    //let secs = (now.getSeconds());
    //let amPm = document.getElementById("amPm")// as ImageElement;
    //IMPORT LABELS
    let hoursLabel24 = document.getElementById("hoursLabel24") as TextElement;
    let hoursLabel12 = document.getElementById("hoursLabel12") as TextElement;
    let minsLabel = document.getElementById("minsLabel");
    hoursLabel24.text = util.zeroPad(hours) + ":";
    hoursLabel12.text = hours12 + ":";
    minsLabel.text = ":" + mins;
    //dateLabel.text = (`${days[weekday]} ${months[month]} ${("0" + monthday).slice(-2)}`);
    //console.log(`${days[weekday]} ${("0" + monthday).slice(-2)}. ${months[month]}`);
    //amPm.href =   ampm + ".png";
    //amPm.text = ampm;
 
  
    // Refresh stats Labels
    activityData.refresh();
    //azmLabel.text = activityData.amz;
    //floorsLabel.text = activityData.ae;
};
