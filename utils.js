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
        let { data: {count, rows} } = await axios.get(`http://test.conins.io/oldlist?owner=${_addr}&startIndex=${startIndex}&size=${limit}`);
        ids = ids.concat(rows.map(item => item.id));
        if (rows.length < limit) {
            break;
        }
        startIndex += limit;
    }
    return ids;
}

async function getIDsFromAnother(_addr) {
    let { data } = await axios.get(`http://110.41.179.168:8088/?address=${_addr}`);   
    return data;
}

module.exports = {
    getIDsFromAnother,
    getIDs,
    getNewCfxsIds,
    waitMilliseconds
};