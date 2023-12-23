const { Conflux, Drip, address } = require('js-conflux-sdk');
const { Contract, JsonRpcProvider, Wallet } = require('ethers');
const { abi } = require('./artifacts/cfxs.json');
const CONFIG = require('./config.json');
const exchangeContractMeta = require('./artifacts/CFXsTest2Main.json');
const cfxsMainMeta = require('./artifacts/CFXsMain.json');

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

const cfxsExchangeContract = new Contract(CONFIG.exchangeContract, exchangeContractMeta.abi, provider);

const cfxsMainContract = new Contract(CONFIG.newCfxs, cfxsMainMeta.abi, provider);

const wallet = new Wallet(CONFIG.eSpacePrivateKey || '0x', provider);

async function transferCFXs(cfxsIds, receiver) {
    if (!cfxsId || !receiver) {
        throw new Error('Invalid Inputs');
    }

    const data = cfxsMainContract.interface.encodeFunctionData('transfer(uint[],address)', [cfxsIds, receiver]);
    console.log(data);
    return null;
    
    const receipt = await CrossSpaceCall.callEVM(CONFIG.newCfxs, data).sendTransaction({
        from: account.address,
    }).executed();

    return receipt;
}

async function exchangeCFXs(cfxsIds = []) {
    if (!cfxsIds || cfxsIds.length === 0) return null;

    const data = cfxsExchangeContract.interface.encodeFunctionData('ExTestToMain', [cfxsIds]);
    
    const receipt = await CrossSpaceCall.callEVM(CONFIG.exchangeContract, data).sendTransaction({
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
    cfxsContract,
    exchangeCFXs,
    cfxsExchangeContract,
    cfxsMainContract,
    provider,
    wallet,
}