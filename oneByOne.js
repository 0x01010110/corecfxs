const { conflux, account, Drip, CrossSpaceCall } = require('./conflux');
const { waitMilliseconds } = require('./utils');
const CONFIG = require('./config.json');

async function main() {
    while(true) {
        try {
            await sendOne();
        } catch(err) {
            console.error(err);   
        }
        await waitMilliseconds(1 * 1000);
    }
}

main().catch(console.error);

async function sendOne(gasPrice = 300) {
    if (gasPrice > 1000) return;
    let nonce = await conflux.getNextNonce(account.address);

    let hash = await CrossSpaceCall.transferEVM(CONFIG.cfxs).sendTransaction({
        from: account.address,
        nonce: nonce,
        gasPrice: Drip.fromGDrip(gasPrice),  // call also specify the gasPrice
    });

    console.log(`Sending ${nonce} gasPrice ${gasPrice} hash ${hash}`);

    for(let i = 0; i < 30; i++) {
        console.log('checking', i, hash);
        let receipt = await conflux.getTransactionReceipt(hash);
        if (receipt){
            return receipt;
        }
        await waitMilliseconds(1000);
    }

    return await sendOne(gasPrice + 100);
}