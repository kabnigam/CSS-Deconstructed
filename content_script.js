

if (deconstruct) {
  var original = {};
  var difference = {};
  getOriginal(element);
} else {
  reapply(element, time);
}



function getOriginal(element) {
  original[element] = {};
  let $children = $(element).find('*');
  for (var i = 0; i < $children.length; i++) {
    original[i] = {};
  }

  let doc = '';

  let styles = {};
  if (element[0] === '.') {

    styles = window.getComputedStyle((document.getElementsByClassName(element.slice(1))[0]));
  } else if (element[0] === '#') {

    styles = window.getComputedStyle((document.getElementById(element.slice(1))));
  } else {

    styles = window.getComputedStyle((document.querySelectorAll(element)[0]));
  }
  // Object.keys(styles).forEach(key => {
  for (var i = 0; i < Object.keys(styles).slice(0,258).length; i++) {
    let key = Object.keys(styles)[i];
    original[element][styles[key]] = styles[styles[key]];

    for (var j = 0; j < $children.length; j++) {

      original[j][styles[key]] = $children.eq(j).css(styles[key]);
    }
  }
  reset(element);

}

function reset(element) {

  let $children = $(element).find('*');
  let styles = {};
  if (element[0] === '.') {

    styles = window.getComputedStyle((document.getElementsByClassName(element.slice(1))[0]));
  } else if (element[0] === '#') {

    styles = window.getComputedStyle((document.getElementById(element.slice(1))));
  } else {

    styles = window.getComputedStyle((document.querySelectorAll(element)[0]));
  }
  Object.keys(styles).slice(0,258).forEach(key => {

    $(element).css(styles[key], 'initial');
    for (var j = 0; j < $children.length; j++) {

      $children.eq(j).css(styles[key], 'initial');
    }

  });
  differences(element);
}


function differences(element) {

  Object.keys(original).forEach(key => {
    difference[key] = {};
  });
  let $children = $(element).find('*');
  Object.keys(original).forEach(key => {
    let styles = {};
    if (key === element) {
      if (element[0] === '.') {

        styles = window.getComputedStyle((document.getElementsByClassName(element.slice(1))[0]));
      } else if (element[0] === '#') {

        styles = window.getComputedStyle((document.getElementById(element.slice(1))));
      } else {

        styles = window.getComputedStyle((document.querySelectorAll(element)[0]));
      }
    } else {
      styles = window.getComputedStyle($children[key]);
    }
    Object.keys(original[key]).forEach(prop => {
      if (original[key][prop] !== styles[prop] && !prop.includes('webkit')) {
        difference[key][prop] = original[key][prop];
      }
    });
  });

}

function reapply(element, time) {
  let $children =  $(element).find('*');
  // Object.keys(difference).forEach(key => {
  // for (var i = Object.keys(difference).length-1; i >= 0; i--) {
  var i = 0;
  let running = false;


  var outerInterval = window.setInterval(
    function() {
      if (!running) {
        running = true;
        let key = Object.keys(difference)[i];
        let $target = undefined;
        if (key === element) {
          $target = $(element);


        } else {
          $target = $children.eq(key);
        }



          chrome.runtime.sendMessage({type: "change_element", value: `${$target.prop('nodeName')} class: ${$target.prop('class')} id: ${$target.prop('id')}`});


        let j = 0;

        var innerInterval = window.setInterval(
          function () {

            if (j < Object.keys(difference[key]).length) {
              // setTimeout(function () {
                $target.css(Object.keys(difference[key])[j], difference[key][Object.keys(difference[key])[j]]);
                j++;
                if (Object.keys(difference[key])[j]) {

                  chrome.runtime.sendMessage({type: "change_value", value: `${Object.keys(difference[key])[j]}: ${difference[key][Object.keys(difference[key])[j]]}`});
                }
                // console.log(Object.keys(difference[key])[j]);
                // console.log(difference[key][Object.keys(difference[key])[j]]);
              // }, time);
            } else {
              window.clearInterval(innerInterval);
              running = false;
              i++;

              if (i > Object.keys(difference).length-1) {
                window.clearInterval(outerInterval);
              }
            }
          }, time);
        }
    }, time);
}
