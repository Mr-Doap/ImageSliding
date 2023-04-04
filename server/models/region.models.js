const { OPERATION_STATUS } = require('../helpers/consts');
const {focus, capture} = require('../helpers/imageOperations');
const { IsRegionPresentInArray } = require('../helpers/utils');

let captured = [];
let focused = [];
let requested = [];
let pendingMoves = [];
let currentOperation = null;
/**
 * 
 * @returns region that is being focused as part of the current operation, otherwise returns null.
 */
const getFocusing = () => {
    if (isFocusing()) {
        return currentOperation.region;
    }
    return null;
};

const isFocusing = () => {
    return currentOperation && currentOperation.status === OPERATION_STATUS.PENDING_FOCUS;
};

/**
 * Asynchrnous function that returns immediately after it takes the input. Returns 'Ok' response after noting down the region, does not wait for the focus and capture blocking operations to complete.
 * 
 * @param region Region to refocus on that is execute both the focus and capture operations upon. 
 * @returns 'Ok'
 */
const postRegion = (region) => {
    if (IsRegionPresentInArray(captured, region)) {
        return "Ok";
    }
    if (!IsRegionPresentInArray(requested, region)) {
        requested.push(region);
    }
    if(!currentOperation) {
        currentOperation = {region, status: OPERATION_STATUS.PENDING_FOCUS};
        runCurrentOperation();
    }
    else if(!IsRegionPresentInArray(pendingMoves, region)) {
        pendingMoves = [region];
    }
    return "Ok";
};

const runCurrentOperation = async () => {
    while (currentOperation) {
        if (currentOperation.status === OPERATION_STATUS.PENDING_FOCUS) {
            await focus(currentOperation.region);
            currentOperation.status = OPERATION_STATUS.PENDING_CAPTURE;
        }
        else if (currentOperation.status === OPERATION_STATUS.PENDING_CAPTURE) {
            await capture(currentOperation.region);
            currentOperation.status = OPERATION_STATUS.CAPTURED;
        }
        updateHistory();
        updateCurrentOperation();
    }
};

const updateHistory = () => {
    if (currentOperation.status === OPERATION_STATUS.PENDING_CAPTURE) {
        focused.push(currentOperation.region);
    }
    else {
        captured.push(currentOperation.region);
    }
};

const updateCurrentOperation = () => {
    if (pendingMoves.length > 0) {
        currentOperation = {region: pendingMoves.pop(), status: OPERATION_STATUS.PENDING_FOCUS};
    }
    else if (currentOperation.status === OPERATION_STATUS.CAPTURED) {
        currentOperation = null;
    }
};

module.exports = {
    captured,
    focused,
    requested,
    postRegion,
    getFocusing,
};
