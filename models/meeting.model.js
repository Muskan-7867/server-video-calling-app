
const mongoose = require('mongoose');
const Meeting = mongoose.Schema({
    hostId: {
        type: String,
        required: true
    },
    hostName: {
         type: String,
        required: true
    },
    startTime : {
        required: true,
        type: Date
    },
    meetingUsers : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MeetingUser"
    }]
}, {
    toJSON : {
        transform: function (doc, ret){
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
}, {timestamps : true}

);

module.exports = {
    Meeting
}