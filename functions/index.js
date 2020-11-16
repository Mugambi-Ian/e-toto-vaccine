const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const calendar = google.calendar("v3");
const functions = require("firebase-functions");
const cors = require("cors")({
  origin: true,
});
const googleCredentials = require("./credentials.json");

const ERROR_RESPONSE = {
  status: "500",
  message: "There was an error adding an event to your Google calendar",
};
const TIME_ZONE = "EAT";

const addEvent = (event, auth) => {
  return new Promise((resolve, reject) => {
    calendar.events.insert(
      {
        auth: auth,
        calendarId: "primary",
        resource: {
          summary: event.eventName,
          description: event.description,
          start: {
            dateTime: event.startTime,
            timeZone: TIME_ZONE,
          },
          end: {
            dateTime: event.endTime,
            timeZone: TIME_ZONE,
          },
        },
      },
      (err, res) => {
        if (err) {
          console.log("Rejecting because of error");
          reject(err);
        }
        console.log("Request successful");
        resolve(res.data);
      }
    );
  });
};
exports.createEvent = functions.
exports.addEventToCalendar = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    const eventData = {
      eventName: "Firebase Event",
      description: "This is a sample description",
      startTime: "2020-12-01T10:00:00",
      endTime: "2020-12-01T13:00:00",
    };
    const oAuth2Client = new OAuth2(
      googleCredentials.web.client_id,
      googleCredentials.web.client_secret,
      googleCredentials.web.redirect_uris[0]
    );
    oAuth2Client.setCredentials({
      refresh_token: googleCredentials.refresh_token,
    });
    addEvent(eventData, oAuth2Client)
      .then((data) => {
        response.status(200).send(data);
        return;
      })
      .catch((err) => {
        console.error("Error adding event: " + err.message);
        response.status(500).send(ERROR_RESPONSE);
        return;
      });
  });
});
