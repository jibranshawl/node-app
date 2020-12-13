var mongoose = require('mongoose')
var Schema 	= mongoose.Schema
var uuid = require('node-uuid')

var tokenSchema = new Schema({

  _id: { type: String, default: uuid.v4 },
  token: { type: String },
  userId: { type: String, ref: 'User' },
  createdTime: { type: Date, default: Date.now },
  cDate: { type: Number },
  uDate: { type: Number }

})

mongoose.model('Token', tokenSchema)
