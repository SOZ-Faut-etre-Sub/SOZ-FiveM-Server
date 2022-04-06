var meterStarted = false;
var meterPlate = null;

$(document).on('keydown', function() {
    switch(event.keyCode) {
        case 27:
            $.post('https://qb-taxijob/hideMouse');
            break;
    }
});

$(document).ready(function(){

    $('.container').hide();

    window.addEventListener('message', function(event){
        var eventData = event.data;

        if (eventData.action == "openMeter") {
            if (eventData.toggle) {
                openMeter(eventData.meterData)
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
            updateMeter(eventData.meterData)
        }

        if (eventData.action == "resetMeter") {
            resetMeter()
        }
    });
});

function updateMeter(meterData) {
    $("#total-price").html("$ "+ (meterData.currentFare).toFixed(2))
    $("#total-distance").html((meterData.distanceTraveled / 200).toFixed(1) + " M")
}

function resetMeter() {
    $("#total-price").html("$ 0.00")
    $("#total-distance").html("0.0 M")
}

function meterToggle() {
    if (!meterStarted) {
        $.post('https://qb-taxijob/enableMeter', JSON.stringify({
            enabled: true,
        }));
        toggleMeter(true)
        meterStarted = true;
    } else {
        $.post('https://qb-taxijob/enableMeter', JSON.stringify({
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

function openMeter(meterData) {
    $('.container').fadeIn(150);
    $('#total-price-per-100m').html("$ " + (meterData.defaultPrice).toFixed(2))
}

function closeMeter() {
    $('.container').fadeOut(150);
}