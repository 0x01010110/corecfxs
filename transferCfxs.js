const { transferCFXs, account, cfxsContract } = require('./conflux');
const { address } = require('js-conflux-sdk');
const axios = require('axios');
const { waitMilliseconds } = require('./utils.js');
const mappedAddress = address.cfxMappedEVMSpaceAddress(account.address);

/* async function main() {
    let receiver = process.argv[2];
    if (!receiver) {
        console.error('Usage: node transferCfxs.js <receiver>');
        return;
    }

    const ids = await getIDs(mappedAddress);
    for(let id of ids) {
        if (id === '0') continue;
        let cfxsId = parseInt(id);
        
        // check owner
        let info = await cfxsContract.CFXss(cfxsId);
        if(!info || info.length === 0 || info[1] != mappedAddress) {
            await waitMilliseconds(100);
            continue;
        }

        try {
            console.log(`Transfer cfxs id ${cfxsId} to ${receiver}`);
            const receipt = await transferCFXs(cfxsId, receiver, false);
            console.log(`Result: ${receipt.outcomeStatus === 0 ? 'success' : 'fail'}`);
        } catch(e) {
            console.log('Transfer Error', e);
            await waitMilliseconds(500);
        }
    }
}

main().catch(e => console.error(e));

async function getIDs(_addr) {
    let res = await axios.get(`http://110.41.179.168:8088?address=${_addr}`);
    const ids = res.data;
    return ids;
} */
