let SOZui = {}

SOZui.displayHud = function(bool) {
  document.querySelector('body').style.opacity = bool ? '1' : '0'
}

SOZui.displayVehicleHud = function(bool) {
  document.querySelector('.speedometer').style.opacity = bool ? '1' : '0'
}

SOZui.updateNeedsElement = function(data) {
  if (data.hunger !== undefined) {
    document.querySelector('player-need[data-type="hunger"]').dataset['value'] = data.hunger
  }
  if (data.thirst !== undefined) {
    document.querySelector('player-need[data-type="thirst"]').dataset['value'] = data.thirst
  }
}

SOZui.updateVehicleElement = function(data) {
  if (data.speed !== undefined) {
    document.querySelector('vehicle-speed').dataset['value'] = data.speed
  }
  if (data.fuel !== undefined) {
    document.querySelector('vehicle-fuel').dataset['value'] = data.fuel
  }
  if (data.haveLight !== undefined && data.lightsOn !== undefined && data.highBeamsOn !== undefined) {
    let lightState = 0
    if (data.haveLight && data.highBeamsOn) {
      lightState = 2
    } else if (data.haveLight && data.lightsOn) {
      lightState = 1
    }

    document.querySelector('vehicle-light').dataset['value'] = lightState
  }
  if (data.haveSeatbelt !== undefined) {
    const seatbelt = document.querySelector('.seatbelt')

    if (data.haveSeatbelt) {
      seatbelt.classList.replace('nobelt', 'belt')
    } else {
      seatbelt.classList.replace('belt', 'nobelt')
    }
  }
}

window.addEventListener("message", (event) => {
  switch (event.data.action) {
    case "display":
      SOZui.displayHud(event.data.show);
      break;
    case "speedometer":
      SOZui.displayVehicleHud(event.data.show);
      break;
    case "update_needs":
      SOZui.updateNeedsElement(event.data);
      break;
    case "update_vehicle":
      SOZui.updateVehicleElement(event.data);
      break;
  }
});
