const { Contract, JsonRpcProvider, Wallet } = require('ethers');
const exchangeContractMeta = require('../artifacts/CFXsTest2Main.json');
const cfxsMainMeta = require('../artifacts/CFXsMain.json');
const { abi } = require('../artifacts/cfxs.json');
const CONFIG = require('../config.json');

// eSpace SDK init
const provider = new JsonRpcProvider(CONFIG.eSpaceUrl);
const cfxsContract = new Contract(CONFIG.cfxs, abi, provider);

const cfxsExchangeContract = new Contract(CONFIG.exchangeContract, exchangeContractMeta.abi, provider);

const cfxsMainContract = new Contract(CONFIG.newCfxs, cfxsMainMeta.abi, provider);

function getWallet() {
    const wallet = new Wallet(CONFIG.eSpacePrivateKey, provider);
    return wallet;
}

module.exports = {
    cfxsContract,
    cfxsExchangeContract,
    cfxsMainContract,
    provider,
    getWallet,
}