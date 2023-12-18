const { Conflux, Drip } = require('js-conflux-sdk');
const CONFIG = require('./config.json');
const { waitMilliseconds } = require('./utils');

const conflux = new Conflux({
    url: CONFIG.url,
    networkId: CONFIG.networkId,
});

const CrossSpaceCall = conflux.InternalContract('CrossSpaceCall');

const privateKey = CONFIG.privateKey;
const account = conflux.wallet.addPrivateKey(privateKey);

const gasPrice = CONFIG.gasPrice || 100;

async function main() {
    
    while(true) {
        try {
            await oneRound();
            console.log('One round finished');
        } catch(err) {
            console.error(err);
        }
        await waitMilliseconds(10 * 1000);
    }

}

async function oneRound() {
    let hash;
    let batch = 5;
    let nonce = await conflux.getNextNonce(account.address);
    // let nonce = await conflux.txpool.nextNonce(account.address);
    for(let i = 0; i < batch; i++) {
        try {
            hash = await CrossSpaceCall.transferEVM(CONFIG.cfxs).sendTransaction({
                from: account.address,
                nonce: nonce + BigInt(i),
                gasPrice: Drip.fromGDrip(gasPrice),  // call also specify the gasPrice
            });
            console.log(`Sending ${i}`, hash);
        } catch(err) {
            console.error(err);
            break;
        }
        // await waitMilliseconds(100);
    }

    for(let i = 0; i < 30; i++) {
        try {
            if (!hash) break;
            let receipt = await conflux.getTransactionReceipt(hash);
            if (receipt){
                break;
            }
            await waitMilliseconds(1000);
        } catch(err) {
            console.error(err);
        }
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});