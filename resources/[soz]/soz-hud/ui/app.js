let SOZ_HUD = {}

SOZ_HUD.displayHud = function(bool) {
  document.querySelector('body').style.opacity = bool ? '1' : '0'
}

SOZ_HUD.updateNeeds = function(needs) {
  if (needs.hunger !== undefined) {
    document.querySelector('player-need[data-type="hunger"]').dataset['value'] = needs.hunger
  }
  if (needs.thirst !== undefined) {
    document.querySelector('player-need[data-type="thirst"]').dataset['value'] = needs.thirst
  }
}

window.addEventListener("message", (event) => {
  switch (event.data.action) {
    case "display":
      SOZ_HUD.displayHud(event.data.show);
      break;
    case "update_needs":
      SOZ_HUD.updateNeeds(event.data);
      break;
  }
});
