import { ApiClient } from "App/Config";
import { ApiEndPoints } from "App/Constant";
import { API } from "aws-amplify";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

function searchFlight(data) {
  return API.get(
    "FLIGHT_API",
    ApiEndPoints.GET_FLIGHT_INFORMATION +
      "?DEPDATE=" +
      data.time +
      "&ACID=" +
      data.number
  )
    .then(response => {
      return response.data;
    })
    .catch(err => {
      return null;
    });
}

function searchAirport(data) {
  return ApiClient("BASE_URL_FLIGHT")
    .post(ApiEndPoints.SEARCH_AIRPORT, { airport: data })
    .then(response => {
      return response.data.data;
    })
    .catch(err => {
      return null;
    });
}

function SearchFlightThroughAirport(data) {
  var queryString = Object.keys(data)
    .map(key => key.toUpperCase() + "=" + data[key])
    .join("&");
  return API.get(
    "FLIGHT_API",
    ApiEndPoints.GET_FLIGHT_INFORMATION + "?" + queryString
  )
    .then(response => {
      return response.data;
    })
    .catch(err => {
      return null;
    });
}

async function getCurrentUserLanguage() {
  let app_language = await AsyncStorage.getItem("app_language");

  return app_language
}

export const flightService = {
  searchFlight,
  searchAirport,
  SearchFlightThroughAirport,
  getCurrentUserLanguage
};
