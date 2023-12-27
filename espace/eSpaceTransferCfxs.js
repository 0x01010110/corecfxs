const { cfxsMainContract, getWallet } = require('../conflux');
const { waitMilliseconds, getNewCfxsIds } = require('../utils.js');

const wallet = getWallet();
let cfxsMainContract1 = cfxsMainContract.connect(wallet);

const STEP = 30;

async function main() {
    let receiver = process.argv[2];
    if (!receiver) {
        console.error('Usage: node transferCfxs.js <receiver>');
        return;
    }

    const ids = await getNewCfxsIds(wallet.address);
    
    for(let i = 0; i < ids.length; i += STEP) {
        try {
            // prepare ids
            let exIds = [];
            for(let j = 0; j < STEP; j++) {
                if (i + j >= ids.length) break;

                let id = ids[i+j];
                if (id === '0') continue;
                let cfxsId = parseInt(id);
                
                // check owner
                let info = await cfxsMainContract.CFXss(cfxsId);
                if(!info || info.length === 0 || info[1] != wallet.address) {
                    await waitMilliseconds(100);
                    console.log(`Id ${cfxsId} is not yours`)
                    continue;
                }
                
                exIds.push(cfxsId);
            }

            if (exIds.length === 0) continue;

            //
            console.log(`Transfer cfxs id ${exIds} to ${receiver}`);
            const tx = await cfxsMainContract1['transfer(uint256[],address)'](exIds, receiver);
            await tx.wait();
            // console.log(`Result: ${tx === 0 ? 'success' : 'fail'}`);
        } catch(e) {
            console.log('Transfer Error', e);
            await waitMilliseconds(500);
        }
    }
}

main().catch(e => console.error(e));
