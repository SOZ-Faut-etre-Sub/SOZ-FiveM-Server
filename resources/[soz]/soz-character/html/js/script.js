$(document).on('click', '.spawn-dots', function (e) {
  e.preventDefault();
  OnClick()
  var SpawnDot = $(this).data('dotnum');
  CloseContainer()
  $.post('https://soz-character/SpawnPlayer', JSON.stringify({
    SpawnId: SpawnDot
  }))
});

CloseContainer = function () {
  $.post('https://soz-character/Close', JSON.stringify({}))
  $(".main-map-container").animate({ "left": "-150vh" }, 1000, function () {
    $(".main-map-container").css("display", "none");
    $(".map-text").css("left", "70vh");
    $('.map-text').html("<p>Où voulez-vous rejoindre l'île ?</p>");
    $(".spawn-dots-container").fadeOut(1);
  })
}
OpenSpawn = function (data) {
  $('.map-text').html("<p>W͟e͟l͟c͟o͟m͟e͟ t͟o͟ S͟t͟o͟r͟i͟e͟s͟ o͟f͟ Z͟e͟r͟a͟w͟o͟r͟l͟d͟</p><p>𝑉𝑒𝑢𝑖𝑙𝑙𝑒𝑧 𝑐ℎ𝑜𝑖𝑠𝑖𝑟 𝑢𝑛𝑒 𝑣𝑖𝑙𝑙𝑒 𝑜ù 𝑑é𝑏𝑢𝑡𝑒𝑟 𝑝𝑎𝑟𝑚𝑖 𝑃𝑎𝑙𝑒𝑡𝑜 𝐵𝑎𝑦 𝑒𝑡 𝐿𝑜𝑠 𝑆𝑎𝑛𝑡𝑜𝑠.</p>");
  $(".map-text").css("left", "70vh");
  $(".map-text").css("top", "0vh");
  $(".main-map-container").css("display", "block");
  $(".main-map-container").animate({ "left": "0vh" }, 1000)
  $(".spawn-dots-container").fadeIn(450);
}

OnClick = function () {
  $.post('https://soz-character/Click', JSON.stringify({}))
}

window.addEventListener('message', function (event) {
  switch (event.data.action) {
    case "spawn":
      OpenSpawn(event.data);
      break;
  }
});