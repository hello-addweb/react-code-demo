import { put, call } from "redux-saga/effects";
import flightDetailAction from "App/Stores/Journey/FlightDetail/Actions";
import airportSearchAction from "../Stores/Journey/AirportSearch/Actions";
import searchFlightThroughAirportAction from "../Stores/Journey/SearchFlightThrowAirport/Actions";
import { flightService } from "../Services/SearchFlight";
import AsyncStorage from "@react-native-community/async-storage";

export function* searchFlight(flightDetails) {

  yield put(flightDetailAction.searchFlightLoading());

  const response = yield call(
    flightService.searchFlight,
    flightDetails.flightDetails
  );
  if (response) {
    yield put(flightDetailAction.searchFlightSuccess(response));
  } else {
    yield put(
      flightDetailAction.searchFlightFailure(
        "Journey listing failed due to some error!"
      )
    );
  }
}

export function* airportSearch(searchText) {
  yield put(airportSearchAction.airportSearchLoading());

  const appLanguage = yield call(flightService.getCurrentUserLanguage)
  let userLanguage = appLanguage ?? 'en'

  const response = yield call(flightService.searchAirport, searchText.data);
  

  if (response) {
    let res = []

    if (response.length > 0) {
      response.map(item => {
        if (item.length > 0) {
           const temp = item.filter(airport => {
            if(airport.language === userLanguage) {
              res.push(airport)
              return airport  
            }
           })
          
           if(temp.length === 0) {
             res.push(item[0])
           }
        }
      })
    }
    yield put(airportSearchAction.airportSearchSuccess(res));
  } else {
    yield put(
      airportSearchAction.airportSearchFailure(
        "Journey listing failed due to some error!"
      )
    );
  }
}
export function* SearchFlightThroughAirport(searchData) {
  yield put(
    searchFlightThroughAirportAction.SearchFlightThroughAirportLoading()
  );

  const response = yield call(
    flightService.SearchFlightThroughAirport,
    searchData.data
  );

  if (response) {
    yield put(
      searchFlightThroughAirportAction.SearchFlightThroughAirportSuccess(
        response
      )
    );
  } else {
    yield put(
      searchFlightThroughAirportAction.SearchFlightThroughAirportFailure(
        "Journey listing failed due to some error!"
      )
    );
  }
}
