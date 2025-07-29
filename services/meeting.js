const { MeetingUser } = require("../models/meeting.user.model");
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
};

async function joinMeeting(params, callback) {
  const meetingUserModel = new MeetingUser(params);
  meetingUserModel.save().then(async (response) => {
      await meeting.findOneAndUpdate({id:params.meetingId}, {$addToSet: {"meetingUsers": meetingUserModel}})
      return callback(null, response);
    })
    .catch((error) => {
        return callback(error);
    })
  
};

async function isPresentMeeting(meetingId, callback) {
    meeting.findById(meetingId).populate("meetingUsers", "MeetingUser").then((response) => {
      if(!response) callback("Meeting not found")
        else callback(null, response);
    }).catch((error) => {
        return callback(error, false)
    })
};

async function checkMeetingExists(meetingId, callback) {
    meeting.findById(meetingId, "hostId, hostname, startTime" )
    .populate("meetingUsers", "MeetingUser").then((response) => {
      if(!response) callback("Meeting not found")
        else callback(null, response);
    }).catch((error) => {
        return callback(error, false)
    })
};

async function getMeetingUser(params, callback) {
  const{ meetingId, userId } = params;
  meetingUser.find({meetingId, userId}).then((response) => {
    return callback(null, response[0])
  }).catch((error) => {
    return callback(error);
  });
}

async function updateMeetingUser(params, callback){
  meetingUser.updateOne({ userId: params.userId}, {$set: params}, {new: true})
  .then((response) => {
    return callback(null, response);
  })
  .catch((error) => {
    return callback(error);
  })
}

async function getUserBySocketId(params, callback){
  const { meetingId, socketId } = params;
  meetingUser.find({meetingId, socketId}).limit(1).then((response) => {
    return callback(null, response);
  })
  .catch((error) => {
    return callback(error);
  })
}


module.exports = {
  getAllMeetingUsers,
  startMeeting,
  joinMeeting,
  isPresentMeeting,
  checkMeetingExists,
  getMeetingUser,
  updateMeetingUser,
  getUserBySocketId
}