var mongoose = require('mongoose')
var express = require('express')
var jwt = require('jsonwebtoken')
var middleWares = require('./../../middlewares/auth')

// express router // used to define routes
var userRouter = express.Router()

var getuserId = require('./../../middlewares/get_userId')
var userModel = mongoose.model('User')
var tokenModel = mongoose.model('Token')
var responseGenerator = require('./../../libs/responseGenerator')
var dateGenerator = require('./../../libs/dateGenerator')


module.exports.controllerFunction = function (app) {
 
  userRouter.post('/signin', middleWares.Filter,getuserId.getUserId, function (req, res, data) {
    var phoneNumber = req.query.phoneNumber
  
    // find the user
        userModel.findOne({

          phoneNumber: req.query.phoneNumber

        }, function (err, user) {
          if (err) throw err

          if (!user) {
            res.send({
              success: false,
              message: 'Authentication failed. User not found.'
            })
          }

          else {

            var counter = user.counter
            var newCounter = counter + 1

            userModel.findOneAndUpdate({ _id: user._id }, { counter: newCounter }, function (err, val) {
              if (err) {
                console.log(err)
              } else {
                console.log(val)
              }
            })// end of findOneAndUpdate

            const payload = {

              phoneNumber: user.phoneNumber

            }

            var token = jwt.sign(payload, 'mycrudapp', {

              //      expiresInMinutes: 1440 // expires in 24 hours
            })

            var newtoken = new tokenModel()
            newtoken.token = token
            newtoken.userId = user._id

            var dateis = dateGenerator.datefunction()

            newtoken.cDate = dateis

            newtoken.save(function (err) {
              if (err) {
                console.log(err)
              } else {

              }
            }) // end token save

            res.send({
              success: true,
              user: user._id,
              message: 'Enjoy your token !',
              token: token,
              counter: newCounter,
              userData: user

            })
          }// end of else
        })//

})// end of Api



  // api for logout.
  userRouter.post('/logout/:id', middleWares.Filter,getuserId.getUserId, function (req, res, next) {
    tokenModel.remove({
      _id: req.params.id
    }, function (err, result) {
      if (err) {
        res.send(err)
      } else {
            res.send('successfully logout')
          }
    })
})

 userRouter.post('/create', function (req, res, next) {

  if (req.body.phoneNumber != undefined ) {
          
        userModel.count({
            $and: [{
              phoneNumber: req.body.phoneNumber
            }]
          }, function (err, foundUser) {
            if (err) {
              console.log('Signup error', err)
              res.send('Signup error')
              // return (err);
            }
            // if user found.
            else if (foundUser == '0') {              

                var newUser = new userModel({

                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    companyName: req.body.companyName,
                    displayName: req.body.displayName,
                    businessCategory: req.body.businessCategory,
                    city: req.body.city,
                    state: req.body.state,
                    country: req.body.country,
                    phoneNumber: req.body.phoneNumber,
                    userType: req.body.userType,
                    active: req.body.active

                }) // end new user

                var dateis = dateGenerator.datefunction()
                newUser.counter = 0
                newUser.cDate = dateis

                 newUser.save(function (err) {
                  if (err) {
                    var myResponse = responseGenerator.generate(true, 'some error' + err, 500, null)
                    res.send({
                      myResponse,
                      token: token
                    })
                  } else {

      //================= Generating Token ======================================
                    const payload = {

                      phoneNumber: user.phoneNumber

                    }

                    var token = jwt.sign(payload, 'mycrudapp', {

                      //      expiresInMinutes: 1440 // expires in 24 hours
                    })

                    var newtoken = new tokenModel()
                    newtoken.token = token
                    newtoken.userId = newUser._id

                    var dateis = dateGenerator.datefunction()

                    newtoken.cDate = dateis

                    newtoken.save(function (err) {
                      if (err) {
                        console.log(err)
                      } else {
                        var myResponse = responseGenerator.generate(false, 'successfully created user', 200, newUser)
                          res.send({
                            data: newUser,
                            token: token,
                            message: 'successfully created user'

                          })
                      }
                    }) // end token save

//============================================================================================================================================
                      }
                  })    
              }else{
                   res.send({
                        error: true,
                        message: ' PhoneNumber already exists',
                        status: 409,
                        data: null
                })
             }
          });         
    }else{
        res.send({
              success: false,
              message: 'Enter Valid PhoneNumber.'
       })
    }
});  



 userRouter.put('/update/:id', middleWares.Filter, getuserId.getUserId, function (req, res, next) {

    var update = req.body

    userModel.findOneAndUpdate({ _id: req.params.id }, update, function (err, result) {
      if (err) {
        console.log('some error')
        res.send(err)
      } else {
        res.send(result)
      }
    })
});



 userRouter.put('/read/all', middleWares.Filter, getuserId.getUserId, function (req, res, next) {


    var active = req.query.active
    var firstName = req.query.firstName
    var lastName = req.query.lastName
    var companyName = req.query.companyName

    var page = parseInt(req.query.page) || 0
    var limit = parseInt(req.query.limit) || 0

    var sort = {
      cDate: -1
    }

    var pagelimit = {}
    pagelimit.sort = sort
    if (limit > 0 && page > 0) {
      pagelimit.skip = (page - 1) * limit
      pagelimit.limit = limit
    } else {
      pagelimit.skip = 0
      pagelimit.limit = 0
    }

    var query = {}

    

    if (active != undefined || active != null || active == 'true') {
      query.active = active
    };

    if (firstName != undefined || firstName != null) {
      query.firstName = firstName
    };

    if (lastName != undefined || lastName != null) {
      query.lastName = lastName
    };

    if (companyName != undefined || companyName != null) {
      query.companyName = companyName
    };

   
   userModel.count({
        $and: [query]
      }, function (err, totalCount) {
        if (err) {
          response = {
            error: true,
            message1: err
          }
          res.send(response)
        } else {
          userModel.find({
            $and: [query]
          }, null, pagelimit, function (err, result) {
            if (err) {
              res.send(err)
            } else if (Object.keys(query).length == 0 || page < 1 || pagelimit.limit == 0) {
              var myResponse = {
                error: true,
                message: 'Please Provide a query parameter',
                status: 403,
                data: null
              }

              res.send(myResponse)
            } else if (totalCount <= (page - 1) * limit) {
              res.send({
                Message: 'End of Page Limit',
                totalCount: totalCount,
                totalRemaining: 0
              })
            } else if (Object.keys(result).length == 0) {
              var myResponse = {
                error: true,
                message: 'No Data Found',
                status: 500,
                data: null
              }

              res.send(myResponse)
            } else {
              var remaining = totalCount - (page * limit)
              if (-1 * remaining < limit && remaining < 0) {
                   res.send({
                          totalCount: totalCount,
                          totalRemaining: remaining,
                          Result: result,
                          status: 200

                        })
              } else {
                     res.send({
                            totalCount: totalCount,
                            totalRemaining: remaining,
                            Result: result,
                            status: 200
                   })
              } 
            }
          })
        } 
      })  
});

  app.use('/v1/user', userRouter)

} // end contoller code





