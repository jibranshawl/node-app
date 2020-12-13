
// defining a mongoose schema
// including the module
var mongoose = require('mongoose')
var uuid = require('node-uuid')
// require('mongoose-uuid2')(mongoose);

// declare schema object.
var Schema = mongoose.Schema

var userSchema = new Schema({

      _id: { type: String, default: uuid.v4 },
      firstName: { type: String, default: '' },
      lastName: { type: String, default: '' },
      companyName: { type: String, default: '' },
      displayName: { type: String, required: true },
      businessCategory: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      profileCreationDate: { type: Date, default: Date.now },
      phoneNumber: { type: Number, required: true },
      userType: { type: String },
      active: { type: String },
      cDate: { type: Number },
      counter: { type: Number }

})

mongoose.model('User', userSchema)


