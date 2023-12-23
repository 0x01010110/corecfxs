const axios = require('axios');

async function waitMilliseconds(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getNewCfxsIds(_addr) {
    let ids = [];
    const limit = 1000;
    let startIndex = 0;
    while(true) {
        let { data: {count, rows} } = await axios.get(`http://test.conins.io/newlist?owner=${_addr}&startIndex=${startIndex}&size=${limit}`);
        ids = ids.concat(rows.map(item => item.id));
        if (rows.length < limit) {
            break;
        }
        startIndex += limit;
    }
    return ids;
}

async function getIDs(_addr) {
    let ids = [];
    const limit = 1000;
    let startIndex = 0;
    while(true) {
        let { data: {count, rows} } = await axios.get(`http://test.conins.io/?owner=${_addr}&startIndex=${startIndex}&size=${limit}`);
        ids = ids.concat(rows.map(item => item.id));
        if (rows.length < limit) {
            break;
        }
        startIndex += limit;
    }
    return ids;
}

exports.getNewCfxsIds = getNewCfxsIds;

exports.getIDs = getIDs;

exports.waitMilliseconds = waitMilliseconds;