var express = require('express')
var jwt = require('jsonwebtoken')
var mongoose = require('mongoose')
var tokenModel = mongoose.model('Token')

exports.getUserId = function (req, res, next) {
  tokenModel.find({ token: req.query.token }, function (err, result) {
    if (err) {
      console.log(err)
    } else if (Object.keys(result).length == 0) {
      return res.send('Please sign-in first, not able to find token')
    } else {
      var userId = result[0].userId
    }

		 req.userId = userId

		 	next()
  }) // end of function
} // end of getUserId function
