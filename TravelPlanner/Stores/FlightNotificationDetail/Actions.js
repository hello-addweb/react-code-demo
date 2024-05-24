import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  fetchFlightNotificationDetail: ['alertId'],
  fetchFlightNotificationDetailLoading: null,
  fetchFlightNotificationDetailSuccess: ['notification'],
  fetchFlightNotificationDetailFailure: ['errorMessage'],
  clearData: null,
})

export const FlightNotificationDetailTypes = Types
export default Creators
