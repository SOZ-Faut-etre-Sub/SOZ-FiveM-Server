![SOZFond5](https://user-images.githubusercontent.com/104008465/206195637-86e4b31b-146c-44b5-b0e9-05b245faeb61.png)

<p align="center">
Developed especially for the Zerator community.
</p>

![SOZ - Join the server_](https://user-images.githubusercontent.com/104008465/206221735-bd60fab7-3d0a-4844-b07f-245ee932adbc.png)
[ZeratoR](https://www.twitch.tv/zerator) is a French Twitch Streamer who created the ZEvent, MANDATORY and many other projects. Following one of them called RPZ, gathering all the French content creators for a temporary two weeks server, we had the idea to offer a server to his community. **Everyone on SOZ is a volunteer, however the project is fully funded by ZeratoR that includes the server and the various licenses.**

The server is in development since February 2022, and can be joined by being accepted on the [AllowList](https://soz.zerator.com/) ! 

You can also visit the [Official Discord](https://discord.gg/soz-pas-soz), if you want to follow the development, the RoadMap and the manyannouncements to come !.

*P.S. : Of course like any community server, in order to register, you have to be subscribed to Zerator's twitch channel.*

![SOZ - Main Obj_](https://user-images.githubusercontent.com/104008465/206219720-ee131373-9da1-4ae6-90cd-9972f97a54f8.png)
The main goal of SOZ development is to **revamp the various primary mechanics used by players.** This desire to improve the landscape has pushed us to review **the ergonomics of several interactions with a point of honor**, even going so far as to review the primary interactions such as the exchange between players, the use of chests, parking lots, and many other features to improve further more the experience lived by the players.

In order to make this dream come true, we had to push ourselves to **develop everything we could from scratch**, while making less use of what already exists for free, developed by dedicated developers with the goal of helping the community. **Allowing us to ignore all paid resources.**

The other goal of SOZ is to **offer a "Click & Host Server"**, In all honesty, this is a very challenging  and our V1 will not allow this at the time. **However, we work to improve this point until we can finally offer this to you and your community.**

Also, we count on the participation of the community. **We may not be the best, but together we can be.** Providing good quality development that can improve all of our servers, this sure is the primary goal of any developer with a community. **By creating SOZ, we want to allow any developer to add what we have created to your respective servers.** And of course during that time, this will help SOZ to grow in order to contribute to the war effort!

⚠️**The server is under development. This means that there are some bugs and that it is far from perfect. It is in constant evolution and many things are subject to change.**

![SOZ - Key Features_](https://user-images.githubusercontent.com/104008465/206219700-a8de93a5-8d79-4b03-aba8-fec8d237bcc4.png)
**Exhaustive list of what SOZ offers:**
> A unique SOZCore developed with TypeScript.

> We use QB Base to a lesser extent, which allowed us to launch the server. We are working on removing/replacing it in favour of SOZ Core.

> Fourteen different companies, with their own gameplay mechanics. Each of them having a dependence on another one in order to create open circuits of RôlePlay. (Example: Gas stations are emptied to force to be used, as well as banks and ATM. Asking Players to fill these. )

> A system of pollution and deforestation. If the company in charge of these features doesn't charge the electric stations, the city may have a general blackout. If it produces too much, San andreas become polluted and all the consequences it brings for the citizens.

> BTarget improvement, allowing to add any interaction.

> Use of safes simultaneously, all separate. 

> A custom VOIP Mumble, nammed [Zumble](https://github.com/SOZ-Faut-etre-Sub/ZUMBLE). Being important, it has its own repository.

> Multiple vehicle exits for parking, garages and companies.

> Drag-and-drop inventory to improve usability. Accompanied by over two hundred objects with their own icons created by the SOZ community.

> A modern handmade phone, in partnership with FailyV.

> Free mappings created by our team, as well as map modifications added.

> A hundred of apartments, all ready to move in.

> And a ton of other features that we were able to develop in seven months, that we will make you discover!

*Note : Some mapping are actually deleted from the OpenSource because they're not as our propriety. They will be replaced ASAP. So you need to relocalise some safes and interactions, like the LSPD office.*

![SOZ - Major crédit_](https://user-images.githubusercontent.com/104008465/206219769-003fa5c9-bf78-4458-9543-fd9b415bfb9d.png)
**We would like to thank all the creators who are offering some of their creations to the community for free. Whether it is on [5Mod](https://fr.gta5-mods.com/) or on the [FiveM](https://forum.cfx.re/c/development/releases/7/l/latest) website.** It is also due to you that all the servers can exist! Thanks to you, you inspired us to make SOZ completely free.

Some of these free components are used on SOZ, such as clothes and female haircuts. Even though this represents only 10% of the development, it is important to note that no, the server is not yet fully independent and homegrown. We strive to replace anything we use that does not come from our own hands as soon as possible, and we thank all those creators from the bottom of our hearts.

All contributors to the project will be notified in a list.

![SOZ - Using the server_](https://user-images.githubusercontent.com/104008465/206203151-701a8669-b4dc-479c-978a-8498b8c6129d.png)

### Requirements
 * NodeJS: to compile the code and migrate the database
 * MySQL/MariaDB: to store the data
 * Loki: to store the logs (Optional)
 * Prometheus: to store the metrics (Optional)

### Prepare and configure the server
 * Clone the repository: `git clone https://github.com/SOZ-Faut-etre-Sub/SOZ-FiveM-Server.git`
 * Copy the `env.cfg-dist` file to `env.cfg` and fill / replace any necessary values (like your database credentials)
 * Copy the `resources/[soz]/soz-core/.env-dist` file to `resources/[soz]/soz-core/.env` and fill / replace any necessary values (like your database credentials)
 * Compile the resources core and phone:
   ```
   cd resources/[soz]/soz-core && yarn install && yarn build
   cd resources/[soz]/soz-phone && yarn install && yarn build
   ```
 * Migrate the database:
   ```
   cd resources/[soz]/soz-core && yarn run prisma migrate deploy
   ```
 * If you want to run in "production" mode copy the `modules-prod.cfg` file to `modules.cfg`
 * If you want to run in "test" mode copy the `modules-prod.cfg` file to `modules.cfg`

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

### Data
This repository does not propose, yet, any base data (like vehicles, weapons, fuel stations, dealership, etc ....), you must use the inject your own data into
the database at the moment.

We want to provide a tool / base data set to do that, you can contribute to help us to do that.

![SOZ - Issues   Pull requests_](https://user-images.githubusercontent.com/104008465/206208630-bf79fd74-d6e8-4b67-821d-dd3080306b8e.png)
Contribution are welcomed, but you must follow the rules below:

* You must follow the [code of conduct](CODE_OF_CONDUCT.md)
* If you are a user having issues with a server that is running this code, please contact the server owner, do not report an issue here.
* Issues must only be used by developers or administrators of servers that want to report a bug with the code source, or propose a feature.
* You must provide a minimum of information, this place is not a support forum, it's an exchange place for developers.
* If you want to contribute, read the [INTERNAL.md](INTERNAL.md) file before, as it allows you to understand how the code works and current vision of the project.

**Any issue or pull request that does not respect these rules will be closed without any warning.**

This repository is an extract of our internal repository, pull requests will be merged in our internal repository and then pushed to this repository automatically.
This means that you will not see your pull request merged here, and we will close them once they are merged in our internal repository.

Don't worry you will still be credited as a contributor, and your name will appear in this repository, but you will not see your pull request merged here.
