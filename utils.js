async function waitMilliseconds(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.waitMilliseconds = waitMilliseconds;