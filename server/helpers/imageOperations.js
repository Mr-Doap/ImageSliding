const { FOCUS_SLEEP_MS, CAPTURE_SLEEP_MS } = require("./consts");

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Simulates the focus blocking operation.
 * 
 * @param region Region to focus on. 
 */
const focus = async (region) => {
    await sleep(FOCUS_SLEEP_MS);
};

/**
 * Simulates the capture blocking operation.
 * 
 * @param region Region to capture on.
 */
const capture = async (region) => {
    await sleep(CAPTURE_SLEEP_MS);
};

module.exports = {
    focus,
    capture
};