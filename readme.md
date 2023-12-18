# corecfxs

[中文说明](./readmezh.md)

This script can engrave inscriptions across spaces.

## Usage

1. Install the node.js environment.
2. Use git to download this project: `git clone https://github.com/0x01010110/corecfxs.git`
3. Run `npm install`.
4. Add config file `cp config.json.sample config.json`. Modify the `privateKey` in the `config.json` file and fill in your private key. Make sure your account has enough CFX to cover transaction fees.
5. Start the script with `node index.js`.

### Notes

1. Currently, a fixed gasPrice of 100 GDrip is used, and it can be configured in the configuration file.

## Obtain Mapping Address

```shell
node getMapAddress.js
```
