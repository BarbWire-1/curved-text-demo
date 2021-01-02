// to use battery.chargeLevel as dummie data
import { battery } from "power";
//console.log(Math.floor(battery.chargeLevel) + "%");

// exports absolut values
export const sb = Math.round(battery.chargeLevel) || 0;


//ACTIVITIES-----------------------------------------------------------------------------

// makes today and goals data from user-activity available
import { today, goals, primaryGoal } from "user-activity";
import { units } from "user-settings";
import { me as appbit } from "appbit";
import { display } from 'display';
//import clock from "clock";



let pG,as,asl,asg,gPs,pPs,amz,amzt,amg,gPa,pPa,ac,acl,acg,gPc,pPc,ad,adg,adkm,admi,adp,adpu,gPd,pPd,ae,aeg,gPe,pPe;


export function refresh() {
    if (appbit.permissions.granted("access_activity") && display.on) {

//PRIMARY GOAL
//const pG = primaryGoal ?? 1;

//TODAY
//STEPS-----------------------------------------------------------------------------------
as = today.adjusted.steps  ?? 0;
//console.log("as "+ as);
/* outcommented all not needed
asl = as.toLocaleString();
asg = goals.steps ?? 1;
gPs = Math.round(as*100/asg); // goalPercentage value
pPs = Math.min(gPs,100); // goalPercentage max 100 use for progressbars/arcs
*/

//ACTIVEZONEMINUTES------------------------------------------------------------------------
amz = today.adjusted.activeZoneMinutes.total ?? 0;
/*
amzt = (amz < 60 ? amz + "m" : Math.floor(amz / 60) + "h" + amz % 60 + "m");
amg = goals.activeZoneMinutes.total ?? 1;
gPa = Math.round(amz*100/amg); // goalPercentage value
pPa = Math.min(gPa,100); // goalPercentage max 100, use for progressbars/arcs
*/
//CALORIES----------------------------------------------------------------------------------
ac = today.adjusted.calories ?? 0;
/*
acl = ac.toLocaleString();
acg = goals.calories ?? 1;
gPc = Math.round(ac*100/acg); // goalPercentage value
pPc = Math.min(gPc,100); // goalPercentage max 100, use for progressbars/arcs
*/
//DISTANCE----------------------------------------------------------------------------------
//IN METERS - DEFAULT RETURN
/*ad = today.adjusted.distance ?? 0;
adg = goals.distance ?? 1;

//UNITS
adkm = (ad / 1000).toFixed(1) + " km";// distance travelled in km
admi = (ad/1609).toFixed(1) + " mi";// distance travelled in miles
adp = (units.distance == "metric" ? adkm : admi);
adpu = (units.distance == "metric" ? "km" : "mi");

//PROGRESS
pPd = Math.min(gPd,100); // goalPercentage max 100, use for progressbars/arcs
*/
//ELEVATION----------------------------------------------------------------------------------
ae = Number(today.adjusted.elevationGain) ?? 0;
/*
aeg = Number(goals.elevationGain) ?? 1;
gPe = Math.round(ae*100/aeg); // goalPercentage value
pPe = Math.min(gPe,100); // goalPercentage max 100, use for progressbars/arcs
*/
}
}

refresh();
//setInterval(refreshActivity,6e4);
export {pG,as,asl,asg,gPs,pPs,amz,amzt,amg,gPa,pPa,ac,acl,acg,gPc,pPc,ad,adg,adkm,admi,adp,adpu,gPd,pPd,ae,aeg,gPe,pPe};

/*IN INDEX


import  * as activityData from './activity.js';

place in onTick
call activityData.refresh();
let stepsLabel = document.getElementById("stepsLabel")
then eG => stepsLabel.text = String(activityData.as);

activityData.refresh();  call data from activity.js on load
*/
