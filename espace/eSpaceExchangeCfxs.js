const { cfxsExchangeContract, cfxsContract, getWallet } = require('../conflux');
const { waitMilliseconds, getIDsFromAnother } = require('../utils.js');

const wallet = getWallet();
let cfxsExchangeContract1 = cfxsExchangeContract.connect(wallet);

const STEP = 20;

async function main() {
    const ids = await getIDsFromAnother(wallet.address);

    for(let i = 0; i < ids.length; i += STEP) {
        try {
            // prepare batch ids
            let exIds = [];
            for(let j = 0; j < STEP; j++) {
                if (i + j >= ids.length) break;

                let id = ids[i+j];
                if (id === '0') continue;
                let cfxsId = parseInt(id);

                let minted = await cfxsExchangeContract.minted(cfxsId);
                if (minted) {
                    console.log(`Id ${cfxsId} already exchanged`);
                    await waitMilliseconds(100);
                    continue;
                }
                
                // check owner
                let info = await cfxsContract.CFXss(cfxsId);
                if(!info || info.length === 0 || info[1] != wallet.address) {
                    await waitMilliseconds(100);
                    console.log(`Id ${cfxsId} is not yours`)
                    continue;
                }
                
                exIds.push(cfxsId);
            }
            if (exIds.length === 0) continue;

            // exchange
            console.log(`Exchange cfxs id ${exIds}`);
            const tx = await cfxsExchangeContract1.ExTestToMain(exIds);
            await tx.wait();
        } catch(e) {
            console.log('Exchange Error', e);
            await waitMilliseconds(500);
        }
    }

    console.log('Done');
}

main().catch(e => console.error(e));
