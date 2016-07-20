var original = {};
var difference = {};

function getOriginal(element) {
  original[element] = {};
  let $children = $(`.${element}`).children();
  for (var i = 0; i < $children.length; i++) {
    original[i] = {};
  }
  let styles = window.getComputedStyle((document.getElementsByClassName(element)[0]));
  Object.keys(styles).forEach(key => {
    original[element][styles[key]] = styles[styles[key]];

    for (var j = 0; j < $children.length; j++) {
      original[j][styles[key]] = $children.eq(j).css(styles[key]);
    }
  });

}

function reset(element) {

  let $children = $(`.${element}`).children();
  let styles = window.getComputedStyle((document.getElementsByClassName(element)[0]));
  Object.keys(styles).forEach(key => {
    $(`.${element}`).css(styles[key], 'initial');
    for (var j = 0; j < $children.length; j++) {
      $children.eq(j).css(styles[key], 'initial');
    }

  });

}


function differences(element) {

  Object.keys(original).forEach(key => {
    difference[key] = {};
  });
  let $children = $(`.${element}`).children();
  Object.keys(original).forEach(key => {
    let styles = {};

    if (key === element) {
      styles = window.getComputedStyle((document.getElementsByClassName(element)[0]));
    } else {
      styles = window.getComputedStyle($children[key]);
    }
    Object.keys(original[key]).forEach(prop => {
      if (original[key][prop] !== styles[prop]) {
        difference[key][prop] = original[key][prop];
      }
    });
  });
}

function reapply(element) {
  let $children =  $(`.${element}`).find('*');
  // Object.keys(difference).forEach(key => {
  // for (var i = Object.keys(difference).length-1; i >= 0; i--) {
  var i = Object.keys(difference).length-1;
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

        let j = 0;
        var innerInterval = window.setInterval(
          function () {
            if (j < Object.keys(difference[key]).length) {
              setTimeout(function () {
                $target.css(Object.keys(difference[key])[j], difference[key][Object.keys(difference[key])[j]]);
                j++;
                console.log(Object.keys(difference[key])[j]);
                console.log(difference[key][Object.keys(difference[key])[j]]);
              }, 1000);
            } else {
              window.clearInterval(innerInterval);
              running = false;
              i--;
              if (i < 0) {
                window.clearInterval(outerInterval);
              }
            }
          }, 1000);
        }
    }, 1000);
}
