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

let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];
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

    //TIME AND DATE
    //get Labels
    let hoursLabel012 = document.getElementById("hoursLabel012") as TextElement;
    let hoursLabel12 = document.getElementById("hoursLabel12") as TextElement;
    let minsLabel = document.getElementById("minsLabel") as TextElement;
    let dateLabel = document.getElementById("dateLabel") as TextElement;
    let amPmLabel = document.getElementById("amPmLabel") as TextElement;

    hoursLabel012.text = util.zeroPad(hours12) + ":";
    hoursLabel12.text = hours12 + ":";
    minsLabel.text = ":" + mins;
    dateLabel.text = days[weekday] + " " + ("0" + monthday).slice(-2);
    amPmLabel.text = ampm;
   
    //dateLabel.text = (`${days[weekday]} ${months[month]} ${("0" + monthday).slice(-2)}`);
    //console.log(`${days[weekday]} ${("0" + monthday).slice(-2)}. ${months[month]}`);
    //amPm.href =   ampm + ".png";
    //amPm.text = ampm;
 
  
    // Refresh stats Labels
    activityData.refresh();
    //azmLabel.text = activityData.amz;
    //floorsLabel.text = activityData.ae;
}; // END ON TICK

// HEARTRATE-----------------------------------------------------------------------
let hrLabel = document.getElementById("hrLabel") as TextElement
if (HeartRateSensor && BodyPresenceSensor) {

  const hrm = new HeartRateSensor({frequency: 1, batch:0});// much more than 1 Hz if changed on sim. why??????
  const body = new BodyPresenceSensor({frequency: 1});

  hrm.addEventListener("reading", (): void => {
    //console.log(`Current heart rate: ${hrm.heartRate}`);
    hrLabel.text = String(hrm.heartRate ?? "--");
    //console.log(`initiate${hrLabel.text}`);
    
  });

  body.addEventListener("reading", (): void => {
   // Automatically stop the sensor when the device is off to conserve battery
      if (!body.present) {
        hrm.stop();
        hrLabel.text = "--";
          }else{
        hrm.start();
        hrLabel.text = String(hrm.heartRate ?? "--");
      }
      
    });
body.start();
}