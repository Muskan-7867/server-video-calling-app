const { MeetingUser } = require("../models/meeting-user.model");
const { Meeting } = require("../models/meeting.model");

async function getAllMeetingUsers(meetId, callback){
  MeetingUser.find({meetingId: meetId})
  .then((response) => {
    callback(null, response);
  })
  .catch((error) => {
    callback(error);
  })
};

async function startMeeting(params, callback) {
    const meetingSchema = new Meeting(params);
    meetingSchema.save().then((response) => {
        return callback(null, response);
    })
    .catch((error) => {
        return callback(error);
    })
}

async function joinMeeting(params, callback) {
  const meetingUserModel = new MeetingUser(params);
  meetingUserModel.save().then(async (response) => {
      await meeting.findOneAndUpdate({id:params.meetingId}, {$addToSet: {"meetingUsers": meetingUserModel}})
      return callback(null, response);
    })
    .catch((error) => {
        return callback(error);
    })
  
}

async function isPresentMeeting(params, callback) {
    
}