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
  let $children =  $(`.${element}`).children();
  Object.keys(difference).forEach(key => {
    let $target = undefined;
    if (key === element) {
      $target = $(element);
    } else {
      $target = $children.eq(key);
    }

    $target.css(difference[key]);
  });
}
