local CurrentResourceName = GetCurrentResourceName()
local Config, Types, Players, Entities, Models, Zones, nuiData, sendData, sendDistance = Config, {{}, {}, {}}, {}, {}, {}, {}, {}, {}, {}
local playerPed, targetActive, hasFocus, success, PedsReady, AllowTarget = PlayerPedId(), false, false, false, false, true
local screen = {}
local table_wipe = table.wipe
local pairs = pairs
local CheckOptions

---------------------------------------
---Source: https://github.com/citizenfx/lua/blob/luaglm-dev/cfx/libs/scripts/examples/scripting_gta.lua
---Credits to gottfriedleibniz
local glm = require 'glm'

-- Cache common functions
local glm_rad = glm.rad
local glm_quatEuler = glm.quatEulerAngleZYX
local glm_rayPicking = glm.rayPicking

-- Cache direction vectors
local glm_up = glm.up()
local glm_forward = glm.forward()

local function ScreenPositionToCameraRay()
    local pos = GetFinalRenderedCamCoord()
    local rot = glm_rad(GetFinalRenderedCamRot(2))

    local q = glm_quatEuler(rot.z, rot.y, rot.x)
    return pos, glm_rayPicking(
        q * glm_forward,
        q * glm_up,
        glm_rad(screen.fov),
        screen.ratio,
        0.10000, -- GetFinalRenderedCamNearClip(),
        10000.0, -- GetFinalRenderedCamFarClip(),
        0, 0
    )
end
---------------------------------------

-- Functions

local function RaycastCamera(flag, playerCoords)
	if not playerPed then playerPed = PlayerPedId() end
	local rayPos, rayDir = ScreenPositionToCameraRay()
	local destination = rayPos + 10000 * rayDir
	local rayHandle = StartShapeTestLosProbe(rayPos.x, rayPos.y, rayPos.z, destination.x, destination.y, destination.z, flag or -1, playerPed, 0)
	while true do
		local result, hit, endCoords, _, entityHit = GetShapeTestResult(rayHandle)
		if Config.Debug then
			DrawLine(playerCoords.x, playerCoords.y, playerCoords.z, destination.x, destination.y, destination.z, 255, 0, 255, 255)
			DrawLine(destination.x, destination.y, destination.z, endCoords.x, endCoords.y, endCoords.z, 255, 0, 255, 255)
		end
		-- todo: add support for materialHash
		if result ~= 1 then
			local distance = playerCoords and #(playerCoords - endCoords)
			return flag, endCoords, distance, entityHit, entityHit and GetEntityType(entityHit) or 0
		end
		Wait(0)
	end
end

exports('RaycastCamera', RaycastCamera)

local function DisableNUI()
	SetNuiFocus(false, false)
	SetNuiFocusKeepInput(false)
	hasFocus = false
end

exports('DisableNUI', DisableNUI)

local function EnableNUI(options)
	if targetActive and not hasFocus then
		SetCursorLocation(0.5, 0.5)
		SetNuiFocus(true, true)
		SetNuiFocusKeepInput(true)
		hasFocus = true
		SendNUIMessage({response = "validTarget", data = options})
	end
end

exports('EnableNUI', EnableNUI)

local function LeftTarget()
	SetNuiFocus(false, false)
	SetNuiFocusKeepInput(false)
	success, hasFocus = false, false
	table_wipe(sendData)
	SendNUIMessage({response = "leftTarget"})
end

exports('LeftTarget', LeftTarget)

local function DisableTarget(forcedisable)
	if (targetActive and not hasFocus) or forcedisable then
		SetNuiFocus(false, false)
		SetNuiFocusKeepInput(false)
		Wait(100)
		targetActive, success, hasFocus = false, false, false
		SendNUIMessage({response = "closeTarget"})
	end
end

exports('DisableTarget', DisableTarget)

local function DrawOutlineEntity(entity, bool)
	if Config.EnableOutline then
		if not IsEntityAPed(entity) then
			SetEntityDrawOutline(entity, bool)
		end
	end
end

exports('DrawOutlineEntity', DrawOutlineEntity)

local function CheckEntity(hit, datatable, entity, distance)
	if next(datatable) then
		table_wipe(sendDistance)
		table_wipe(nuiData)
		local slot = 0
		for o, data in pairs(datatable) do
			if CheckOptions(data, entity, distance) then
				slot += 1
				sendData[slot] = data
				sendData[slot].entity = entity
				nuiData[slot] = {
					icon = data.icon,
					label = data.label
				}
				sendDistance[data.distance] = true
			else sendDistance[data.distance] = false end
		end
		if nuiData[1] then
			success = true
			SendNUIMessage({response = "foundTarget", data = sendData[slot].targeticon})
			DrawOutlineEntity(entity, true)
			while targetActive and success do
				local _, _, dist, entity2, _ = RaycastCamera(hit, GetEntityCoords(playerPed))
				if entity ~= entity2 then
					LeftTarget()
					DrawOutlineEntity(entity, false)
					break
				elseif not hasFocus and (IsControlPressed(0, Config.MenuControlKey) or IsDisabledControlPressed(0, Config.MenuControlKey)) then
					EnableNUI(nuiData)
					DrawOutlineEntity(entity, false)
				else
					for k, v in pairs(sendDistance) do
						if v and dist > k then
							LeftTarget()
							DrawOutlineEntity(entity, false)
							break
						end
					end
				end
				Wait(0)
			end
		end
		LeftTarget()
		DrawOutlineEntity(entity, false)
	end
end

exports('CheckEntity', CheckEntity)

local Bones = Load('bones')
local function CheckBones(coords, entity, bonelist)
	local closestBone = -1
	local closestDistance = 20
	local closestPos, closestBoneName
	for k, v in pairs(bonelist) do
		if Bones.Options[v] then
			local boneId = GetEntityBoneIndexByName(entity, v)
			local bonePos = GetWorldPositionOfEntityBone(entity, boneId)
			local distance = #(coords - bonePos)
			if closestBone == -1 or distance < closestDistance then
				closestBone, closestDistance, closestPos, closestBoneName = boneId, distance, bonePos, v
			end
		end
	end
	if closestBone ~= -1 then return closestBone, closestPos, closestBoneName
	else return false end
end

exports('CheckBones', CheckBones)

local function EnableTarget()
	if not AllowTarget or success or (not Config.Standalone and not LocalPlayer.state['isLoggedIn']) or IsNuiFocused() or (Config.DisableInVehicle and IsPedInAnyVehicle(playerPed or PlayerPedId(), false)) then return end
	if not CheckOptions then CheckOptions = _ENV.CheckOptions end
	if not targetActive and CheckOptions then
		targetActive = true
		SendNUIMessage({response = "openTarget"})
		CreateThread(function()
			local playerId = PlayerId()
			repeat
				SetPauseMenuActive(false)
				if hasFocus then
					DisableControlAction(0, 1, true)
					DisableControlAction(0, 2, true)
				end
				DisablePlayerFiring(playerId, true)
				DisableControlAction(0, 24, true)
				DisableControlAction(0, 25, true)
				DisableControlAction(0, 37, true)
				DisableControlAction(0, 47, true)
				DisableControlAction(0, 58, true)
				DisableControlAction(0, 140, true)
				DisableControlAction(0, 141, true)
				DisableControlAction(0, 142, true)
				DisableControlAction(0, 143, true)
				DisableControlAction(0, 257, true)
				DisableControlAction(0, 263, true)
				DisableControlAction(0, 264, true)
				Wait(0)
			until not targetActive
		end)
		playerPed = PlayerPedId()
		screen.ratio = GetAspectRatio(true)
		screen.fov = GetFinalRenderedCamFov()
		local curFlag = 30

		while targetActive do
			local sleep = 0
			local hit, coords, distance, entity, entityType = RaycastCamera(curFlag, GetEntityCoords(playerPed))
			if curFlag == 30 then curFlag = -1 else curFlag = 30 end
			if distance <= Config.MaxDistance then
				if entityType > 0 then
					-- Owned entity targets
					if NetworkGetEntityIsNetworked(entity) then
						local data = Entities[NetworkGetNetworkIdFromEntity(entity)]
						if data ~= nil then
							CheckEntity(hit, data, entity, distance)
						end
					end

					-- Player and Ped targets
					if entityType == 1 then
						local data = Models[GetEntityModel(entity)]
						if IsPedAPlayer(entity) then data = Players end
						if data ~= nil then
							CheckEntity(hit, data, entity, distance)
						end

					-- Vehicle bones
					elseif entityType == 2 then
						local closestBone, closestPos, closestBoneName = CheckBones(coords, entity, Bones.Vehicle)
						local datatable = Bones.Options[closestBoneName]
						if datatable ~= nil then
							if closestBone then
								table_wipe(sendDistance)
								table_wipe(nuiData)
								local slot = 0
								for o, data in pairs(datatable) do
									if CheckOptions(data, entity, #(coords - closestPos)) then
										slot += 1
										sendData[slot] = data
										sendData[slot].entity = entity
										nuiData[slot] = {
											icon = data.icon,
											label = data.label
										}
										sendDistance[data.distance] = true
									else sendDistance[data.distance] = false end
								end
								if nuiData[1] then
									success = true
									SendNUIMessage({response = "foundTarget", data = sendData[slot].targeticon})
									DrawOutlineEntity(entity, true)
									while targetActive and success do
										local _, _, dist, entity2, _ = RaycastCamera(hit, GetEntityCoords(playerPed))
										if entity == entity2 then
											local closestBone2 = CheckBones(coords, entity, Bones.Vehicle)
											if closestBone ~= closestBone2 then
												LeftTarget()
												DrawOutlineEntity(entity, false)
												break
											elseif not hasFocus and (IsControlPressed(0, Config.MenuControlKey) or IsDisabledControlPressed(0, Config.MenuControlKey)) then
												EnableNUI(nuiData)
												DrawOutlineEntity(entity, false)
											else
												for k, v in pairs(sendDistance) do
													if v and dist > k then
														LeftTarget()
														DrawOutlineEntity(entity, false)
														break
													end
												end
											end
										else
											LeftTarget()
											DrawOutlineEntity(entity, false)
											break
										end
										Wait(0)
									end
									LeftTarget()
									DrawOutlineEntity(entity, false)
								end
							end
						else
							-- Specific Vehicle targets
							local data = Models[GetEntityModel(entity)]
							if data ~= nil then
								CheckEntity(hit, data, entity, distance)
							end
						end

					-- Entity targets
					elseif entityType > 2 then
						local data = Models[GetEntityModel(entity)]
						if data ~= nil then
							CheckEntity(hit, data, entity, distance)
						end
					end

					-- Generic targets
					if not success then
						local data = Types[entityType]
						if data ~= nil then
							CheckEntity(hit, data, entity, distance)
						end
					end
				else sleep += 20 end
				if not success then
					-- Zone targets
					local closestDis, closestZone
					for _, zone in pairs(Zones) do
						if distance < (closestDis or Config.MaxDistance) and distance <= zone.targetoptions.distance and zone:isPointInside(coords) then
							closestDis = distance
							closestZone = zone
						end
					end

					if closestZone then
						table_wipe(nuiData)
						local slot = 0
						for o, data in pairs(closestZone.targetoptions.options) do
							if CheckOptions(data, entity, distance) then
								slot += 1
								sendData[slot] = data
								sendData[slot].entity = entity
								nuiData[slot] = {
									icon = data.icon,
									label = data.label
								}
							end
						end
						if nuiData[1] then
							TriggerEvent(CurrentResourceName..':client:enterPolyZone', sendData[slot])
							TriggerServerEvent(CurrentResourceName..':server:enterPolyZone', sendData[slot])
							success = true
							SendNUIMessage({response = "foundTarget", data = sendData[slot].targeticon})
							DrawOutlineEntity(entity, true)
							while targetActive and success do
								_, coords, distance, _, _ = RaycastCamera(hit, GetEntityCoords(playerPed))
								if not closestZone:isPointInside(coords) or distance > closestZone.targetoptions.distance then
									LeftTarget()
									DrawOutlineEntity(entity, false)
								elseif not hasFocus and (IsControlPressed(0, Config.MenuControlKey) or IsDisabledControlPressed(0, Config.MenuControlKey)) then
									EnableNUI(nuiData)
									DrawOutlineEntity(entity, false)
								end
								Wait(0)
							end
							LeftTarget()
							TriggerEvent(CurrentResourceName..':client:exitPolyZone', sendData[slot])
							TriggerServerEvent(CurrentResourceName..':server:exitPolyZone', sendData[slot])
							DrawOutlineEntity(entity, false)
						end
					else sleep += 20 end
				else
					LeftTarget()
					DrawOutlineEntity(entity, false)
				end
			else sleep += 20 end
			Wait(sleep)
		end
		DisableTarget(false)
	end
end

local function AddCircleZone(name, center, radius, options, targetoptions)
	center = type(center) == 'table' and vector3(center.x, center.y, center.z) or center
	Zones[name] = CircleZone:Create(center, radius, options)
	targetoptions.distance = targetoptions.distance or Config.MaxDistance
	Zones[name].targetoptions = targetoptions
end

exports("AddCircleZone", AddCircleZone)

local function AddBoxZone(name, center, length, width, options, targetoptions)
	center = type(center) == 'table' and vector3(center.x, center.y, center.z) or center
	Zones[name] = BoxZone:Create(center, length, width, options)
	targetoptions.distance = targetoptions.distance or Config.MaxDistance
	Zones[name].targetoptions = targetoptions
end

exports("AddBoxZone", AddBoxZone)

local function AddPolyZone(name, points, options, targetoptions)
	local _points = {}
	if type(points[1]) == 'table' then
		for i = 1, #points do
			_points[i] = vector2(points[i].x, points[i].y)
		end
	end
	Zones[name] = PolyZone:Create(#_points > 0 and _points or points, options)
	targetoptions.distance = targetoptions.distance or Config.MaxDistance
	Zones[name].targetoptions = targetoptions
end

exports("AddPolyZone", AddPolyZone)

local function AddComboZone(zones, options, targetoptions)
	Zones[name] = ComboZone:Create(zones, options)
	targetoptions.distance = targetoptions.distance or Config.MaxDistance
	Zones[name].targetoptions = targetoptions
end

exports("AddComboZone", AddComboZone)

local function AddTargetBone(bones, parameters)
	local distance, options = parameters.distance or Config.MaxDistance, parameters.options
	if type(bones) == 'table' then
		for _, bone in pairs(bones) do
			if not Bones.Options[bone] then Bones.Options[bone] = {} end
			for k, v in pairs(options) do
				if not v.distance or v.distance > distance then v.distance = distance end
				Bones.Options[bone][v.label] = v
			end
		end
	elseif type(bones) == 'string' then
		if not Bones.Options[bones] then Bones.Options[bones] = {} end
		for k, v in pairs(options) do
			if not v.distance or v.distance > distance then v.distance = distance end
			Bones.Options[bones][v.label] = v
		end
	end
end

exports("AddTargetBone", AddTargetBone)

local function AddTargetEntity(entities, parameters)
	local distance, options = parameters.distance or Config.MaxDistance, parameters.options
	if type(entities) == 'table' then
		for _, entity in pairs(entities) do
			entity = NetworkGetEntityIsNetworked(entity) and NetworkGetNetworkIdFromEntity(entity) or false
			if entity then
				if not Entities[entity] then Entities[entity] = {} end
				for k, v in pairs(options) do
					if not v.distance or v.distance > distance then v.distance = distance end
					Entities[entity][v.label] = v
				end
			end
		end
	elseif type(entities) == 'number' then
		local entity = NetworkGetEntityIsNetworked(entities) and NetworkGetNetworkIdFromEntity(entities) or false
		if entity then
			if not Entities[entity] then Entities[entity] = {} end
			for k, v in pairs(options) do
				if not v.distance or v.distance > distance then v.distance = distance end
				Entities[entity][v.label] = v
			end
		end
	end
end

exports("AddTargetEntity", AddTargetEntity)

local function AddEntityZone(name, entity, options, targetoptions)
	Zones[name] = EntityZone:Create(entity, options)
	targetoptions.distance = targetoptions.distance or Config.MaxDistance
	Zones[name].targetoptions = targetoptions
end

exports("AddEntityZone", AddEntityZone)

local function AddTargetModel(models, parameters)
	local distance, options = parameters.distance or Config.MaxDistance, parameters.options
	if type(models) == 'table' then
		for _, model in pairs(models) do
			if type(model) == 'string' then model = GetHashKey(model) end
			if not Models[model] then Models[model] = {} end
			for k, v in pairs(options) do
				if not v.distance or v.distance > distance then v.distance = distance end
				Models[model][v.label] = v
			end
		end
	else
		if type(models) == 'string' then models = GetHashKey(models) end
		if not Models[models] then Models[models] = {} end
		for k, v in pairs(options) do
			if not v.distance or v.distance > distance then v.distance = distance end
			Models[models][v.label] = v
		end
	end
end

exports("AddTargetModel", AddTargetModel)

local function RemoveZone(name)
	if not Zones[name] then return end
	if Zones[name].destroy then
		Zones[name]:destroy()
	end
	Zones[name] = nil
end

exports("RemoveZone", RemoveZone)

local function RemoveTargetBone(bones, labels)
	if type(bones) == 'table' then
		for _, bone in pairs(bones) do
			if type(labels) == 'table' then
				for k, v in pairs(labels) do
					if Bones.Options[bone] then
						Bones.Options[bone][v] = nil
					end
				end
			elseif type(labels) == 'string' then
				if Bones.Options[bone] then
					Bones.Options[bone][labels] = nil
				end
			end
		end
	else
		if type(labels) == 'table' then
			for k, v in pairs(labels) do
				if Bones.Options[bones] then
					Bones.Options[bones][v] = nil
				end
			end
		elseif type(labels) == 'string' then
			if Bones.Options[bones] then
				Bones.Options[bones][labels] = nil
			end
		end
	end
end

exports("RemoveTargetBone", RemoveTargetBone)

local function RemoveTargetModel(models, labels)
	if type(models) == 'table' then
		for _, model in pairs(models) do
			if type(model) == 'string' then model = GetHashKey(model) end
			if type(labels) == 'table' then
				for k, v in pairs(labels) do
					if Models[model] then
						Models[model][v] = nil
					end
				end
			elseif type(labels) == 'string' then
				if Models[model] then
					Models[model][labels] = nil
				end
			end
		end
	else
		if type(models) == 'string' then models = GetHashKey(models) end
		if type(labels) == 'table' then
			for k, v in pairs(labels) do
				if Models[models] then
					Models[models][v] = nil
				end
			end
		elseif type(labels) == 'string' then
			if Models[models] then
				Models[models][labels] = nil
			end
		end
	end
end

exports("RemoveTargetModel", RemoveTargetModel)

local function RemoveTargetEntity(entities, labels)
	if type(entities) == 'table' then
		for _, entity in pairs(entities) do
			entity = NetworkGetEntityIsNetworked(entity) and NetworkGetNetworkIdFromEntity(entity) or false
			if entity then
				if type(labels) == 'table' then
					for k, v in pairs(labels) do
						if Entities[entity] then
							Entities[entity][v] = nil
						end
					end
				elseif type(labels) == 'string' then
					if Entities[entity] then
						Entities[entity][labels] = nil
					end
				end
			end
		end
	elseif type(entities) == 'string' then
		local entity = NetworkGetEntityIsNetworked(entities) and NetworkGetNetworkIdFromEntity(entities) or false
		if entity then
			if type(labels) == 'table' then
				for k, v in pairs(labels) do
					if Entities[entity] then
						Entities[entity][v] = nil
					end
				end
			elseif type(labels) == 'string' then
				if Entities[entity] then
					Entities[entity][labels] = nil
				end
			end
		end
	end
end

exports("RemoveTargetEntity", RemoveTargetEntity)

local function AddGlobalType(type, parameters)
	local distance, options = parameters.distance or Config.MaxDistance, parameters.options
	for k, v in pairs(options) do
		if not v.distance or v.distance > distance then v.distance = distance end
		Types[type][v.label] = v
	end
end

exports("AddGlobalType", AddGlobalType)

local function AddGlobalPed(parameters) AddGlobalType(1, parameters) end

exports("AddGlobalPed", AddGlobalPed)

local function AddGlobalVehicle(parameters) AddGlobalType(2, parameters) end

exports("AddGlobalVehicle", AddGlobalVehicle)

local function AddGlobalObject(parameters) AddGlobalType(3, parameters) end

exports("AddGlobalObject", AddGlobalObject)

local function AddGlobalPlayer(parameters)
	local distance, options = parameters.distance or Config.MaxDistance, parameters.options
	for k, v in pairs(options) do
		if not v.distance or v.distance > distance then v.distance = distance end
		Players[v.label] = v
	end
end

exports("AddGlobalPlayer", AddGlobalPlayer)

local function RemoveGlobalType(type, labels)
	if type(labels) == 'table' then
		for k, v in pairs(labels) do
			Types[type][v] = nil
		end
	elseif type(labels) == 'string' then
		Types[type][labels] = nil
	end
end

exports("RemoveGlobalType", RemoveGlobalType)

local function RemoveGlobalPlayer(labels)
	if type(labels) == 'table' then
		for k, v in pairs(labels) do
			Players[v] = nil
		end
	elseif type(labels) == 'string' then
		Players[labels] = nil
	end
end

exports("RemoveGlobalPlayer", RemoveGlobalPlayer)

function SpawnPeds()
	if not PedsReady then
		if next(Config.Peds) then
			for k, v in pairs(Config.Peds) do
				if not v.currentpednumber or v.currentpednumber == 0 then
					local spawnedped = 0
					RequestModel(v.model)
					while not HasModelLoaded(v.model) do
						Wait(0)
					end

					if type(v.model) == 'string' then v.model = GetHashKey(v.model) end

					if v.minusOne then
						spawnedped = CreatePed(0, v.model, v.coords.x, v.coords.y, v.coords.z - 1.0, v.coords.w, v.networked or false, false)
					else
						spawnedped = CreatePed(0, v.model, v.coords.x, v.coords.y, v.coords.z, v.coords.w, v.networked or false, false)
					end

					if v.freeze then
						FreezeEntityPosition(spawnedped, true)
					end

					if v.invincible then
						SetEntityInvincible(spawnedped, true)
					end

					if v.blockevents then
						SetBlockingOfNonTemporaryEvents(spawnedped, true)
					end

					if v.animDict and v.anim then
						RequestAnimDict(v.animDict)
						while not HasAnimDictLoaded(v.animDict) do
							Wait(0)
						end

						TaskPlayAnim(spawnedped, v.animDict, v.anim, 8.0, 0, -1, v.flag or 1, 0, 0, 0, 0)
					end

					if v.scenario then
						TaskStartScenarioInPlace(spawnedped, v.scenario, 0, true)
					end

					if v.target then
						AddTargetModel(v.model, {
							options = v.target.options,
							distance = v.target.distance
						})
					end

					Config.Peds[k].currentpednumber = spawnedped
				end
			end
			PedsReady = true
		end
	end
end

local function DeletePeds()
	if PedsReady then
		if next(Config.Peds) then
			for k, v in pairs(Config.Peds) do
				DeletePed(v.currentpednumber)
				Config.Peds[k].currentpednumber = 0
			end
			PedsReady = false
		end
	end
end

exports("DeletePeds", DeletePeds)

local function SpawnPed(data)
	local spawnedped = 0
	local key, value = next(data)
	if type(value) == 'table' and key ~= 'target' and key ~= 'coords' then
		for k, v in pairs(data) do
			if v.spawnNow then
				RequestModel(v.model)
				while not HasModelLoaded(v.model) do
					Wait(0)
				end

				if type(v.model) == 'string' then v.model = GetHashKey(v.model) end

				if v.minusOne then
					spawnedped = CreatePed(0, v.model, v.coords.x, v.coords.y, v.coords.z - 1.0, v.coords.w or 0.0, v.networked or false, true)
				else
					spawnedped = CreatePed(0, v.model, v.coords.x, v.coords.y, v.coords.z, v.coords.w or 0.0, v.networked or false, true)
				end

				if v.freeze then
					FreezeEntityPosition(spawnedped, true)
				end

				if v.invincible then
					SetEntityInvincible(spawnedped, true)
				end

				if v.blockevents then
					SetBlockingOfNonTemporaryEvents(spawnedped, true)
				end

				if v.animDict and v.anim then
					RequestAnimDict(v.animDict)
					while not HasAnimDictLoaded(v.animDict) do
						Wait(0)
					end

					TaskPlayAnim(spawnedped, v.animDict, v.anim, 8.0, 0, -1, v.flag or 1, 0, 0, 0, 0)
				end

				if v.scenario then
					TaskStartScenarioInPlace(spawnedped, v.scenario, 0, true)
				end

				if v.target then
					AddTargetModel(v.model, {
						options = v.target.options,
						distance = v.target.distance
					})
				end

				v.currentpednumber = spawnedped
			end

			local nextnumber = #Config.Peds + 1
			if nextnumber <= 0 then nextnumber = 1 end

			Config.Peds[nextnumber] = v
		end
	else
		if type(value) == 'table' and key ~= 'target' and key ~= 'coords' then
			if Config.Debug then print('Wrong table format for SpawnPed export') end
			return
		end

		if data.spawnNow then
			RequestModel(data.model)
			while not HasModelLoaded(data.model) do
				Wait(0)
			end

			if type(data.model) == 'string' then data.model = GetHashKey(data.model) end

			if data.minusOne then
				spawnedped = CreatePed(0, data.model, data.coords.x, data.coords.y, data.coords.z - 1.0, data.coords.w, data.networked or false, true)
			else
				spawnedped = CreatePed(0, data.model, data.coords.x, data.coords.y, data.coords.z, data.coords.w, data.networked or false, true)
			end

			if data.freeze then
				FreezeEntityPosition(spawnedped, true)
			end

			if data.invincible then
				SetEntityInvincible(spawnedped, true)
			end

			if data.blockevents then
				SetBlockingOfNonTemporaryEvents(spawnedped, true)
			end

			if data.animDict and data.anim then
				RequestAnimDict(data.animDict)
				while not HasAnimDictLoaded(data.animDict) do
					Wait(0)
				end

				TaskPlayAnim(spawnedped, data.animDict, data.anim, 8.0, 0, -1, data.flag or 1, 0, 0, 0, 0)
			end

			if data.scenario then
				TaskStartScenarioInPlace(spawnedped, data.scenario, 0, true)
			end

			if data.target then
				AddTargetModel(data.model, {
					options = data.target.options,
					distance = data.target.distance
				})
			end

			data.currentpednumber = spawnedped
		end

		local nextnumber = #Config.Peds + 1
		if nextnumber <= 0 then nextnumber = 1 end

		Config.Peds[nextnumber] = data
	end
end

exports("SpawnPed", SpawnPed)

-- Misc. Exports

exports("RemoveGlobalPed", function(labels) RemoveGlobalType(1, labels) end)

exports("RemoveGlobalVehicle", function(labels) RemoveGlobalType(2, labels) end)

exports("RemoveGlobalObject", function(labels) RemoveGlobalType(3, labels) end)

exports("IsTargetActive", function() return targetActive end)

exports("IsTargetSuccess", function() return success end)

exports("GetGlobalTypeData", function(type, label) return Types[type][label] end)

exports("GetZoneData", function(name) return Zones[name] end)

exports("GetTargetBoneData", function(bone) return Bones.Options[bone][label] end)

exports("GetTargetEntityData", function(entity, label) return Entities[entity][label] end)

exports("GetTargetModelData", function(model, label) return Models[model][label] end)

exports("GetGlobalPedData", function(label) return Types[1][label] end)

exports("GetGlobalVehicleData", function(label) return Types[2][label] end)

exports("GetGlobalObjectData", function(label) return Types[3][label] end)

exports("GetGlobalPlayerData", function(label) return Players[label] end)

exports("UpdateGlobalTypeData", function(type, label, data) Types[type][label] = data end)

exports("UpdateZoneData", function(name, data) Zones[name] = data end)

exports("UpdateTargetBoneData", function(bone, label, data) Bones.Options[bone][label] = data end)

exports("UpdateTargetEntityData", function(entity, label, data) Entities[entity][label] = data end)

exports("UpdateTargetModelData", function(model, label, data) Models[model][label] = data end)

exports("UpdateGlobalPedData", function(label, data) Types[1][label] = data end)

exports("UpdateGlobalVehicleData", function(label, data) Types[2][label] = data end)

exports("UpdateGlobalObjectData", function(label, data) Types[3][label] = data end)

exports("UpdateGlobalPlayerData", function(label, data) Players[label] = data end)

exports("GetPeds", function() return Config.Peds end)

exports("UpdatePedsData", function(index, data) Config.Peds[index] = data end)

exports("AllowTargeting", function(bool) AllowTarget = bool end)

-- NUI Callbacks

RegisterNUICallback('selectTarget', function(option, cb)
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
	Wait(100)
	targetActive, success, hasFocus = false, false, false
	if sendData then
		local data = sendData[option]
		table_wipe(sendData)
		CreateThread(function()
			Wait(0)
			if data.action then
				data.action(data.entity)
			elseif data.event then
				if data.type == "client" then
					TriggerEvent(data.event, data)
				elseif data.type == "server" then
					TriggerServerEvent(data.event, data)
				elseif data.type == "command" then
					ExecuteCommand(data.event)
				elseif data.type == "qbcommand" then
					TriggerServerEvent('QBCore:CallCommand', data.event, data)
				else
					TriggerEvent(data.event, data)
				end
			else
				print("No trigger setup")
			end
		end)
	end
	cb('ok')
end)

RegisterNUICallback('closeTarget', function(data, cb)
	SetNuiFocus(false, false)
	SetNuiFocusKeepInput(false)
	Wait(100)
	targetActive, success, hasFocus = false, false, false
	cb('ok')
end)

-- Startup thread

CreateThread(function()
    RegisterCommand('+playerTarget', EnableTarget, false)
    RegisterCommand('-playerTarget', DisableTarget, false)
    RegisterKeyMapping("+playerTarget", "Enable targeting", "keyboard", Config.OpenKey)

    if next(Config.CircleZones) then
        for k, v in pairs(Config.CircleZones) do
            AddCircleZone(v.name, v.coords, v.radius, {
                name = v.name,
                debugPoly = v.debugPoly,
            }, {
                options = v.options,
                distance = v.distance
            })
        end
    end

    if next(Config.BoxZones) then
        for k, v in pairs(Config.BoxZones) do
            AddBoxZone(v.name, v.coords, v.length, v.width, {
                name = v.name,
                heading = v.heading,
                debugPoly = v.debugPoly,
                minZ = v.minZ,
                maxZ = v.maxZ
            }, {
                options = v.options,
                distance = v.distance
            })
        end
    end

    if next(Config.PolyZones) then
        for k, v in pairs(Config.PolyZones) do
            AddPolyZone(v.name, v.points, {
                name = v.name,
                debugPoly = v.debugPoly,
                minZ = v.minZ,
                maxZ = v.maxZ
            }, {
                options = v.options,
                distance = v.distance
            })
        end
    end

    if next(Config.TargetBones) then
        for k, v in pairs(Config.TargetBones) do
            AddTargetBone(v.bones, {
                options = v.options,
                distance = v.distance
            })
        end
    end

    if next(Config.TargetEntities) then
        for k, v in pairs(Config.TargetEntities) do
            AddTargetEntity(v.entity, {
                options = v.options,
                distance = v.distance
            })
        end
    end

    if next(Config.TargetModels) then
        for k, v in pairs(Config.TargetModels) do
            AddTargetModel(v.models, {
                options = v.options,
                distance = v.distance
            })
        end
    end

    if next(Config.GlobalPedOptions) then
        AddGlobalPed(Config.GlobalPedOptions)
    end

    if next(Config.GlobalVehicleOptions) then
        AddGlobalVehicle(Config.GlobalVehicleOptions)
    end

    if next(Config.GlobalObjectOptions) then
        AddGlobalObject(Config.GlobalObjectOptions)
    end

    if next(Config.GlobalPlayerOptions) then
        AddGlobalPlayer(Config.GlobalPlayerOptions)
    end
end)

-- Events

-- This is to make sure the peds spawn on restart too instead of only when you load/log-in.
AddEventHandler('onResourceStart', function(resource)
	if resource == CurrentResourceName then
		SpawnPeds()
	end
end)

-- This will delete the peds when the resource stops to make sure you don't have random peds walking
AddEventHandler('onResourceStop', function(resource)
	if resource == CurrentResourceName then
		DeletePeds()
	end
end)

-- Debug Option

if Config.Debug then Load('debug') end