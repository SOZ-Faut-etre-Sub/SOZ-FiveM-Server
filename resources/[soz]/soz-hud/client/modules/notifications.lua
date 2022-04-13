function RequestStreamedTexture(dictionary, cb)
    if not HasStreamedTextureDictLoaded(dictionary) then
        CreateThread(function()
            RequestStreamedTextureDict(dictionary)

            repeat
                Wait(10)
            until HasStreamedTextureDictLoaded(dictionary)

            cb()
        end)
    else
        cb()
    end
end

--- DrawNotification Display basic notification
--- @param message string Notification message
--- @param style string Notification style (success, info, error)
--- @param delay number Set Notification display time
local function DrawNotification(message, style, delay)
    SendNUIMessage({action = "draw_basic_notification", message = message, style = style, delay = delay})
end

RegisterNetEvent("hud:client:DrawNotification", function(msg, style, delay)
    DrawNotification(msg, style, delay)
end)

exports("DrawNotification", DrawNotification)

--- DrawAdvancedNotification Display advanced notification
--- @param message string Notification message
--- @param title string Notification title
--- @param subtitle string Notification subtitle
--- @param image string Notification image (https://wiki.gtanet.work/index.php?title=Notification_Pictures)
--- @param style string Notification style (success, info, error)
--- @param delay number Set Notification display time
local function DrawAdvancedNotification(title, subtitle, message, image, style, delay)
    RequestStreamedTexture(image, function()
        SendNUIMessage({
            action = "draw_advanced_notification",
            title = title,
            subtitle = subtitle,
            message = message,
            image = image,
            style = style,
            delay = delay,
        })
    end)
end

RegisterNetEvent("hud:client:DrawAdvancedNotification", function(title, subtitle, message, image, style, delay)
    DrawAdvancedNotification(title, subtitle, message, image, style, delay)
end)

exports("DrawAdvancedNotification", DrawAdvancedNotification)
