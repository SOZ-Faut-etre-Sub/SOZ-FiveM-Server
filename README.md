![SOZFond5](https://user-images.githubusercontent.com/104008465/206195637-86e4b31b-146c-44b5-b0e9-05b245faeb61.png)

<p align="center">
Developed especially for the Zerator community.
</p>

![SOZ - Join the server_](https://user-images.githubusercontent.com/104008465/206221735-bd60fab7-3d0a-4844-b07f-245ee932adbc.png)
[ZeratoR](https://www.twitch.tv/zerator) is a French Twitch Streamer who created the ZEvent, MANDATORY and many other projects. Following one of them called RPZ, bringing together numerous French content creators for a temporary two-week server, following this experience we had the idea to offer a server to his community. **Everyone on SOZ is a volunteer, however the project is fully funded by ZeratoR that includes the server and the various licenses.**

The server is in development since February 2022, and can be joined by being accepted on the [AllowList](https://soz.zerator.com/) !

You can also visit the [Official Discord](https://discord.gg/soz-pas-soz), if you want to follow the development, the RoadMap and the many announcements to come !

*P.S. : Of course like any community server, in order to register, you have to be subscribed to Zerator's Twitch channel.*

![SOZ - Main Obj_](https://user-images.githubusercontent.com/104008465/206219720-ee131373-9da1-4ae6-90cd-9972f97a54f8.png)
The main goal of SOZ development is to **revamp various primary mechanics used by players.** This desire to improve the landscape has pushed us to review **the ergonomics of several interactions with a focus on accessibility**, even going so far as to review the primary interactions such as the exchange between players, the use of chests, parking lots, and many other features to improve further more the experience lived by the players.

In order to make this dream come true, we had to push ourselves to **develop everything we could from scratch**, while making less use of what already exists for free, developed by dedicated developers with the goal of helping the community. **Allowing us to ignore all paid resources.**

The other goal of SOZ is to **offer a "Click & Host Server"**. And even if this goal is difficult to achieve, we're doing everything we can to make life easier for every user of our OSS.

Also, we count on the participation of everyone. **We may not be the best, but together we can.** Providing good quality development that can improve all of our servers, this sure is the primary goal of any developer with a community. **By creating SOZ, we want to allow any developer to add what we have created to your respective servers.**

⚠️**The server is under development. This means that there are some bugs and that it is far from perfect. It is in constant evolution and many things are subject to change.**

![SOZ - Key Features_](https://user-images.githubusercontent.com/104008465/206219700-a8de93a5-8d79-4b03-aba8-fec8d237bcc4.png)
# Main Features
This new version of SOZ has been vastly improved over its predecessors, offering roleplay server creators even more tools than before, all free of charge.
## SOZCore & Architecture
- A unique SOZCore, developed in TypeScript, structured for smooth and professional development. (Some dependencies are still linked to QBCore, but they will be removed in the next update.)
- Based on robust open source library : prisma / react / etc ...
- Allow strong monitoring of game and technical events: know what happen in real time to your server
- Built with automation in mind : automatic sql migration, low down time on restart, api hooks for discord bot or management via external interfaces

## VOIP & Radio
- A custom VOIP system based on Mumble, called Zumble, which has its own repository due to its importance.
- It supports proximity voice chat, phone calls, speaker mode, and radio channels for group communication.

# Businesses & Economy
- 13 private businesses and 7 public businesses, each with unique gameplay mechanics. They are interconnected to create a dynamic economy and encourage roleplay interactions. *(Example: Gas stations, stores, banks, and clothing shops are all restocked by players.)*

# User Interface & Experience
- A fully custom-built smartphone, called ZPhone, designed with a new architecture and iOS-inspired ergonomics. It features speaker mode, extensive customization, and Dark Web access.
- A unique Glassmorphism UI, named UWUI, designed as a smartwatch-style interface. It displays weather, time, GPS, player status, and more, with accessibility options for visually impaired and colorblind players. *(Much love to Pavonnie and Lady_penguin)*
- A dynamic interaction system using a targeting mechanism, making it easier to interact with characters and objects.
- Law enforcement alerts dynamically appear on the side of the screen for optimal intervention tracking.

# Storage & Inventory
- An ergonomic drag-and-drop inventory, allowing multiple players to access storage simultaneously. Over 200 custom items with unique icons created by the SOZ community.
- Parking garages allow multiple vehicles to be spawned at once.
- Persistent vehicle trunks, providing mobile storage for players.

# Environment & Realism
- Pollution and deforestation system: If the energy company mismanages power plants, the city can suffer a blackout. Overproduction leads to pollution affecting citizens.
- Seasons & temperature management: Characters can lose health if they get too cold or hot.
- Natural disasters: Earthquakes, blizzards, floods, and meteor strikes.
- Vehicle bogging system: Tire grip varies depending on the terrain. Unsuitable off-road vehicles can sink into the ground and get stuck, requiring manual assistance to free them.
- Fully drivable and synchronized trains between players.

## Housing & Real Estate
- Customizable housing system, allowing players to replace default decorations with their own.
- Players can own multiple properties and rent out secondary homes.

## Activities & Gameplay
- Custom race creation, playable with cars, motorcycles, boats, or on foot. Players compete to set the fastest time.
- Sports & health system: Players can train to carry more items and run longer. Poor nutrition causes deficiencies, reducing max health.
- SOZ Hammer, an in-game mapping tool that eliminates the need for external editors. Players can create events and place objects in the world without admin intervention.

## Combat & Equipment
- Custom weapon recoil and durability system.
- Bulletproof vests contain reinforced plates, absorbing the next incoming shot.

## Dynamic Events & Mapping
- Various dynamic events, including zombie invasions, bloodthirsty vampire attacks, and more.
- Exclusive mappings, featuring : Approximately 490 accessible housing units featuring 8 distinct models, including 1 exclusive to SOZ ; Bluebird Waste Management Company ; Customized Cayo Perico ; Additional electric vehicle dealership ; O’Neil Ranch (FDF) ; FFS Clothing Manufacturing Company ; Expansion and modification of northern island forests ; HammerPlace replacing the former Cube Plaza ; Customized Bahama Unicorn ; Sandy Shores Sheriff’s Office ; DMC Mining & Foundry Company ; Custom advertising banners for IRL events such as Zevent and ZLAN at Pacific & Maze Bank Arena ; PAWL Sawmill ; UPW Power Company ; MTP Gas Company ; Two vehicle repair businesses located in the South and North (NG) ; Downtown Gym ; Offshore Oil Platform ; Stonks Security Cash Transport Company ; New vineyard version ; Vinewood sign transformed into Zerawood.
- Some available mappings are disabled : Construction sites, Halloween 2023 (crystal & giant eye), Halloween 2024 (castle & crucifix), Pumpkin hunt, July 4th event, Apartments disabled after a meteor impact, Giant NewGahray screen, , Easter egg hunt, Old vineyard, Cargo plane crash, Frozen lakes & ocean, LSMC V1, Christmas mapping, Old Zkea building disabled by a meteor strike, Empty lakes due to drought, and many more!

*Note : Some mapping are actually deleted from the OpenSource because they're not as our propriety. They will be replaced ASAP. So you need to relocalise some safes and interactions, like the LSPD office.*

## Vehicles
- Over 70 custom vehicles. *Some vehicles sourced from free mods*
- 32 police vehicles, including: Motorcycles, SUVs, Off-road units, Sports cars, Boats, Helicopters, Unmarked cars
- 1 customized train model

# Features Not Available in the OSS
While the OSS provides a rich set of tools and mechanics, several exclusive features remain unique to the SOZ platform, enhancing roleplay depth and gameplay interactions.

## Forensic Investigation System
- A dedicated forensic police system allowing players to analyze crime scenes by collecting:
  - Drug traces,
  - Spent bullet casings,
  - Fingerprints on vehicles.
- This system is complemented by an investigation board and photography tools, enabling characters to engage in detailed detective roleplay.

## Helicopter Spotlight Synchronization
- Full GTA synchronization for helicopter-mounted searchlights, allowing players to manually direct the beam during pursuits or major events.

## Fishing & Sozédex
- A seasonal fishing system, where players can:
  - Catch and sell various season-themed fish,
  - Complete their Sozédex, a unique collection log for different species.

## Organized Crime Progression
- Mid-Tier Criminal Activities, featuring a dedicated talent tree exclusive to the platform.
- High-Tier Criminal Operations, including:
  - Exclusive businesses,
  - Unique mini-games,
  - Advanced talent trees,
  - Multi-layered heists.
   - Dynamic Criminal Events

## Advanced Drug Economy
- Four distinct drug systems, each with unique mechanics for cultivation and distribution:
  - Street-level dealing,
  - High-speed drug runs (Go-Fast missions),
  - Large-scale shipments,
  - Custom farming and production methods.

![SOZ - Major credit_](https://user-images.githubusercontent.com/104008465/206219769-003fa5c9-bf78-4458-9543-fd9b415bfb9d.png)
**We would like to thank all the creators who are offering some of their creations to the community for free. Whether it is on [5Mod](https://fr.gta5-mods.com/) or on the [FiveM](https://forum.cfx.re/c/development/releases/7/l/latest) website.** It is also due to you that all servers can exist! Thanks to you, you inspired us to make SOZ completely free.

Some of these free components are used on SOZ, such as clothes and female haircuts. Even though this represents only 10% of the development, it is important to note that no, the server is not yet fully independent and homegrown. We strive to replace anything we use that does not come from our own hands as soon as possible, and we thank all those creators from the bottom of our hearts.

All contributors to the project will be notified on a list.

![SOZ - Using the server_](https://user-images.githubusercontent.com/104008465/206203151-701a8669-b4dc-479c-978a-8498b8c6129d.png)

### Requirements
 * NodeJS: to compile the code and migrate the database
 * MariaDB: to store the data
 * Clickhouse: to store the logs and events
 * Prometheus: to store the metrics (Optional)

### Prepare and configure the server
 * Clone the repository: `git clone https://github.com/SOZ-Faut-etre-Sub/SOZ-FiveM-Server.git`
 * Copy the `env.cfg-dist` file to `env.cfg` and fill / replace any necessary values (like your database credentials)
 * Copy the `resources/[soz]/soz-core/.env-dist` file to `resources/[soz]/soz-core/.env` and fill / replace any necessary values (like your database credentials)
 * Compile the resources core:
   ```
   cd resources/[soz]/soz-core && yarn install && yarn build
   ```
 * Migrate the database:
   ```
   cd resources/[soz]/soz-core && yarn run prisma migrate deploy
   ```
 * Inject base data into the database:
   ```
   cd resources/[soz]/soz-core && yarn run prisma db seed
   ```
 * If you want to run in "production" mode copy the `modules-prod.cfg` file to `modules.cfg`
 * If you want to run in "test" mode copy the `modules-test.cfg` file to `modules.cfg`

### Running the server
Once everything is configured, [you can run the server by using the FXServer executable](https://docs.fivem.net/docs/server-manual/setting-up-a-server-vanilla/)

On Windows:
```
C:\FXServer\server\FXServer.exe +exec server.cfg
```

On Linux:
```
bash ~/FXServer/server/run.sh +exec server.cfg
```

![SOZ - Issues   Pull requests_](https://user-images.githubusercontent.com/104008465/206208630-bf79fd74-d6e8-4b67-821d-dd3080306b8e.png)
Contribution are welcomed, but you must follow the rules below:

* __You must complete one of the available templates.__
* You must follow the [code of conduct](CODE_OF_CONDUCT.md)
* If you are a user having issues with a server that is running this code, please contact the server owner, do not report an issue here.
* Issues must only be used by developers or administrators of servers that want to report a bug with the code source, or propose a feature.
* You must provide a minimum of information, this place is not a support forum, it's an exchange place for developers.
* If you want to contribute, read the [INTERNAL.md](INTERNAL.md) file before, as it allows you to understand how the code works and current vision of the project.

**Any issue or pull request that does not respect these rules will be closed without any warning.**

This repository is an extract of our internal repository, pull requests will be merged in our internal repository and then pushed to this repository automatically.
This means that you will not see your pull request merged here, and we will close them once they are merged in our internal repository.

Don't worry you will still be credited as a contributor, and your name will appear in this repository, but you will not see your pull request merged here.
