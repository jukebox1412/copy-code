var switchLeft = false;

// function fired on keyboard shortcut
function primeSwitch(command) {
  if (command == "toggle_left") {
    switchLeft = true;
  } else if (command == "toggle_right") {
    switchLeft = false;
  }

  // query for all tabs of active window
  var prom = browser.tabs.query({
    currentWindow: true
  });
  prom.then(indexTabs, logFailure);
}

// function fired after we have determined which command was fired
function indexTabs(_tabs) {
  if (_tabs.length < 2) {
    return;
  }

  var active_id = 0;
  var active = 0;
  var lastPinned = -1;
  var activePinned = false;

  for (let i = 0; i < _tabs.length; i++) {
    if (_tabs[i].active) {
      if (_tabs[i].pinned) {
        activePinned = true;
      }
      active = _tabs[i].index;
      active_id = _tabs[i].id;
    }

    if (_tabs[i].pinned) {
      if (lastPinned < _tabs[i].index) {
        lastPinned = _tabs[i].index;
      }
    }
  }

  if (switchLeft) {
    if (activePinned && active == 0) {
      browser.tabs.move(active_id, {
        index: lastPinned
      });
    } else {
      if (active == lastPinned + 1) {
        browser.tabs.move(active_id, {
          index: -1
        });
      } else {
        browser.tabs.move(active_id, {
          index: active - 1
        });
      }
    }
  } else {
    if (activePinned && active == lastPinned) {
      browser.tabs.move(active_id, {
        index: 0
      });
    } else {
      if (active == _tabs.length - 1) {
        browser.tabs.move(active_id, {
          index: lastPinned + 1
        });
      } else {
        browser.tabs.move(active_id, {
          index: active + 1
        });
      }
    }
  }
}


function logFailure(error) {
  console.log(`ERROR:\t ${error}`);
}

browser.commands.onCommand.addListener(primeSwitch);