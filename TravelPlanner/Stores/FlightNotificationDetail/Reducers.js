import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { FlightNotificationDetailTypes } from './Actions'

export const fetchFlightNotificationDetailLoading = (state) => {
  return {
    ...state,
    flightNotificationDetailIsLoading: true,
    flightNotificationDetailErrorMessage: false,
  }
}

export const fetchFlightNotificationDetailSuccess = (state, { notification }) => {
  return {
    ...state,
    flightNotificationDetail: notification.data,
    flightNotificationDetailIsLoading: false,
    flightNotificationDetailErrorMessage: false,
  }
}

export const fetchFlightNotificationDetailFailure = (state, { errorMessage }) => {
  return {
    ...state,
    flightNotificationDetailIsLoading: false,
    flightNotificationDetailErrorMessage: true,
  }
}

export const clearData = (state, {}) => {
  return ({
    ...INITIAL_STATE
  })
}

export const reducer = createReducer(INITIAL_STATE, {
  [FlightNotificationDetailTypes.FETCH_FLIGHT_NOTIFICATION_DETAIL_LOADING]: fetchFlightNotificationDetailLoading,
  [FlightNotificationDetailTypes.FETCH_FLIGHT_NOTIFICATION_DETAIL_SUCCESS]: fetchFlightNotificationDetailSuccess,
  [FlightNotificationDetailTypes.FETCH_FLIGHT_NOTIFICATION_DETAIL_FAILURE]: fetchFlightNotificationDetailFailure,
  [FlightNotificationDetailTypes.CLEAR_DATA]: clearData
})
