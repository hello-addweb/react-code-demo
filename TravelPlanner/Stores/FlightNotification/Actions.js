import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  fetchFlightNotification: ['id', 'FlightNumber', 'AirlineCode'],
  fetchFlightNotificationLoading: null,
  fetchFlightNotificationSuccess: ['notifications'],
  fetchFlightNotificationFailure: ['errorMessage'],
  clearData: null,
})

export const FlightNotificationTypes = Types
export default Creators
