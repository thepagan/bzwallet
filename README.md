BZWallet Fullnode is a z-Addr first, Sapling compatible wallet and full node for bzedged that runs on Linux, Windows and macOS.

![Screenshot](resources/screenshot1.png?raw=true)
![Screenshots](resources/screenshot2.png?raw=true)

# Installation

**Note**: BZWallet Fullnode will download the **entire blockchain (about 26GB)**, and requires some familiarity with the command line. If you don't want to download the blockchain but prefer a Lite wallet, please check out [BZWallet Lite](https://getbze.com).

Head over to the releases page and grab the latest installers or binary. https://getbze.com

### Linux

If you are on Debian/Ubuntu, please download the '.AppImage' package and just run it.

```
./BZwallet.Fullnode-1.4.2.AppImage
```

If you prefer to install a `.deb` package, that is also available.

```
sudo apt install -f ./BZwallet_1.4.2_amd64.deb
```

### Windows

Download and run the `.msi` installer and follow the prompts. Alternately, you can download the release binary, unzip it and double click on `bzwallet.exe` to start.

### macOS

Double-click on the `.dmg` file to open it, and drag `BZwallet Fullnode` on to the Applications link to install.

## bzedged

BZWallet needs a BZEdge node running bzedged. If you already have a zcashd node running, BZWallet will connect to it.

If you don't have one, BZWallet will start its embedded bzedged node.

Additionally, if this is the first time you're running BZWallet or a bzedge daemon, BZWallet will download the zcash params (~777 MB) and configure `bzedge.conf` for you.

## Compiling from source

BZWallet is written in Electron/Javascript and can be build from source. Note that if you are compiling from source, you won't get the embedded bzedged by default. You can either run an external bzedged, or compile bzedged as well.

#### Pre-Requisits

You need to have the following software installed before you can build BZWallet Fullnode

- Nodejs v12.16.1 or higher - https://nodejs.org
- Yarn - https://yarnpkg.com

```
git clone https://github.com/bze-alphateam/bzwallet.git
cd bzwallet

yarn install
yarn build
```

To start in development mode, run

```
yarn dev
```

To start in production mode, run

```
yarn start
```

### [Troubleshooting](https://discord.gg/7KuDSSESVC)

Join our [Discord](https://discord.gg/7KuDSSESVC)
