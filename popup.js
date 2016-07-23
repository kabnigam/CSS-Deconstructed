document.addEventListener('DOMContentLoaded', function() {

  document.getElementById('pageSubmit').addEventListener("click", () => {
    getInput(this);
  }, false);

  document.getElementById('class_input').addEventListener("input", () => {
    if (document.getElementById('class_input').value !== '') {
      $('#id_input').prop('disabled', true);
      $('#id_input').css('background-color','gray');
    } else {
      $('#id_input').prop('disabled', false);
      $('#id_input').css('background-color','white');
    }


  $('a').on('click', function() {
    $('#changes').css('display', 'block');
  });

  }, false);

  document.getElementById('id_input').addEventListener("input", () => {
    if (document.getElementById('id_input').value !== '') {
      $('#class_input').prop('disabled', true);
      $('#class_input').css('background-color','gray');
    } else {
      $('#class_input').prop('disabled', false);
      $('#class_input').css('background-color','white');
    }
  }, false);

}, false);

function getInput(target) {

  document.getElementById('pageSubmit').removeEventListener("click", function() {
    getInput(this);
  }, false);
  $('#pageSubmit').attr('value', 'Build!');
  let form = document.getElementById('form');
  let el = parseInput(form.childNodes[3].value, form.childNodes[7].value, form.childNodes[11].value, form.childNodes[15].value);
  $('#pageSubmit').on('click', build.bind(null, el));
}

function build(element) {
  $('#pageSubmit').off('click');
  $('#pageSubmit').attr('value', 'Building...');
  $('#pageSubmit').prop('disabled', true);
  let current_element = '';
  let current_value = '';
  chrome.tabs.executeScript({code: 'var element = ' + JSON.stringify(element)}, function() {
    chrome.tabs.executeScript({code: 'var deconstruct = false'}, function () {
      chrome.tabs.executeScript({file: 'jquery.min.js'}, function() {
        chrome.tabs.executeScript({file: 'content_script.js'}, function() {

          chrome.runtime.onMessage.addListener(
            function(message, sender, sendResponse) {
              var out = document.getElementById("changes");
              var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;


              if(isScrolledToBottom) {
                
                out.scrollTop = out.scrollHeight - out.clientHeight;

              }
                switch(message.type) {
                    case "change_element":
                      if (current_element !== message.value) {

                        $('#changes').append(`<h2>${message.value}</h2>`);
                        current_element = message.value;
                        break;
                      }
                    case "change_value":
                      if (current_value !== message.value) {
                        $('#changes').append(`<h4>${message.value}</h4>`);
                        current_value = message.value;
                        break;

                      }
                }
            }
          );
          $('#pageSubmit').attr('value', 'Deconstruct!');
          $('#pageSubmit').prop('disabled', false);
          document.getElementById('pageSubmit').addEventListener("click", () => {
            getInput(this);
          }, false);
        });
      });
    });
  });

}



function parseInput(selector, klass, id, time) {
  let element = '';

  if (selector !== '') {
    element += selector;
    if (klass) {
      element += '.' + klass;
    } else if (id) {
      element += '#' + id;
    }
  } else if (klass !==  '') {
    element += '.' + klass;
  } else if (id !==  '') {
    element += '#' + id;
  }
  chrome.tabs.executeScript({code: 'var element = ' + JSON.stringify(element)}, function() {
    chrome.tabs.executeScript({code: 'var deconstruct = true'}, function () {
      chrome.tabs.executeScript({code: 'var time = ' + JSON.stringify(time)}, function () {
        chrome.tabs.executeScript({file: 'jquery.min.js'}, function() {
          chrome.tabs.executeScript({file: 'content_script.js'});
        });
      });
    });
  });
  return element;
}
