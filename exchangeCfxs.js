const { exchangeCFXs, account, cfxsContract, cfxsExchangeContract } = require('./conflux');
const { address } = require('js-conflux-sdk');
const { waitMilliseconds, getIDsFromAnother } = require('./utils.js');
const mappedAddress = address.cfxMappedEVMSpaceAddress(account.address);

const STEP = 5;

async function main() {
    const ids = await getIDsFromAnother(mappedAddress);
    
    for(let i = 0; i < ids.length; i += STEP) {
        try {
            let exIds = [];
            for(let j = 0; j < STEP; j++) {
                if (i + j >= ids.length) break;

                let id = ids[i + j];
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
                if(!info || info.length === 0 || info[1] != mappedAddress) {
                    console.log(`Id ${cfxsId} is not yours`);
                    await waitMilliseconds(100);
                    continue;
                }

                exIds.push(cfxsId);
            }
            
            if (exIds.length === 0) continue;
            
            console.log(`Exchange cfxs id ${exIds}`);
            const receipt = await exchangeCFXs(exIds);
            console.log(`Result: ${receipt.outcomeStatus === 0 ? 'success' : 'fail'}`);
            console.log('Tx hash', receipt.transactionHash);
        } catch(e) {
            console.log('Transfer Error', e);
            await waitMilliseconds(500);
        }
    }

    console.log('Finished');
}

main().catch(e => console.error(e));
