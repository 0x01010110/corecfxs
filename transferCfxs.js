const { transferCFXs, account, cfxsMainContract } = require('./conflux');
const { address } = require('js-conflux-sdk');
const { waitMilliseconds, getIDsFromAnother } = require('./utils.js');
const mappedAddress = address.cfxMappedEVMSpaceAddress(account.address);

const STEP = 8;

async function main() {
    let receiver = process.argv[2];
    if (!receiver) {
        console.error('Usage: node transferCfxs.js <receiver>');
        return;
    }

    const ids = await getIDsFromAnother(mappedAddress);
    
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
                let info = await cfxsMainContract.CFXss(cfxsId);
                if(!info || info.length === 0 || info[1] != mappedAddress) {
                    await waitMilliseconds(100);
                    console.log(`Id ${cfxsId} is not yours`)
                    continue;
                }

                exIds.push(cfxsId);
            }
            
            if (exIds.length === 0) continue;

            console.log(`Transfer cfxs id ${exIds} to ${receiver}`);
            const receipt = await transferCFXs(exIds, receiver);
            console.log(`Result: ${receipt.outcomeStatus === 0 ? 'success' : 'fail'}`);
        } catch(e) {
            console.log('Transfer Error', e);
            await waitMilliseconds(500);
        }
    }

    console.log('Done');
}

main().catch(e => console.error(e));

