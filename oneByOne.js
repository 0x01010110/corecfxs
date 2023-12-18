const { conflux, account, Drip, CrossSpaceCall } = require('./conflux');
const { waitMilliseconds } = require('./utils');
const CONFIG = require('./config.json');

async function main() {
    while(true) {
        await sendOne();
        await waitMilliseconds(1 * 1000);
    }
}

main().catch(console.error);

async function sendOne(gasPrice = 300) {
    if (gasPrice > 1000) return;
    let nonce = await conflux.getNextNonce(account.address);
    console.log(`Sending ${nonce} ${gasPrice}`);

    let hash = await CrossSpaceCall.transferEVM(CONFIG.cfxs).sendTransaction({
        from: account.address,
        nonce: nonce,
        gasPrice: Drip.fromGDrip(gasPrice),  // call also specify the gasPrice
    });

    for(let i = 0; i < 30; i++) {
        let receipt = await conflux.getTransactionReceipt(hash);
        if (receipt){
            return receipt;
        }
        await waitMilliseconds(1000);
    }

    sendOne(gasPrice + 100);
}