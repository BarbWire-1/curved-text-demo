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
import { display } from "display";
import { widgetFactory } from './widgets/widget-factory'
import { curvedText } from './widgets/curved-text'

// INITIALISE WIDGET SYSTEM-------------------------------------------------------------------------------------------

widgetFactory(curvedText);

// END OF INITIALISING WIDGET SYSTEM----------------------------------------------------------------------------------

let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//LABELS
// Widget curved-text labels
const stepsLabel = document.getElementById('stepsLabel'); // you can use ANY name for variable as usual, just use yourVar = widgetDocument.getWidgetById("yourID")
const calsLabel = document.getElementById("calsLabel");   // you can use ANY name for variable as usual, just use yourVar = widgetDocument.getWidgetById("yourID").

// other stats textLabels
let azmLabel = document.getElementById("azmLabel");
let chargeLabel = document.getElementById("chargeLabel");

//time Labels   
let hoursLabel0 = document.getElementById("hoursLabel0");
let hoursLabel = document.getElementById("hoursLabel");
let minsLabel = document.getElementById("minsLabel");
let dateLabel = document.getElementById("dateLabel");
let amPmLabel = document.getElementById("amPmLabel");

// BATTERY ------------------------------------------------------------------------------

let myBattery = document.getElementById("myBattery");

// CLOCK--------------------------------------------------------------------------------
// Update the clock every minute
clock.granularity = "minutes";


clock.ontick = (evt) => {
    let now = evt.date;
    let hours = now.getHours();
    let mins = util.zeroPad(now.getMinutes());
    //let secs = (now.getSeconds());
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
    hoursLabel0.text = util.zeroPad(hours) + ":"; // underlay zero for hours < 12 in 12h format
    hoursLabel.text = hours + ":";
    minsLabel.text = ":" + mins;
    dateLabel.text = days[weekday] + " " + ("0" + monthday).slice(-2);
    amPmLabel.text = ampm;

};
// END ON TICK

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
         // update stats Labels
      }else{
        hrm.start();
        hrLabel.text = String(hrm.heartRate ?? "--");
      }

    });
body.start();
}

 // UPDATE STATS LABELS EVERY 1000ms IF DISPLAY.ON
const updateStats = () => {
  azmLabel.text = String(today.adjusted.activeZoneMinutes.total);

  stepsLabel.text = String(today.adjusted.steps); // steps applied and curved here
  //stepsLabel.text = "1234567aiW89"
  calsLabel.text = String(today.adjusted.calories)  // calories applied and curved here
  
  myBattery.width = 26 / 100 * battery.chargeLevel;
  chargeLabel.text = String(Math.floor(battery.chargeLevel) + "%");
};
// TIMER FOR SETINTERVAL
let timerId = 0;
const stopTimer = () => {
  if (timerId != 0) {
    clearInterval(timerId);
    timerId = 0;
  }
}

const startTimer = () => {
  if (timerId == 0) {
    timerId = setInterval(updateStats, 1000);
  }
} 
// start/stop setInterval on display change
const displayCheck = () => {
  if (display.on) {
    startTimer();
  } else {
    stopTimer();
  }
}
// checks display change, calls start/stop
display.addEventListener("change", displayCheck);
startTimer();



// SWITCH IMAGE/DATA ON CLICK
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

// start/stop swinging on click top button
let s = 0;
let animateButton = document.getElementById("animateButton");
let swingingText = document.getElementById("swingingText");

animateButton.onclick = function (evt) {
  s++;
  s = s % 2;
  vibration.start("bump");
  if (s == 1) {
    swingingText.animate("enable");
  } else {
    swingingText.animate("disable");
    
  }
};
//Possible setting in .js/.ts
//stepsLabel.style.fontFamily = "Tungsten-Medium";
//stepsLabel.style.fontSize = 40;
//stepsLabel.style.fill = "red";
//stepsLabel.style.opacity = 0.5;
//stepsLabel.style.display = "none";
//stepsLabel.x = 100;
//stepsLabel.y = 100;
//stepsLabel.anchorAngle = 90;