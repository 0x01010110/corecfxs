const { address } = require('js-conflux-sdk');

const { account } = require('./conflux');

console.log(`Map address of ${account.address} is ${address.cfxMappedEVMSpaceAddress(account.address)}`);