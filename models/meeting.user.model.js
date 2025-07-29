
const mongoose = require('mongoose');
const MeetingUser = mongoose.Schema({
    socketId: {
        type: String,
       
    },
    meetingId: {
         type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId : {
        type: String,
        required: true
    },
    joined: {
      type: Boolean,
      required: true
    },
    name: {
      type: String,
      required: true
    },
     isAlive: {
      type: String,
      required: true
    },
    
},  {timestamps : true}

);

module.exports = {
    MeetingUser
}