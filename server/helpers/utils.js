const IsRegionPresentInArray = (arr, region) => {
    if(arr?.length === 0) {
        return false;
    }
    const filteredArray = arr.filter((elem) => (elem.x === region.x && elem.y === region.y));
    return filteredArray.length > 0;
}

module.exports = {
    IsRegionPresentInArray,
};
