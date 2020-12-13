
exports.quality = function (reqData, qField) {
  qResult = {}
  qResult.$in = reqData.split(',')
  return qResult
}
