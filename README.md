
# CSS Deconstructed

CSS Deconstructed is a chrome extension written in JavaScript and jQuery that allows users to deconstruct and reconstruct (piece by piece) the CSS of specific elements on a webpage based on selector, class and/or ID.

[View in Chrome Web Store][webstore]

## Features
* Remove all CSS styling from an element with the click of a button
* Select element by selector, class and/or ID
* Choose the time-frame for which you want each CSS rule to be reapplied
* Rebuild the website/element piece by piece, right in front of your eyes!
* COMING SOON: See exactly which CSS rule is being applied at every step in the process

## Images
Finding the element to deconstruct using Dev Tools
![Alt text](./shot2.png?raw=true "Optional Title")

After full deconstruction of element
![Alt text](./shot3.png?raw=true "Optional Title")

In the middle of element reconstruction
![Alt text](./shot4.png?raw=true "Optional Title")

After full reconstruction
![Alt text](./shot1.png?raw=true "Optional Title")



## Tech
CSS Deconstructed was built using a combination of HTML, CSS, JavaScript and jQuery.

* Uses jQuery and JavaScript DOM methods to process user input and change state of extension in response user behavior
```javascript
document.getElementById('pageSubmit').removeEventListener("click", function() {
  getInput(this);
}, false);
$('#pageSubmit').attr('value', 'Build!');
let form = document.getElementById('form');
let el = parseInput(form.childNodes[3].value, form.childNodes[7].value, form.childNodes[11].value, form.childNodes[15].value);
$('#pageSubmit').on('click', build.bind(null, el));
```

* Relies on manipulation of the current tab's DOM, which requires the injection of content script into the active tab.
```javascript
chrome.tabs.executeScript({code: 'var element = ' + JSON.stringify(element)}, function() {
  chrome.tabs.executeScript({code: 'var deconstruct = true'}, function () {
    chrome.tabs.executeScript({code: 'var time = ' + JSON.stringify(time)}, function () {
      chrome.tabs.executeScript({file: 'jquery.min.js'}, function() {
        chrome.tabs.executeScript({file: 'content_script.js'});
      });
    });
  });
});
```

* Starts by getting all CSS of element and children using window.getComputedStyle
```javascript
styles = window.getComputedStyle((document.querySelectorAll(element)[0]));
for (var i = 0; i < Object.keys(styles).slice(0,258).length; i++) {
let key = Object.keys(styles)[i];
original[element][styles[key]] = styles[styles[key]];
for (var j = 0; j < $children.length; j++) {
  original[j][styles[key]] = $children.eq(j).css(styles[key]);
}
```

* Resets CSS of element and children using "initial" property
```javascript
Object.keys(styles).slice(0,258).forEach(key => {
  $(element).css(styles[key], 'initial');
  for (var j = 0; j < $children.length; j++) {
    $children.eq(j).css(styles[key], 'initial');
  }
});
```

* Computes differences between reset and original
```javascript
Object.keys(original[key]).forEach(prop => {
  if (original[key][prop] !== styles[prop] && !prop.includes('webkit')) {
    difference[key][prop] = original[key][prop];
  }
});
```

* Uses nested intervals to reapply CSS rules at specified time interval
```javascript
var innerInterval = window.setInterval(
  function () {
    if (j < Object.keys(difference[key]).length) {
        $target.css(Object.keys(difference[key])[j], difference[key][Object.keys(difference[key])[j]]);
        j++;
        if (Object.keys(difference[key])[j]) {
          chrome.runtime.sendMessage({type: "change_value", value: `${Object.keys(difference[key])[j]}: ${difference[key][Object.keys(difference[key])[j]]}`});
        }
    } else {
      window.clearInterval(innerInterval);
      running = false;
      i++;
      if (i > Object.keys(difference).length-1) {
        window.clearInterval(outerInterval);
      }
    }
  }, time);
```


CSS Deconstructed itself is open source with a [public repository][CSSD].


### Version
0.0.0.1



   [CSSD]: <https://github.com/kabnigam/CSS-Deconstructed>
   [webstore]: <https://chrome.google.com/webstore/detail/css-deconstructed/inhlobcefhlmdljoeigpbpdehlpciohh>
