const {cfxsContract} = require('../conflux.js');
const fs = require('fs');
const { waitMilliseconds } = require('../utils.js');

// 统计 cfxs 合约的持有人数量
const holderMap = {};

async function main() {
    const filter = cfxsContract.filters.CFXsCreated;

    let startBlock = 85348585;
    const endBlock = 85762435;
    let step = 100;

    while(startBlock < endBlock) {
        try {
            let events = await cfxsContract.queryFilter(filter, startBlock, startBlock + step)
            
            console.log(`StartBlock ${startBlock} range ${step} events ${events.length}`);

            for(let event of events) {
                const id = event.args[0];
                const owner = event.args[1];
                if (!holderMap[owner]) {
                    holderMap[owner] = [id];
                } else {
                    holderMap[owner].push(id);
                }
            }
        } catch(e) {
            console.log(`StartBlock ${startBlock} range ${step} ======================`, e.message);
            await waitMilliseconds(500);
        }

        startBlock += step;
    }

    fs.writeFileSync('./holders.json', JSON.stringify(holderMap, null, '\t'));
    console.log('finished');
}

main().catch(e => console.error(e));
