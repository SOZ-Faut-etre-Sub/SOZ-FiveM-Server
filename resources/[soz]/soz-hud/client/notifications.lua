function RequestStreamedTexture(dictionary)
    if not HasStreamedTextureDictLoaded(dictionary) then
        CreateThread(function()
            RequestStreamedTextureDict(dictionary)

            repeat
                Wait(10)
            until HasStreamedTextureDictLoaded(dictionary)
        end)
    end
end

--- DrawNotification Display basic notification
--- @param message string Notification message
--- @param flash boolean Notification flash on the screen
--- @param delay number Set Notification display time
local function DrawNotification(message, flash, delay)
    SendNUIMessage({action = "draw_basic_notification", message = message, flash = flash, delay = delay})
end

RegisterNetEvent("hud:client:DrawNotification", function(msg, flash, save)
    DrawNotification(msg, flash, save)
end)

exports("DrawNotification", DrawNotification)

--- DrawAdvancedNotification Display advanced notification
--- @param message string Notification message
--- @param title string Notification title
--- @param subtitle string Notification subtitle
--- @param image string Notification image (https://wiki.gtanet.work/index.php?title=Notification_Pictures)
--- @param flash boolean Notification flash on the screen
--- @param delay number Set Notification display time
local function DrawAdvancedNotification(title, subtitle, message, image, flash, delay)
    RequestStreamedTexture(image)
    SendNUIMessage({
        action = "draw_advanced_notification",
        title = title,
        subtitle = subtitle,
        message = message,
        image = image,
        flash = flash,
        delay = delay,
    })
end

RegisterNetEvent("hud:client:DrawAdvancedNotification", function(title, subtitle, message, image, flash, delay)
    DrawAdvancedNotification(title, subtitle, message, image, flash, delay)
end)

exports("DrawAdvancedNotification", DrawAdvancedNotification)
