import clock from "clock";
import document from "document";
import { preferences} from "user-settings";
import * as util from "../common/utils";
import { BodyPresenceSensor } from "body-presence";
import { HeartRateSensor } from "heart-rate";
import { display } from 'display';

import { battery } from "power";
import { vibration } from "haptics";
import { today } from "user-activity";

// INITIALISE WIDGET SYSTEM-------------------------------------------------------------------------------------------

import { widgetFactory } from './widgets/widget-factory'
import { curvedText } from './widgets/curved-text'
const widgets = widgetFactory([curvedText]);
widgets.registerContainer(document);  // adds getWidgetById() to document

// END OF INITIALISING WIDGET SYSTEM----------------------------------------------------------------------------------

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
    } else {
        // 24h format
        ampm = "";
        hours = util.zeroPad(hours);
       
    }
    
    let mins = util.zeroPad(now.getMinutes());
    

    //TIME AND DATE
    //get Labels
    let hoursLabel0 = document.getElementById("hoursLabel0") as TextElement;
    let hoursLabel = document.getElementById("hoursLabel") as TextElement;
    let minsLabel = document.getElementById("minsLabel") as TextElement;
    let dateLabel = document.getElementById("dateLabel") as TextElement;
    let amPmLabel = document.getElementById("amPmLabel") as TextElement;

  
    hoursLabel0.text = util.zeroPad(hours) + ":"; // underlay zero
    hoursLabel.text = hours + ":";
    minsLabel.text = ":" + mins;
    dateLabel.text = days[weekday] + " " + ("0" + monthday).slice(-2);
    amPmLabel.text = ampm;
    
  
}; // END ON TICK

// HEARTRATE-----------------------------------------------------------------------
let hrLabel = document.getElementById("hrLabel") as TextElement
if (HeartRateSensor && BodyPresenceSensor) {

  const hrm = new HeartRateSensor({frequency: 1, batch:0});
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

// SECONDS ---------------------------------------------------------------------------------------
// ACTIVITIES
let azmLabel = document.getElementById("azmLabel") as TextElement;
const stepsLabel = (document as any).getWidgetById('stepsLabel'); // you can use ANY idName for the <use> as usual, just use yourID = document.getWidgetById("yourID")
const calsLabel = (document as any).getWidgetById("calsLabel");   // you can use ANY idName for the <use> as usual, just use yourID = document.getWidgetById("yourID")

let refreshSeconds = setInterval(mySeconds, 1000);

function mySeconds(): void  {
    let d = new Date();
    let s = d.getSeconds();
    
    // Refresh stats Labels
    azmLabel.text = String(today.adjusted.activeZoneMinutes.total);
    
    stepsLabel.text = today.adjusted.steps; // steps applied and curved here
    calsLabel.text = today.adjusted.calories  // calories applied and curved here

    myBattery.width = 26 / 100 * battery.chargeLevel;
    chargeLabel.text = String(Math.floor(battery.chargeLevel)+"%");
   
};


// SHOW DATAT ON CLICK
let a = 0;
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


//ANIMATED CURVED TEXT
const animatedWidget = (document as any).getWidgetById("animatedWidget");
// apply text here or for static text in text-buffer / index.gui/view or styles.css
animatedWidget.text = "some swinging text";

// start/stop swinging on click top button
let s = 0;
let swingButton = document.getElementById("swingButton");
let swing = document.getElementById("swing");
swingButton.onclick = function (evt): void {
    s++;
    s = s % 2;
    vibration.start("bump");
  if (s == 1) {
    swing.animate("enable");
  } else {
    swing.animate("disable")     
    }
}