var meterStarted = false;
var meterPlate = null;

$(document).ready(function(){

    $('.container').hide();

    window.addEventListener('message', function(event){
        var eventData = event.data;

        if (eventData.action == "openMeter") {
            if (eventData.toggle) {
                openMeter(eventData.HorodateurData)
                meterPlate = eventData.plate;
            } else {
                closeMeter()
                meterPlate = null;
            }
        }

        if (eventData.action == "toggleMeter") {
            meterToggle()
        }

        if (eventData.action == "updateMeter") {
            updateMeter(eventData.HorodateurData)
        }

        if (eventData.action == "resetMeter") {
            resetMeter()
        }
    });
});

function updateMeter(HorodateurData) {
    $("#total-price").html("$ "+ (HorodateurData.TarifActuelle).toFixed(2))
    $("#total-distance").html((HorodateurData.Distance / 1000).toFixed(1) + " Km")
}

function resetMeter() {
    $("#total-price").html("$ 0.00")
    $("#total-distance").html("0.0 Km")
}

function meterToggle() {
    if (!meterStarted) {
        $.post('https://soz-taxi/enableMeter', JSON.stringify({
            enabled: true,
        }));
        toggleMeter(true)
        meterStarted = true;
    } else {
        $.post('https://soz-taxi/enableMeter', JSON.stringify({
            enabled: false,
        }));
        toggleMeter(false)
        meterStarted = false;
    }
}

function toggleMeter(enabled) {
    if (enabled) {
        $(".toggle-meter-btn").html("<p>Start</p>");
        $(".toggle-meter-btn p").css({"color": "rgb(51, 160, 37)"});
    } else {
        $(".toggle-meter-btn").html("<p>Stop</p>");
        $(".toggle-meter-btn p").css({"color": "rgb(231, 30, 37)"});
    }
}

function openMeter(HorodateurData) {
    $('.container').fadeIn(150);
    $('#total-price-per-100m').html("$ " + (HorodateurData.defaultPrice).toFixed(2))
}

function closeMeter() {
    $('.container').fadeOut(150);
}