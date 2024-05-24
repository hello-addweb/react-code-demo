import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { FlightNotificationTypes } from './Actions'

export const fetchFlightNotificationLoading = (state) => {
  return {
    ...state,
    flightNotificationIsLoading: true,
    flightNotificationErrorMessage: false,
  }
}

export const fetchFlightNotificationSuccess = (state, { notifications }) => {
  let oldData = state.flightNotification.filter(item=>item.journey_id !== notifications.journey_id);
  let newData = notifications.data.filter(item=>item.journey_id = notifications.journey_id)
  oldData.push({journey_id: notifications.journey_id , data: newData});
  return {
    ...state,
    flightNotification: oldData,
    flightNotificationIsLoading: false,
    flightNotificationErrorMessage: false,
  }
}

export const fetchFlightNotificationFailure = (state, { errorMessage }) => {
  return {
    ...state,
    flightNotificationIsLoading: false,
    flightNotificationErrorMessage: true,
  }
}

export const clearData = (state, {}) => {
  return ({
    ...INITIAL_STATE
  })
}


export const reducer = createReducer(INITIAL_STATE, {
  [FlightNotificationTypes.FETCH_FLIGHT_NOTIFICATION_LOADING]: fetchFlightNotificationLoading,
  [FlightNotificationTypes.FETCH_FLIGHT_NOTIFICATION_SUCCESS]: fetchFlightNotificationSuccess,
  [FlightNotificationTypes.FETCH_FLIGHT_NOTIFICATION_FAILURE]: fetchFlightNotificationFailure,
  [FlightNotificationTypes.CLEAR_DATA]: clearData,
})
