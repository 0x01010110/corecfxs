const {cfxsMainContract} = require('../espace/eSpace.js');
const { waitMilliseconds } = require('../utils.js');
const fs = require('fs');
let result = {};

const START_ID = 0;
const END_ID = 21008206;

async function main() {
    for(let id = START_ID; id <= END_ID; id++) {
        try {
            if (result[id]) continue;
            const info = await cfxsMainContract.CFXss(id);
            const owner = info[1];
            result[id] = owner;
            console.log(id, owner);
        } catch(e) {
            console.log('Failed id===================', id, e);
        }
        await waitMilliseconds(50);
    }
    fs.writeFileSync('./index-data/cfxs-transfered-ids.json', JSON.stringify(result, null, '\t'));
    console.log('Finished');
}

main().catch(console.error);