const {focus, capture} = require('../helpers/imageOperations');
const { IsRegionPresentInArray } = require('../helpers/utils');

let captured = [];
let focusedButNotCaptured = [];
let requestedButNotFocused = [];
let pendingMoves = [];
let currentOperation = null;

const postRegion = (region) => {
    if (IsRegionPresentInArray(captured, region)) {
        return "Ok";
    }
    if(!currentOperation) {
        currentOperation = {region, status: 'PENDING_FOCUS'};
        runCurrentOperation();
    }
    else {
        if (!IsRegionPresentInArray(pendingMoves, region)) {
            pendingMoves.push(region);
        }
    }
    return "Ok";
};

const runCurrentOperation = async () => {
    while (currentOperation) {
        if (currentOperation.status === 'PENDING_FOCUS') {
            await focus(currentOperation.region);
            currentOperation.status = 'PENDING_CAPTURE';
        }
        else if (currentOperation.status === 'PENDING_CAPTURE') {
            await capture(currentOperation.region);
            currentOperation.status = 'CAPTURED';
        }
        updateHistory();
        updateCurrentOperation();
    }
};

const updateHistory = () => {
    if (currentOperation.status === 'PENDING_CAPTURE') {
        if (pendingMoves.length > 0) {
            focusedButNotCaptured.push(currentOperation.region);
        }
    }
    else {
        captured.push(currentOperation.region);
    }
};

const updateCurrentOperation = () => {
    if (pendingMoves.length > 0) {
        currentOperation = {region: pendingMoves.pop(), status: 'PENDING_FOCUS'};
        requestedButNotFocused.push(...pendingMoves);
        pendingMoves = [];
    }
    else if (currentOperation.status === 'CAPTURED') {
        currentOperation = null;
    }
};

module.exports = {
    captured,
    focusedButNotCaptured,
    requestedButNotFocused,
    postRegion
};
