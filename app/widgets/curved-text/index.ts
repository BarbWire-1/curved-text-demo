//@ts-nocheck
export interface CurvedTextWidget extends GraphicsElement {
  text: string;
  startAngle: Number;
  anchorAngle: Number;
  redraw(): void;
}


// @ts-ignore
const construct: CurvedTextWidget = (el:GraphicsElement) => {
  // Construct an instance of a CurvedTextWidget by modifying a GraphicsElement that corresponds to a curved-text <use>.
  // This function isn't exported, and is called from widget-factory.ts when external code calls getWidgetById().
  // Returns the modified element.

  // Don't can't call .getWidgetById on an element twice: once it has been converted, it can't be converted again.

  // Because the widget is a closure, variables declared here aren't accessible to code outside the widget.
  const textEl = el.getElementById('text') as TextElement;
  const radiusEl = el.getElementById('radius') as CircleElement;
  const layoutEl = el.getElementById('layout') as ArcElement;
  const alignRotate = el.getElementById('alignRotate') as GroupElement;

  // PRIVATE FUNCTIONS
  // Because the widget is a closure, functions declared here aren't accessible to code outside the widget.

  const initialiseChars = () => {
    // We do this in a function so that char[] memory can be released.
    // This must be done before any elements are rotated, because we need getBBox() for the unrotated char.
    let char = el.getElementsByClassName("char") as TextElement[];// single char textElements
    let y = radius < 0 ? -radius : -radius + char[0].getBBox().height / 2;  //define y of text based on radius, and prevent mirroring
    char.forEach(charEl => charEl.y = y);
  }

  const setStartAngle = newValue => {
    startAngle = newValue;
    alignRotate.groupTransform.rotate.angle = startAngle + anchorAngle;
  }

  // INITIALISE SETTINGS FROM SVG or CSS
  /* These attributes can't be specified in <use>: r, start-angle, sweep-angle, text-anchor, letter-spacing, text, text-buffer, class.
     Therefore, we pick these up from hidden elements within the widget. */

  let radius = radiusEl.r ?? 100;  //if negative, text is bottom curve. Default to 100.

  let textAnchor: string;
  try {     // textEl.textAnchor throws an error if textAnchor not defined
    textAnchor = textEl.textAnchor;
  } catch(e) {
    textAnchor = 'middle';  // default
  }

  let letterSpacing: number = textEl.letterSpacing ?? 0;

  let sweepAngle: number = layoutEl.sweepAngle ?? 0; //"fix" mode angle of each char, chars are stacked at 0° if no setting. If undefined, "auto" mode // former charAngle
  if (radius < 0) sweepAngle = -sweepAngle;   //PREVENT MIRRORING

  let startAngle: number = layoutEl.startAngle ?? 0;  //angle to rotate anchor point for whole text

  // VALIDATE OTHER ATTRIBUTES

  const maxLength = el.getElementsByClassName("char").length;
  if (textEl.text.length > maxLength)
    textEl.text = textEl.text.slice(0, maxLength);  // shouldn't be necessary but <set> seems to bypass text-length check

  // INITIALISE OTHER LOCAL VARIABLES

  let anchorAngle: number = 0;  // angle by which whole string should be rotated to comply with anchor, excluding startAngle adjustment of anchor // former stringAngle

  // INITIALISE INVARIANT CHAR[] PROPERTIES

  initialiseChars();

  // ADD PROPERTIES TO SVG ELEMENT OBJECT
  // These properties will be accessible to code outside the widget, and are therefore part of the widget's API.
  // Because they're all implemented as 'setters', they can be used like variables even though they cause functions to run.
  // 'getters' are not implemented because they would be rarely required and would consume memory.

  Object.defineProperty(el, 'text', {
    set: function(newValue) {
      textEl.text = newValue;
      (el as CurvedTextWidget).redraw();
    }
  });

  Object.defineProperty(el, 'startAngle', {   // name compatible with SVG/CSS attribute
    set: function(newValue) {setStartAngle(newValue);}
  });

  Object.defineProperty(el, 'anchorAngle', {  // name descriptive of use; function is identical to startAngle
    set: function(newValue) {setStartAngle(newValue);}
  });

  // ADD A FUNCTION TO SVG ELEMENT OBJECT
  // This function will be accessible to code outside the widget, and is therefore part of the widget's API.

  (el as CurvedTextWidget).redraw = () => {
    // This function populates and positions the widget's visible elements.
    // redraw() doesn't really need to be public, except to cover unforeseen cases.

    //VARIABLES
    //ASSIGN CHARS
    let chars = (textEl.text.split("")); // array of char set of text to curve
    let char  = el.getElementsByClassName("char") as TextElement[];// single char textElements
    const numChars = chars.length;

    //REMOVE ANY CHARS THAT ARE NO LONGER NEEDED
    // There's no need to do this initially. It could be done only when text is changed, but that would complicate the code there.
    for (let i=numChars; i<char.length; i++)
      char[i].style.display = 'none';

    //IF NO TEXT, RETURN
    if (!numChars) return;

    //CIRCUMFERENCE FOR AUTO
    const circ = 2 * radius * Math.PI;
    const degreePx = 360 / circ;

    anchorAngle = 0;

    //INITIALISE char[]
    for (let i: number = 0; i < numChars ; i++) {
      //apply text and y
      char[i].text = chars[i];// assign chars to the single textElements
      char[i].style.display = 'inherit';
    }
    
   
    //snippet from Grégoire. Need to test as error if undefined
    //let foundEl = el
    //while(foundEl && foundEl.groupTransform === undefined){
    //foundEl = foundEl.parent
    //}
    //let inGroup = foundEl !== undefined
    
    //el.parent.type == "rotate" ? console.log(el.id+" has an outer rotation") : console.log(el.id+" has no outer rotation") // checks for type="rotate" in outer <g>
    // checks, if the <use> is wrapped in an outer <g> and returns angle
    let outerGAngle = (el.parent?.["groupTransform"] === undefined) ? 0 : el.parent.groupTransform.rotate.angle;
    alignRotate.groupTransform.rotate.angle = - outerGAngle;  // so getBBox() will return unrotated widths
   
    //console.log(el.id +": "+outerGAngle);
    if (!sweepAngle) {   // sweepAngle wasn't specified, so do mode=0 (auto)

      //AUTO MODE

      let cumWidth: number = 0;
      let charG: GroupElement;    // <g> that contains the char being rotated
      for (let i: number = 0; i < numChars ; i++) {
        //Variables for positioning chars
        charG = char[i].parent as GroupElement;
        charG.groupTransform.rotate.angle = 0;   // so getBBox() will return unrotated widths
        let charWidth = char[i].getBBox().width;
        cumWidth += charWidth;

        //ROTATION PER CHAR
        charG.groupTransform.rotate.angle = (cumWidth - charWidth / 2 + i * letterSpacing) * degreePx;
      } // end of char loop

      //TEXT-ANCHOR MODE AUTO
      switch(textAnchor) {
        case 'middle':
          anchorAngle = - (cumWidth + ((numChars - 1) * letterSpacing)) * degreePx / 2;//ok
          break;
        case 'end':
          anchorAngle = - (cumWidth + (numChars - 1 ) * letterSpacing  ) * degreePx;
          break;
      }

    } else {    // sweepAngle is non-zero, so do mode=1 (fix)

      //FIX MODE

      // Determine unrotated widths of outer chars:
      (char[0].parent as GroupElement).groupTransform.rotate.angle = 0;
      const firstChar = char[0].getBBox().width;
      (char[numChars-1].parent as GroupElement).groupTransform.rotate.angle = 0;
      const lastChar = char[numChars-1].getBBox().width;

      for (let i: number = 0; i < numChars ; i++) {
        //ROTATION PER CHAR
        (char[i].parent as GroupElement).groupTransform.rotate.angle = i * sweepAngle;
      } // end of char loop

      //TEXT-ANCHOR MODE FIX
      switch(textAnchor) {
        // Commented-out lines here implement an alternative definition of anchor in FIX mode.
        case 'middle':
          anchorAngle -= (((numChars-1) * sweepAngle) + (lastChar - firstChar) / 2 * degreePx) / 2;
          //anchorAngle = (1 - numChars)  * sweepAngle / 2 // start at middle 0/180 - exactly by angle only!
          break;
        case 'start':
          anchorAngle = firstChar / 2 * degreePx;
          //anchorAngle = 0; //centers at o/180 exactly by angle only!
          break;
        case 'end':
          anchorAngle = (numChars - 1 ) * - sweepAngle - lastChar / 2 * degreePx;
          //anchorAngle = - (numChars - 1 ) * sweepAngle; // end at middle 0/180 - exactly by angle only!
          break;
      }
    };

    alignRotate.groupTransform.rotate.angle = startAngle + anchorAngle; // rotate the whole string to the correct angle
  }

  // DISPLAY WIDGET BASED ON SVG/CSS ATTRIBUTES
  // Subsequent changes to the widget are handled by API functions, and may involve calling redraw() again.
  (el as CurvedTextWidget).redraw();

  // RETURN THE MODIFIED ELEMENT
  // Since el now has curved-text properties and functions added to it, external code can use it to manipulate the widget.
  return el as CurvedTextWidget;
}


export const curvedText = () => {
  // Returns an object that provides the name of this widget and a function that can be used to construct them.
  // This is used internally by widget-factory.ts.
  return {
    name: 'curvedText',
    construct: construct
  }
}