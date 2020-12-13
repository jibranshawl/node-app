
exports.generate = function (error, message, status, data) {
  var myResponse = {
    error: error,
    message: message,
    status: status,
    data: data
  }

  return myResponse
}

exports.Analytica = function (_id, user, displayName) {
  var myResponse = {
    _id: _id,
    displayName: displayName
  }

  return myResponse
}
