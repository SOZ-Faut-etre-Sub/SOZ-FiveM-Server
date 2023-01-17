--- Copy pasta from the camera script
local binocularsConfig = {enabled = false}

local fov_max = 70.0
local fov_min = 5.0
local zoomspeed = 10.0
local speed_lr = 8.0
local speed_ud = 8.0
local fov = (fov_max + fov_min) * 0.5

-- FUNCTIONS--
local function HideHUDThisFrame()
    HideHelpTextThisFrame()
    HideHudAndRadarThisFrame()
    HideHudComponentThisFrame(1)
    HideHudComponentThisFrame(2)
    HideHudComponentThisFrame(3)
    HideHudComponentThisFrame(4)
    HideHudComponentThisFrame(6)
    HideHudComponentThisFrame(7)
    HideHudComponentThisFrame(8)
    HideHudComponentThisFrame(9)
    HideHudComponentThisFrame(13)
    HideHudComponentThisFrame(11)
    HideHudComponentThisFrame(12)
    HideHudComponentThisFrame(15)
    HideHudComponentThisFrame(18)
    HideHudComponentThisFrame(19)
end

local function CheckInputRotation(cam, zoomvalue)
    local rightAxisX = GetDisabledControlNormal(0, 220)
    local rightAxisY = GetDisabledControlNormal(0, 221)
    local rotation = GetCamRot(cam, 2)
    if rightAxisX ~= 0.0 or rightAxisY ~= 0.0 then
        new_z = rotation.z + rightAxisX * -1.0 * (speed_ud) * (zoomvalue + 0.1)
        new_x = math.max(math.min(20.0, rotation.x + rightAxisY * -1.0 * (speed_lr) * (zoomvalue + 0.1)), -89.5)
        SetCamRot(cam, new_x, 0.0, new_z, 2)
    end
end

local function HandleZoom(cam)
    local lPed = PlayerPedId()
    if not (IsPedSittingInAnyVehicle(lPed)) then

        if IsControlJustPressed(0, 241) then
            fov = math.max(fov - zoomspeed, fov_min)
        end
        if IsControlJustPressed(0, 242) then
            fov = math.min(fov + zoomspeed, fov_max)
        end
        local current_fov = GetCamFov(cam)
        if math.abs(fov - current_fov) < 0.1 then
            fov = current_fov
        end
        SetCamFov(cam, current_fov + (fov - current_fov) * 0.05)
    else
        if IsControlJustPressed(0, 17) then
            fov = math.max(fov - zoomspeed, fov_min)
        end
        if IsControlJustPressed(0, 16) then
            fov = math.min(fov + zoomspeed, fov_max)
        end
        local current_fov = GetCamFov(cam)
        if math.abs(fov - current_fov) < 0.1 then
            fov = current_fov
        end
        SetCamFov(cam, current_fov + (fov - current_fov) * 0.05)
    end
end

local createCameraThread = function()
    CreateThread(function()
        local player = PlayerPedId()

        if not IsPedSittingInAnyVehicle(player) then
            TaskStartScenarioInPlace(PlayerPedId(), "WORLD_HUMAN_BINOCULARS", 0, 1)
            PlayAmbientSpeech1(PlayerPedId(), "GENERIC_CURSE_MED", "SPEECH_PARAMS_FORCE")

            Citizen.Wait(2000)
        end

        local cam = CreateCam("DEFAULT_SCRIPTED_FLY_CAMERA", true)
        AttachCamToEntity(cam, player, 0.05, 0.5, 0.7, true)
        SetCamRot(cam, 2.0, 1.0, GetEntityHeading(player))
        SetCamFov(cam, fov)
        RenderScriptCams(true, false, 0, 1, 0)
        PushScaleformMovieFunction(scaleform, "SET_CAM_LOGO")
        PushScaleformMovieFunctionParameterInt(0) -- 0 for nothing, 1 for LSPD logo
        PopScaleformMovieFunctionVoid()

        local scaleform = RequestScaleformMovie("BINOCULARS")
        while not HasScaleformMovieLoaded(scaleform) do
            Citizen.Wait(5)
        end

        while binocularsConfig.enabled do
            SetPauseMenuActive(false)
            if not IsPedSittingInAnyVehicle(player) then
                SetEntityHeading(player, new_z)
            end

            DisableControlAction(2, 30, true)
            DisableControlAction(2, 33, true)

            local zoomvalue = (1.0 / (fov_max - fov_min)) * (fov - fov_min)
            CheckInputRotation(cam, zoomvalue)
            HandleZoom(cam)
            HideHUDThisFrame()
            DrawScaleformMovieFullscreen(scaleform, 255, 255, 255, 255)

            local camHeading = GetGameplayCamRelativeHeading()
            local camPitch = GetGameplayCamRelativePitch()
            if camPitch < -70.0 then
                camPitch = -70.0
            elseif camPitch > 42.0 then
                camPitch = 42.0
            end
            camPitch = (camPitch + 70.0) / 112.0
            if camHeading < -180.0 then
                camHeading = -180.0
            elseif camHeading > 180.0 then
                camHeading = 180.0
            end
            camHeading = (camHeading + 180.0) / 360.0
            SetTaskMoveNetworkSignalFloat(player, "Pitch", camPitch)
            SetTaskMoveNetworkSignalFloat(player, "Heading", camHeading * -1.0 + 1.0)

            Wait(5)
        end
        -- exports["soz-hud"]:DisableTwitchNewsOverlay()

        ClearPedTasks(PlayerPedId())
        RenderScriptCams(false, false, 0, 1, 0)
        DestroyCam(cam, false)
    end)
end

local cameraOperator = function()
    if binocularsConfig.enabled then
        createCameraThread()
    end
end

--- Toggle Events
RegisterNetEvent("items:binoculars:toggle", function()
    binocularsConfig.enabled = not binocularsConfig.enabled
    cameraOperator()
end)

--- Set state Events
RegisterNetEvent("items:binoculars:set", function(value)
    binocularsConfig.enabled = value
    cameraOperator()
end)

AddEventHandler("ems:client:onDeath", function()
    binocularsConfig.enabled = false
end)
