
import { put, call } from "redux-saga/effects";
import FlightNotificationDetailActions from "App/Stores/FlightNotificationDetail/Actions";
import { FlightNotificationService } from "App/Services/FlightNotificationService";

export function* fetchFlightNotificationDetail(data) {
    yield put(FlightNotificationDetailActions.fetchFlightNotificationDetailLoading());
    const response = yield call(
      FlightNotificationService.getFlightNotificationDetail,
      data.alertId
    );
    if (response) {
      yield put(
        FlightNotificationDetailActions.fetchFlightNotificationDetailSuccess(response)
      );
    } else {
      yield put(
        FlightNotificationDetailActions.fetchFlightNotificationDetailFailure(
          "Notification Detail failed due to some error!"
        )
      );
    }
  }