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
import widgetFactory from './widgets/widget-factory'
import curvedText from './widgets/curved-text'
const widgets = widgetFactory([curvedText]);
widgets.registerContainer(document);


let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];

// CLOCK--------------------------------------------------------------------------------
// Update the clock every minute
clock.granularity = "minutes";

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
        hours = hours % 12 || 12;
        let hours0 = util.zeroPad(hours)
      
    } else {
        // 24h format
        ampm = "";
        hours = util.zeroPad(hours);
       
    }
    
    let mins = util.zeroPad(now.getMinutes());
    

    //TIME AND DATE
    //get Labels
    let hoursLabel012 = document.getElementById("hoursLabel012") as TextElement;
    let hoursLabel12 = document.getElementById("hoursLabel12") as TextElement;
    let minsLabel = document.getElementById("minsLabel") as TextElement;
    let dateLabel = document.getElementById("dateLabel") as TextElement;
    let amPmLabel = document.getElementById("amPmLabel") as TextElement;

  
    hoursLabel012.text = util.zeroPad(hours) + ":";
    hoursLabel12.text = hours + ":";
    minsLabel.text = ":" + mins;
    dateLabel.text = days[weekday] + " " + ("0" + monthday).slice(-2);
    amPmLabel.text = ampm;
    
  
    
}; // END ON TICK

// HEARTRATE-----------------------------------------------------------------------
let hrLabel = document.getElementById("hrLabel") as TextElement
if (HeartRateSensor && BodyPresenceSensor) {

  const hrm = new HeartRateSensor({frequency: 1, batch:0});// much more than 1 Hz if changed on sim. why??????
  const body = new BodyPresenceSensor({frequency: 1});

  hrm.addEventListener("reading", (): void => {
   
    hrLabel.text = String(hrm.heartRate ?? "--");
    
    
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

// BATTERY ------------------------------------------------------------------------------
let chargeLabel = document.getElementById("chargeLabel") as TextElement
let myBattery = document.getElementById("myBattery") as ImageElement;
let dataButton = document.getElementById("dataButton");
let bat = document.getElementById("bat") as any ;
let a = 0;



// SECONDS ---------------------------------------------------------------------------------------
// ACTIVITIES
let azmLabel = document.getElementById("azmLabel") as TextElement;
const stepsCurvedTextWidget = (document as any).getWidgetById('stepsLabel');
const calsLabelWidget = (document as any).getWidgetById("calsLabel");

let refreshSeconds = setInterval(mySeconds, 1000);

function mySeconds(): void  {
    let d = new Date();
    let s = d.getSeconds();
    activityData.refresh();
    // Refresh stats Labels
    azmLabel.text = activityData.amz;
    
    stepsCurvedTextWidget.text = activityData.as;
    calsLabelWidget.text = activityData.ac;

    myBattery.width = 26 / 100 * battery.chargeLevel;
    chargeLabel.text = String(Math.floor(battery.chargeLevel)+"%");
   
};


// show data on click
dataButton.onclick = function (evt): void {
    a++;
    a = a % 2;
    vibration.start("bump");
    if (a == 1) {
  
        azmLabel.style.opacity = 1;
        chargeLabel.style.opacity = 1;
    } else {
        azmLabel.style.opacity = 0;
        chargeLabel.style.opacity = 0;
        
    }
}
display.addEventListener("change", (): void => {

    if (display.on) {
        mySeconds();
    }
}
);
mySeconds();
