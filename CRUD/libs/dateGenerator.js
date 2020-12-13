
exports.datefunction = function () {
  today = Date.now()

  var date = new Date(today)

  var hour = date.getHours()
  hour = (hour < 10 ? '0' : '') + hour

  var min = date.getMinutes()
  min = (min < 10 ? '0' : '') + min

  var sec = date.getSeconds()
  sec = (sec < 10 ? '0' : '') + sec

  var year = date.getFullYear()

  var month = date.getMonth() + 1
  month = (month < 10 ? '0' : '') + month

  var day = date.getDate()
  day = (day < 10 ? '0' : '') + day

  var dateis = year + '' + month + '' + day + '' + hour + '' + min + '' + sec

  return dateis
} // end of datefunction

