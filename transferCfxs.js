
async function main() {
    let cfxsId = process.argv[2];
    let receiver = process.argv[3];

    if (!cfxsId || !receiver) {
        console.error('Usage: node transferCfxs.js <cfxsId> <receiver>');
        return;
    }

    console.log(`Transfer cfxs id ${cfxsId} to ${receiver}`);
    const receipt = await transferCFXs(cfxsId, receiver);
    console.log(`Result: ${receipt.outcomeStatus === 0 ? 'success' : 'fail'}`);
}

main().catch(e => console.error(e));
