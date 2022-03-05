local fadeDelay = 500

--- Fade out to black screen
--- /!\ MUST BE EXECUTED WITHIN A THREAD
function ScreenFadeOut()
    DoScreenFadeOut(fadeDelay)
    Citizen.Wait(fadeDelay)
end

--- Fade in, from black screen to game
function ScreenFadeIn()
    DoScreenFadeIn(fadeDelay)
end
