const { Conflux, address } = require('js-conflux-sdk');

const conflux = new Conflux({
    url: 'https://main.confluxrpc.com',
    networkId: 1029,
});

const privateKey = require('./config.json').privateKey;
const account = conflux.wallet.addPrivateKey(privateKey);

console.log(`Map address of ${account.address} is ${address.cfxMappedEVMSpaceAddress(account.address)}`);