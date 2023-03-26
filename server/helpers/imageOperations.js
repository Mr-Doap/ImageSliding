const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const focus = async (region) => {
    await sleep(3000);
};

const capture = async (region) => {
    await sleep(2000);
};

module.exports = {
    focus,
    capture
};