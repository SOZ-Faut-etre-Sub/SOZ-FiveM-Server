CameraConfig = {
    enabled = false,
    prop = "prop_v_cam_01",
    animDict = "missfinale_c2mcs_1",
    anim = "fin_c2_mcs_1_camman",
    object = nil,
}

-- @TODO REWORK
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
        new_x = math.max(math.min(60.0, rotation.x + rightAxisY * -1.0 * (speed_lr) * (zoomvalue + 0.1)), -89.5)
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
-- @TODO REWORK

--- Camera
local spawnCameraObject = function()
    if CameraConfig.object ~= nil then
        return
    end

    QBCore.Functions.RequestModel(CameraConfig.prop)
    local player = PlayerPedId()
    local plyCoords = GetOffsetFromEntityInWorldCoords(player, 0.0, 0.0, -5.0)

    CameraConfig.object = CreateObject(GetHashKey(CameraConfig.prop), plyCoords.x, plyCoords.y, plyCoords.z, 1, 1, 1)
    SetNetworkIdCanMigrate(ObjToNet(CameraConfig.object), false)
    AttachEntityToEntity(CameraConfig.object, player, GetPedBoneIndex(player, 28422), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1, 1, 0, 1, 0, 1)
    TaskPlayAnim(player, CameraConfig.animDict, CameraConfig.anim, 1.0, -1, -1, 50, 0, 0, 0, 0)
end

local deleteCameraObject = function()
    if CameraConfig.object == nil then
        return
    end

    StopAnimTask(PlayerPedId(), CameraConfig.animDict, CameraConfig.anim, 1.0)
    DetachEntity(CameraConfig.object, 1, 1)
    DeleteEntity(CameraConfig.object)
    CameraConfig.object = nil
end

-- TODO: should be improved
local createCameraThread = function()
    CreateThread(function()
        QBCore.Functions.RequestAnimDict(CameraConfig.animDict)
        local player = PlayerPedId()
        local cam = CreateCam("DEFAULT_SCRIPTED_FLY_CAMERA", true)
        local animTable = {
            -- ARRIERE
            {name = "_bwd_180_loop", button1 = 33, button2 = nil},
            -- ARRIERE DROIT
            {name = "_bwd_135_loop", button1 = 33 , button2 = 35},
            -- ARRIERE GAUCHE
            {name = "_bwd_-135_loop", button1 = 33 , button2 = 34},
            -- GAUCHE
            {name = "_bwd_-90_loop", button1 = nil , button2 = 34},
            -- DROITE
            {name = "_fwd_90_loop", button1 = nil , button2 = 35},
            -- AVANT DROITE
            {name = "_fwd_45_loop", button1 = 32 , button2 = 35},
            -- AVANT GAUCHE
            {name = "_fwd_-45_loop", button1 = 32 , button2 = 34},
            -- AVANT
            {name = "_fwd_0_loop", button1 = 32 , button2 = nil},
        }

        if not IsPedSittingInAnyVehicle(player) then
            AttachCamToEntity(cam, player, 0.05, 0.5, 0.7, true)
        else
            AttachCamToEntity(cam, player, 0, 0, 0.7, true)
        end

        SetCamRot(cam, 2.0, 1.0, GetEntityHeading(player))
        SetCamFov(cam, fov)
        RenderScriptCams(true, false, 0, 1, 0)

        exports["soz-core"]:EnableTwitchNewsOverlay()
        while CameraConfig.enabled do
            if not IsPedSittingInAnyVehicle(player) then
                SetEntityHeading(player, new_z)
            end

            if not IsEntityPlayingAnim(player, CameraConfig.animDict, CameraConfig.anim, 3) then
                TaskPlayAnim(player, CameraConfig.animDict, CameraConfig.anim, 1.0, -1, -1, 50, 0, 0, 0, 0)
            end

            local zoomvalue = (1.0 / (fov_max - fov_min)) * (fov - fov_min)

            CheckInputRotation(cam, zoomvalue)
            HandleZoom(cam)
            HideHUDThisFrame()
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

            
            local isZPressed = IsControlPressed(0, 32)
            local isSPressed = IsControlPressed(0, 33)
            local isQPressed = IsControlPressed(0, 34)
            local isDPressed = IsControlPressed(0, 35)
            local isShiftPressed = IsControlPressed(0,21)
            
            for i = 1, #animTable do
                local animData = animTable[i]
                local isYAxisPressed = false
                local isXAxisPressed = false

                if animData.button1 == 32 and isZPressed then
                    isYAxisPressed = true
                elseif animData.button1 == 33 and isSPressed then
                    isYAxisPressed = true
                elseif animData.button1 == nil and not isZPressed and not isSPressed then
                    isYAxisPressed = true
                end
                

                if animData.button2 == 34 and isQPressed then
                    isXAxisPressed = true
                elseif animData.button2 == 35 and isDPressed then
                    isXAxisPressed = true
                elseif animData.button2 == nil and not isQPressed and not isDPressed then
                    isXAxisPressed = true
                end         
                
                if isXAxisPressed and isYAxisPressed and not IsPedSittingInAnyVehicle(player) then
                    TaskPlayAnim(player, "move_strafe@first_person@generic", (isShiftPressed and 'run' or 'walk')..animData.name, 5.0, 1.0, -1, 1, 0.1)
                    while ((animData.button1 ~= nil and IsControlPressed(0, animData.button1)) or (animData.button1 == nil and not IsControlPressed(0, 32) and not IsControlPressed(0,33))) and 
                        ((animData.button2 ~= nil and IsControlPressed(0, animData.button2)) or (animData.button2 == nil and not IsControlPressed(0, 34) and not IsControlPressed(0,35))) and 
                        ((isShiftPressed and IsControlPressed(0, 21)) or (not isShiftPressed and not IsControlPressed(0, 21)))  do 


                        CheckInputRotation(cam, zoomvalue)
                        if not IsPedSittingInAnyVehicle(player) then
                            SetEntityHeading(player, new_z)
                        end
                        Wait(0) 
                    end
                    StopAnimTask(player, "move_strafe@first_person@generic", (isShiftPressed and 'run' or 'walk')..animData.name, 2.0)
                end
            end           

            Wait(1)
        end
        exports["soz-core"]:DisableTwitchNewsOverlay()

        fov = (fov_max + fov_min) * 0.5
        RenderScriptCams(false, false, 0, 1, 0)
        DestroyCam(cam, false)
    end)
end

local cameraOperator = function()
    if CameraConfig.enabled then
        if CameraConfig.object == nil then
            spawnCameraObject()
        end
        createCameraThread()
    else
        if CameraConfig.object ~= nil then
            deleteCameraObject()
        end
    end
end

--- Toggle Events
RegisterNetEvent("jobs:utils:camera:toggle", function()
    if MicConfig.enabled or BMicConfig.enabled then
        return
    elseif IsPedSittingInAnyVehicle(PlayerPedId()) then
        local veh = GetVehiclePedIsIn(PlayerPedId(), false)
        if GetPedInVehicleSeat(veh, -1) == PlayerPedId() then
            return
        end
    end

    CameraConfig.enabled = not CameraConfig.enabled
    cameraOperator()
end)

--- Set state Events
RegisterNetEvent("jobs:utils:camera:set", function(value)
    CameraConfig.enabled = value
    cameraOperator()
end)

AddEventHandler("ems:client:onDeath", function()
    CameraConfig.enabled = false
    deleteCameraObject()
end)
