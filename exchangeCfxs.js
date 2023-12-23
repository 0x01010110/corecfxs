const { exchangeCFXs, account, cfxsContract, cfxsExchangeContract } = require('./conflux');
const { address } = require('js-conflux-sdk');
const axios = require('axios');
const { waitMilliseconds, getIDs } = require('./utils.js');
const mappedAddress = address.cfxMappedEVMSpaceAddress(account.address);

const STEP = 5;

async function main() {
    const ids = await getIDs(mappedAddress);
    
    for(let i = 0; i < ids.length; i += STEP) {
        try {
            let exIds = [];
            for(let j = 0; j < STEP; j++) {
                if (i + j >= ids.length) break;

                let id = ids[i + j];
                if (id === '0') continue;
                let cfxsId = parseInt(id);

                // check owner
                let info = await cfxsContract.CFXss(cfxsId);
                if(!info || info.length === 0 || info[1] != mappedAddress) {
                    console.log(`Id ${cfxsId} is not yours`);
                    await waitMilliseconds(100);
                    continue;
                }

                let minted = await cfxsExchangeContract.minted(cfxsId);
                if (minted) {
                    console.log(`Id ${cfxsId} already exchanged`);
                    await waitMilliseconds(100);
                    continue;
                }

                exIds.push(cfxsId);
            }
            
            if (exIds.length === 0) continue;
            
            console.log(`Exchange cfxs id ${exIds}`);
            const receipt = await exchangeCFXs(exIds);
            console.log(`Result: ${receipt.outcomeStatus === 0 ? 'success' : 'fail'}`);
            console.log(receipt.transactionHash);
        } catch(e) {
            console.log('Transfer Error', e);
            await waitMilliseconds(500);
        }
    }
}

main().catch(e => console.error(e));
