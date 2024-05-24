import { ApiEndPoints } from "App/Constant";
import { API } from "aws-amplify";

function getFlightNotifications(id, FlightNumber, AirlineCode) {
  return API.get("FLIGHT_API", ApiEndPoints.GET_FLIGHT_ALERTS + "/" + id + "?airline_code= "+ AirlineCode +"&flight_number="+ FlightNumber)
    .then(response => {
      return { data: response.data, journey_id: id };
    })
    .catch(err => {
      return null;
    });
}

function getFlightNotificationDetail(alertId) {
  return API.get("FLIGHT_API", ApiEndPoints.GET_FLIGHT_ALERT_DETAIL + "/" + alertId)
    .then(response => {
      return { data: response.data};
    })
    .catch(err => {
      return null;
    });
}

export const FlightNotificationService = {
  getFlightNotifications,
  getFlightNotificationDetail
};
