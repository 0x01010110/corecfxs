const { Conflux, Drip } = require('js-conflux-sdk');

const conflux = new Conflux({
    url: 'https://main.confluxrpc.com',
    networkId: 1029,
});
const CrossSpaceCall = conflux.InternalContract('CrossSpaceCall');

const privateKey = require('./config.json').privateKey;
const account = conflux.wallet.addPrivateKey(privateKey);

const gasPrice = require('./config.json').gasPrice || 100;

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

async function waitMilliseconds(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function oneRound() {
    let hash;
    let batch = 5;
    let nonce = await conflux.getNextNonce(account.address);
    // let nonce = await conflux.txpool.nextNonce(account.address);
    for(let i = 0; i < batch; i++) {
        try {
            hash = await CrossSpaceCall.transferEVM('0xc6e865c213c89ca42a622c5572d19f00d84d7a16').sendTransaction({
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