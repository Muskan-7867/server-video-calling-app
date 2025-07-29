const meetingService = required("../services/meeting.js");

exports.startMeeting = (req, res, next) => {
    const { hostId, hostName } = req.body;
    var model = {
        hostId: hostId, hostName: hostName, startTime:Date.now()
    };

    meetingService.startMeeting(model, (error, results) => {
        if(error){
            return next(error);
        }
        return res.status(200).send({
            message: "success",
            data: results.id
        });
    });
}

exports.checkMeetingExists = (req, res, next) => {
    const { meetingId } = req.query;
    meetingService.checkMeetingExists(meetingId, (error, results) => {
        if(error){
            return next(error);
        }
        return res.status(200).send({
            message: "success",
            data: results
        })
    })
}

exports.getAllMeeetingUsers = (req, res, next) => {
    const { meetingId } = req.query;
    meetingService.getAllMeeetingUsers(meetingId, (error, results) => {
        if(error){
            return next(error);
        }
        return res.status(200).send({
            message: "success",
            data: results
        })
    })
}