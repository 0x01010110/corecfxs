const { Conflux, Drip } = require('js-conflux-sdk');
const CONFIG = require('./config.json');
const { Contract, JsonRpcProvider } = require('ethers');
const { cfxs } = require('./config.json');
const { abi } = require('./cfxs.json');

// core space sdk init
const conflux = new Conflux({
    url: CONFIG.url,
    networkId: CONFIG.networkId,
});

const CrossSpaceCall = conflux.InternalContract('CrossSpaceCall');

const privateKey = CONFIG.privateKey;
const account = conflux.wallet.addPrivateKey(privateKey);

// eSpace SDK init
const provider = new JsonRpcProvider(CONFIG.eSpaceUrl);
const cfxsContract = new Contract(cfxs, abi);

async function transferCFXs(cfxsId, receiver) {
    if (!cfxsId || !receiver) {
        throw new Error('Invalid Inputs');
    }

    let transaction = {
        inputs: [cfxsId],
        outputs: [{
            owner: receiver,
            amount: 1,
            data: ''
        }]
    }

    const data = cfxsContract.interface.encodeFunctionData('processTransaction', [transaction]);
    
    const receipt = await CrossSpaceCall.callEVM(cfxs, data).sendTransaction({
        from: account.address,
    }).executed();

    return receipt;
}

module.exports = {
    conflux,
    account,
    CrossSpaceCall,
    Drip,
    transferCFXs
}