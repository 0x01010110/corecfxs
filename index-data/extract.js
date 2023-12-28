const fs = require('fs');
const readline = require('readline');
const transferData = require("./cfxs-transfered-ids.json");

// extract data from csv file
const filePath = '/Users/panaw/Downloads/t.csv';

// Create a readable stream from the file
const fileStream = fs.createReadStream(filePath);

// Create an interface for reading from the file stream
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity // To recognize both '\r\n' and '\n' as newline characters
});

let count = 0;
// Event listener for each line read from the file
rl.on('line', (line) => {
    let meta = line.split(",");
    const id = meta[0];
    const owner = meta[1];
    console.log(count++, id, owner);
    transferData[id] = owner;
});

// Event listener for when the file reading is complete
rl.on('close', () => {
    console.log('File reading completed.');

    const summary = {};
    const userCounts = {};
    let total = 0;

    for (const id in transferData) {
        const owner = transferData[id];
        
        if (!summary[owner]) {
            summary[owner] = [];
            userCounts[owner] = 0;
        }

        summary[owner].push(id);
        userCounts[owner]++;
        total++;
    }

    fs.writeFileSync("./index-data/user-cfxs-count.json", JSON.stringify(userCounts, null, '\t'));

    for(let owner in summary) {
        fs.writeFileSync(`../holders-v2/${owner}.json`, JSON.stringify(summary[owner], null, '\t'));
    }

    console.log('Total:', total);
});
