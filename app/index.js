//@ts-nocheck
import clock from "clock";
import document from "document";
import { preferences} from "user-settings";
import * as util from "../common/utils";
import { BodyPresenceSensor } from "body-presence";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import { vibration } from "haptics";
import { today } from "user-activity";

// INITIALISE WIDGET SYSTEM-------------------------------------------------------------------------------------------

import { widgetFactory } from './widgets/widget-factory'
import { curvedText } from './widgets/curved-text'
import { statSync } from "fs";
const widgets = widgetFactory([curvedText]);        // create a widgetFactory that can manage curvedText widgets
widgets.registerContainer(document);                // add getWidgetById() to document
const widgetDocument = document;
// END OF INITIALISING WIDGET SYSTEM----------------------------------------------------------------------------------

let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//LABELS
// Widget curved-text labels
const stepsLabel = widgetDocument.getWidgetById('stepsLabel'); // you can use ANY name for variable as usual, just use yourVar = widgetDocument.getWidgetById("yourID")
const calsLabel = widgetDocument.getWidgetById("calsLabel");   // you can use ANY name for variable as usual, just use yourVar = widgetDocument.getWidgetById("yourID").


let azmLabel = document.getElementById("azmLabel");
let chargeLabel = document.getElementById("chargeLabel");
// BATTERY ------------------------------------------------------------------------------

let myBattery = document.getElementById("myBattery");

// CLOCK--------------------------------------------------------------------------------
// Update the clock every second
clock.granularity = "seconds";

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
    let now = evt.date;
    let hours = now.getHours();
    let mins = util.zeroPad(now.getMinutes());
    let ampm = " ";
    let weekday = Number(now.getDay());
    let monthday = Number(now.getDate());


    if (preferences.clockDisplay === "12h") {
        // 12h format
        ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
    } else {
        // 24h format
        ampm = "";
        hours = util.zeroPad(hours);
    }

    //TIME AND DATE
    //get Labels
    let hoursLabel0 = document.getElementById("hoursLabel0");
    let hoursLabel = document.getElementById("hoursLabel");
    let minsLabel = document.getElementById("minsLabel");
    let dateLabel = document.getElementById("dateLabel");
    let amPmLabel = document.getElementById("amPmLabel");


    hoursLabel0.text = util.zeroPad(hours) + ":"; // underlay zero
    hoursLabel.text = hours + ":";
    minsLabel.text = ":" + mins;
    dateLabel.text = days[weekday] + " " + ("0" + monthday).slice(-2);
    amPmLabel.text = ampm;


    // update stats Labels
    azmLabel.text = String(today.adjusted.activeZoneMinutes.total);

    stepsLabel.text = String(today.adjusted.steps); // steps applied and curved here
    calsLabel.text = String(today.adjusted.calories)  // calories applied and curved here

    myBattery.width = 26 / 100 * battery.chargeLevel;
    chargeLabel.text = String(Math.floor(battery.chargeLevel)+"%");

}; // END ON TICK

// HEARTRATE-----------------------------------------------------------------------
let hrLabel = document.getElementById("hrLabel");
if (HeartRateSensor && BodyPresenceSensor) {

  const hrm = new HeartRateSensor({frequency: 1, batch:0});
  const body = new BodyPresenceSensor({frequency: 1});

  hrm.addEventListener("reading", () => {

    hrLabel.text = String(hrm.heartRate ?? "--");

  });

  body.addEventListener("reading", () => {
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


// SHOW DATAT ON CLICK
let dataButton = document.getElementById("dataButton");
let a = 0;
dataButton.onclick = function (evt) {
    a++;
    a = a % 2;
    vibration.start("bump");
    if (a == 1) {
        azmLabel.style.display = "inline";
        chargeLabel.style.display = "inline";
    } else {
        azmLabel.style.display="none";
        chargeLabel.style.display= "none";

    }
}

//ANIMATED CURVED TEXT
// this stops/starts an SVG animation on an outer group of the <use>
// you can also animate each in .js/.ts. available setting directly inline
const animatedWidget = document.getWidgetById("animatedWidget");
// apply text here or for static text in text-buffer / index.gui/view or styles.css
animatedWidget.text = "some swinging text";

// start/stop swinging on click top button
let s = 0;
let swingButton = document.getElementById("swingButton");
let swing = document.getElementById("swing");
swingButton.onclick = function (evt) {
    s++;
    s = s % 2;
    vibration.start("bump");
  if (s == 1) {
    swing.animate("enable");
  } else {
    swing.animate("disable")
    }
}
//Possible setting in .js/.ts
//stepsLabel.style.fontFamily = "Tungsten-Medium";
//stepsLabel.style.fontSize = 40;
//stepsLabel.style.fill = "red";
//stepsLabel.style.opacity = 0.5;
//stepsLabel.style.display = "none";
//stepsLabel.x = 100;
//stepsLabel.y = 100;
//stepsLabel.anchorAngle = 90; // TODO G why do startAngle and anchorAngle do the same??? doesn´t feel good