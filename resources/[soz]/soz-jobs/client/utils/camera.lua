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
        if not IsPedSittingInAnyVehicle(player) then
            AttachCamToEntity(cam, player, 0.05, 0.5, 0.7, true)
        else
            AttachCamToEntity(cam, player, 0, 0, 0.7, true)
        end
        SetCamRot(cam, 2.0, 1.0, GetEntityHeading(player))
        SetCamFov(cam, fov)
        RenderScriptCams(true, false, 0, 1, 0)

        exports["soz-hud"]:EnableTwitchNewsOverlay()
        while CameraConfig.enabled do
            if not IsPedSittingInAnyVehicle(player) then
                SetEntityHeading(player, new_z)
            end

            DisableControlAction(2, 30, true)
            DisableControlAction(2, 33, true)

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

            Wait(1)
        end
        exports["soz-hud"]:DisableTwitchNewsOverlay()

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
