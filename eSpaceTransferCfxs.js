const { cfxsMainContract, provider } = require('./conflux');
const { waitMilliseconds, getNewCfxsIds } = require('./utils.js');

const { Wallet } = require('ethers');
const { eSpacePrivateKey } = require('./config.json');
const wallet = new Wallet(eSpacePrivateKey, provider);
cfxsMainContract.connect(wallet);

async function main() {
    let receiver = process.argv[2];
    if (!receiver) {
        console.error('Usage: node transferCfxs.js <receiver>');
        return;
    }

    const ids = await getNewCfxsIds(wallet.address);
    const step = 5;

    for(let i = 0; i < ids.length; i += step) {
        let exIds = [];

        for(let j = 0; j < step; j++) {
            if (i + j >= ids.length) break;
            let id = ids[i+j];
            if (id === '0') continue;
            let cfxsId = parseInt(id);
            
            // check owner
            let info = await cfxsMainContract.CFXss(cfxsId);
            if(!info || info.length === 0 || info[1] != mappedAddress) {
                await waitMilliseconds(100);
                console.log(`Id ${cfxsId} is not yours`)
                continue;
            }
            exIds.push(cfxsId);
        }

        try {
            console.log(`Transfer cfxs id ${exIds} to ${receiver}`);
            const tx = await cfxsMainContract.transfer(exIds, receiver);
            await tx.wait();
            // console.log(`Result: ${tx === 0 ? 'success' : 'fail'}`);
        } catch(e) {
            console.log('Transfer Error', e);
            await waitMilliseconds(500);
        }
    }
}

main().catch(e => console.error(e));
