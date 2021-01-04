// Add zero in front of numbers < 10
export function zeroPad(i) {
  i = ("0"+ i).slice(-2);
  
  return i;
}


// convert timestamp to time (h)h:mm

export function tsToTime(i) {
  
  let secs = i / 1000;
  let mins = Math.floor((secs % 3600)/60);
  let hrs = Math.floor((secs % 86400)/3600);
  
  i = hrs +":"+ String("0"+mins).slice(-2);

return i;
}

// convert timestamp to time (h)h +h+ mm +m

export function tsToHM(i) {
  let secs = i / 1000;
  
  let hrs = Math.floor((secs % 86400)/3600);
  let mins = Math.floor((secs % 3600)/60);
  
  
  i = hrs +"h"+ String("0"+mins).slice(-2)+"m";

return i;
}

// Convert minutes to time (h)h:mm
export function minsToTime(i) {
  let mins = i % 60;
  let hrs = Math.floor(i / 60);
  
  i = hrs +":"+ String("0"+mins).slice(-2);

return i;
}

// cos Degree ------------------------------------------------------------------

function cos(i) {
  i = Math.cos(i * Math.PI / 180);
  return(i);
}

function sin(i) {
 i = Math.sin(i * Math.PI / 180);
  return i;
}
/*
 // Smooth Rotation / trss
 var angle = (now.getSeconds() * 1000 + now.getMilliseconds()) * 6 / 1000
 /*
 console.log(angle)
 document.getElementsByClassName('smoothRotation').forEach(e => {
     e.from = angle
     e.to   = angle + 360
     e.parent.animate('enable')

 })
 
// cos Degree ------------------------------------------------------------------

const cos = (n) => {
  n = Math.cos(n*Math.PI/180);
    return n;
  }
  
  const sin = (n) => {
  n = Math.sin(n*Math.PI/180);
    return n;
  }
 
 // get timezone 
 /*
function timeZone () {
  const offset = new Date().getTimezoneOffset()*60000;
    
    //console.log(`Offset ${offset}`);
  return (offset);
}

timeZone();

*/
