const { cfxsExchangeContract, cfxsContract, wallet } = require('./conflux');
const { waitMilliseconds, getIDs } = require('./utils.js');

cfxsExchangeContract.connect(wallet);

const STEP = 5;

async function main() {
    const ids = await getIDs(wallet.address);

    for(let i = 0; i < ids.length; i += STEP) {
        try {
            // prepare batch ids
            let exIds = [];
            for(let j = 0; j < STEP; j++) {
                if (i + j >= ids.length) break;

                let id = ids[i+j];
                if (id === '0') continue;
                let cfxsId = parseInt(id);
                
                // check owner
                let info = await cfxsContract.CFXss(cfxsId);
                if(!info || info.length === 0 || info[1] != mappedAddress) {
                    await waitMilliseconds(100);
                    console.log(`Id ${cfxsId} is not yours`)
                    continue;
                }
                
                exIds.push(cfxsId);
            }
            if (exIds.length === 0) continue;

            // exchange
            console.log(`Exchange cfxs id ${exIds}`);
            const tx = await cfxsExchangeContract.ExTestToMain(exIds);
            await tx.wait();
            // console.log(`Result: ${tx === 0 ? 'success' : 'fail'}`);
        } catch(e) {
            console.log('Exchange Error', e);
            await waitMilliseconds(500);
        }
    }
}

main().catch(e => console.error(e));
