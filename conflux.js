const { Conflux, Drip, address } = require('js-conflux-sdk');
const { Contract, JsonRpcProvider } = require('ethers');
const { abi } = require('./artifacts/cfxs.json');
const CONFIG = require('./config.json');

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
const cfxsContract = new Contract(CONFIG.cfxs, abi, provider);

async function transferCFXs(cfxsId, receiver) {
    if (!cfxsId || !receiver) {
        throw new Error('Invalid Inputs');
    }
    let info = await cfxsContract.CFXss(cfxsId);
    
    if(!info || info.length === 0) {
        throw new Error('Invalid CFXs id');
    }

    if (info[1] != address.cfxMappedEVMSpaceAddress(account.address)) {
        throw new Error('Only the owner of CFXs can transfer it');
    }

    let transaction = {
        inputs: [cfxsId],
        outputs: [{
            owner: receiver,
            amount: info[2],
            data: ''
        }]
    }

    const data = cfxsContract.interface.encodeFunctionData('processTransaction', [transaction]);
    
    const receipt = await CrossSpaceCall.callEVM(CONFIG.cfxs, data).sendTransaction({
        from: account.address,
    }).executed();

    return receipt;
}

module.exports = {
    conflux,
    account,
    CrossSpaceCall,
    Drip,
    transferCFXs,
    cfxsContract
}