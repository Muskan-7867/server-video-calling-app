const meetingService = require("../services/meeting.js");
const MeetingPayloadEnum = require("../utills/meeting-payload.enum.js");

async function joinMeeting(meetingId, socket, payload, meetingServer) {
  const { userId, name } = payload;

  meetingService.isPresentMeeting(meetingId, async (error, results) => {
    if (error && !results) {
      sendMessage(socket, {
        type: MeetingPayloadEnum.NOT_FOUND
      });
    }
    if (results) {
      addUser(socket, { meetingId, userId, name }).then(
        (result) => {
          if (result) {
            sendMessage(socket, {
              type: MeetingPayloadEnum.JOINED_MEETING,
              data: {
                userId
              }
            });

            broadcastUsers(meetingId, meetingServer, socket, {
              type: MeetingPayloadEnum.USER_JOINED,
              data: {
                userId,
                name,
                ...payload.data
              }
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  });
}

function addUser(socket, { meetingId, userId, name }) {
  let promise = new Promise(function (resolve, reject) {
    meetingService.getMeetingUser({ meetingId, userId }, (error, results) => {
      if (!results) {
        var model = {
          socketId: socket.id,
          meetingId: meetingId,
          userId: userId,
          name: name,
          joined: true,
          isAlive: true
        };

        meetingService.joinMeeting(model, (error, results) => {
          if (results) {
            resolve(true);
          }

          if (error) {
            reject(error);
          }
        });
      } else {
        meetingService.updateMeetingUser(
          { userId: userId, socketId: socket.id },
          (error, results) => {
            if (results) {
              resolve(true);
            }
            if (error) {
              reject(error);
            }
          }
        );
      }
    });
  });

  return promise;
}

function sendMessage(socket, payload) {
  socket.send(JSON.stringify(payload));
}

function broadcastUsers(meetingId, socket, meetingServer, payload) {
  socket.broadcast.emit("message", JSON.stringify(payload));
}

function forwardConnectionRequest(meetingId, socket, meetingServer, payload) {
  const { userId, otherUserId, name } = payload.data;

  var model = {
    meetingId: meetingId,
    userId: otherUserId
  };

  meetingService.getMeetingUser(model, (error, results) => {
    if (results) {
      var sendPaylaod = JSON.stringify({
        type: MeetingPayloadEnum.CONNECTION_REQUEST,
        data: {
          userId: userId,
          name: name,
          ...payload.data
        }
      });

      meetingServer.to(results.socketId).emit("message", sendPaylaod);
    }
  });
}

function forwardIceCandidate(meetingId, socket, meetingServer, payload) {
  const { userId, otherUserId, candidate } = payload.data;

  var model = {
    meetingId: meetingId,
    userId: otherUserId
  };

  meetingService.getMeetingUser(model, (error, results) => {
    if (results) {
      var sendPaylaod = JSON.stringify({
        type: MeetingPayloadEnum.ICECANDIDATE,
        data: {
          userId,
          candidate,
          ...payload.data
        }
      });

      meetingServer.to(results.socketId).emit("message", sendPaylaod);
    }
  });
}

function forwardAnswerSDP(meetingId, socket, meetingServer, payload) {
  const { userId, otherUserId, sdp } = payload.data;

  var model = {
    meetingId: meetingId,
    userId: otherUserId
  };

  meetingService.getMeetingUser(model, (error, results) => {
    if (results) {
      var sendPaylaod = JSON.stringify({
        type: MeetingPayloadEnum.OFFER_SDP,
        data: {
          userId,
          sdp,
          ...payload.data
        }
      });

      meetingServer.to(results.socketId).emit("message", sendPaylaod);
    }
  });
}

function forwardOffersSDP(meetingId, socket, meetingServer, payload) {
  const { userId, otherUserId, sdp } = payload.data;

  var model = {
    meetingId: meetingId,
    userId: otherUserId
  };

  meetingService.getMeetingUser(model, (error, results) => {
    if (results) {
      var sendPaylaod = JSON.stringify({
        type: MeetingPayloadEnum.ANSWER_SDP,
        data: {
          userId,
          sdp,
          ...payload.data
        }
      });

      meetingServer.to(results.socketId).emit("message", sendPaylaod);
    }
  });
}

function userLeft(meetingId, socket, meetingServer, payload) {
  const { userId } = payload.data;
  broadcastUsers(meetingId, socket, meetingServer, {
    type: MeetingPayloadEnum.USER_LEFT,
    data: {
      userId
    }
  });
}

function endMeeting(meetingId, socket, meetingServer, payload) {
  const { userId } = payload.data;
  broadcastUsers(meetingId, socket, meetingServer, {
    type: MeetingPayloadEnum.MEETING_ENDED,
    data: {
      userId
    }
  });

  meetingService.getAllMeetingUsers(meetingId, (error, results) => {
    for (let i = 0; i < results.length; i++) {
      const meetingUser = results[i];
      meetingServer.sockets.connected[meetingUser.socketId].disconnect();
    }
  });
}

function forwardEvent(meetingId, socket, meetingServer, payload) {
  const { userId } = payload.data;

  broadcastUsers(meetingId, socket, meetingServer, {
    type: MeetingPayloadEnum.MEETING_ENDED,
    data: {
      userId: userId,
      ...payload.data
    }
  });
}

module.exports = {
  joinMeeting,
  addUser,
  sendMessage,
  broadcastUsers,
  forwardConnectionRequest,
  forwardIceCandidate,
  forwardAnswerSDP,
  forwardOffersSDP,
  userLeft,
  endMeeting,
  forwardEvent
};
