async function _setGoalBuffer(data) {
    this.goalBuffer = data;
}

async function _getGoalBuffer() {
    return _setGoalBuffer;
}

exports._getGoalBuffer =_getGoalBuffer
exports._setGoalBuffer = _setGoalBuffer