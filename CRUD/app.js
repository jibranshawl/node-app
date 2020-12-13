var express = require('express')
var app = express()
var fs = require('fs')
var jwt = require('jsonwebtoken')
var mongoose = require('mongoose')
var session = require('express-session')
var logger = require('morgan')
var bodyParser = require('body-parser')
var fileUpload = require('express-fileupload')
var path = require('path')


app.use(express.static(__dirname + '/view'))

app.use(fileUpload())

app.use(logger('dev'))

app.use(bodyParser.json({ limit: '10kb' }))
app.use(bodyParser.urlencoded({ limit: '10kb', extended: true, /*parameterLimit: 1000000 */}))

app.set('view engine', 'pug')

// set the views folder
app.set('views', path.join(__dirname + '/app/views'))

// initialization of session middleware


var env = {

  myD: 'mongodb://localhost:27017/myDb',
  
}

var dbPath =env['staging']


// command to connect with database
db = mongoose.connect(dbPath)

mongoose.connection.once('open', function () {
  console.log('database connection open success')
})

// include all our model files
fs.readdirSync('./app/models').forEach(function (file) {
  // check if the file is js or not
  if (file.indexOf('.js'))
  // if it is js then include the file from that folder into our express app using require
  { require('./app/models/' + file) }
})// end for each

// include controllers
fs.readdirSync('./app/controllers').forEach(function (file) {
  if (file.indexOf('.js')) {
    // include a file as a route variable
    var route = require('./app/controllers/' + file)

    // call controller function of each file and pass your app instance to it
    route.controllerFunction(app)
  }
})// end for each

app.use(function (err, req, res, next) {
  console.log(err.stack)

  res.status(err.status || 500)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})








