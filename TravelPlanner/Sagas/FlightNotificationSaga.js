import { put, call } from "redux-saga/effects";
import FlightNotificationActions from "App/Stores/FlightNotification/Actions";
import { FlightNotificationService } from "App/Services/FlightNotificationService";

/*+++++++++++++ fetchFlightNotification +++++++++++++*/

export function* fetchFlightNotification(data) {
  yield put(FlightNotificationActions.fetchFlightNotificationLoading());
  const response = yield call(
    FlightNotificationService.getFlightNotifications,
    data.id,
    data.FlightNumber,
    data.AirlineCode
  );
  if (response) {
    yield put(
      FlightNotificationActions.fetchFlightNotificationSuccess(response)
    );
  } else {
    yield put(
      FlightNotificationActions.fetchFlightNotificationFailure(
        "Notification listing failed due to some error!"
      )
    );
  }
}
