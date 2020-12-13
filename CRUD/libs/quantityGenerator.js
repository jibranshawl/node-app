
exports.quantity = function (reqData) {
  var sArray = reqData.split(',')

  if (sArray[0] == 'eq') {
    var eqVal = {}
    eqVal.$eq = sArray[1]

    return eqVal
  } else if (sArray[0] == 'lt') {
    var ltVal = {}
    ltVal.$lt = sArray[1]
    return ltVal
  } else if (sArray[0] == 'gt') {
    var gtVal = {}
    gtVal.$gt = sArray[1]
    return gtVal
  } else if (sArray[0] == 'rng') {
    var rngVal = {}
    rngVal.$gt = sArray[1]
    rngVal.$lt = sArray[2]
    return rngVal
  }
}


