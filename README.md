![SOZ BANNER v2](https://user-images.githubusercontent.com/104008465/164230939-d34fdc98-92e1-4d18-8cb4-2ec6f2ea6468.png)

SOZ Fivem Server is a **GTA Roleplay** server that is based on the [**FiveM** modification framework](https://fivem.net/).
The server is developed and used by the community of [Zerator](https://twitch.tv/zerator), it's free to use and open source.

See the [LICENSING](LICENSING.md) file for more information about your right and usage of this software.

## Joining the server

This repository is not about the soz server, but about the code that is running it, [click here if you want to know more about the server](https://soz.zerator.com).

## Using the server

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

## Issues and pull requests

Contribution is welcome, but you must follow the rules below:

* You must follow the [code of conduct](CODE_OF_CONDUCT.md)
* If you are a user having problems with a server that is running this code, please contact the server owner, do not report an issue here.
* Issues must only be used by developers or administrators of servers that want to report a bug with the code source, or propose a feature.
* You must provide a minimum of information, this place is not a support forum, it's a discussion place for developers.
* If you want to contribute, read the [INTERNAL.md](INTERNAL.md) file before contributing, as it allow to understand how the code works and current vision of the project.

**Any issue or pull request that does not respect these rules will be closed without any warning.**

This repository is an extract of our internal repository, pull requests will be merged in our internal repository and then pushed to this repository automatically.
This means that you will not see your pull request merged here, and we will close them once they are merged in our internal repository.

Don't worry you will still be credited as a contributor, and your name will appear in this repository, but you will not see your pull request merged here.
