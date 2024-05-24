import { combineReducers } from "redux";
import configureStore from "./CreateStore";
import rootSaga from "App/Sagas";

import { reducer as AppConfigReducer } from "./AppConfig/Reducers";
import { reducer as IntroReducer } from "./IntroScreen/Reducers";
import { reducer as NavigationReducer } from "./Navigation/Reducers";
import { reducer as LanguageReducer } from "./Language/Reducers";
import { reducer as ListJourneyReducer } from "./Journey/ListJourney/Reducers";
import { reducer as UserReducer } from "./UserStore/User/Reducers";
import { reducer as UpdateProfileReducer } from "./UserStore/UpdateProfile/Reducers";
import { reducer as CreateJourneyReducer } from "./Journey/CreateJourney/Reducers";
import { reducer as EditJourneyReducer } from "./Journey/EditJourney/Reducers";
import { reducer as UpdateJourneyReducer } from "./Journey/UpdateJourney/Reducers";
import { reducer as JourneyReducer } from "./Journey/Journey/Reducers";
import { reducer as JourneyDetailReducer } from "./Journey/JourneyDetail/Reducers";
import { reducer as FeaturedEntriesReducer } from "./Journey/featuredEntries/Reducers";
import { reducer as TimelineEntriesReducer } from "./Journey/timelineEntries/Reducers";
import { reducer as WeatherDetailReducer } from "./Journey/Weather/Reducers";
import { reducer as DocumentUploadReducer } from "./Documents/DocumentUpload/Reducers";
import { reducer as FetchDocumentReducer } from "./Documents/FetchDocument/Reducers";
import { reducer as DownloadDocumentReducer } from "./Documents/DownloadDocument/Reducers";
import { reducer as ListNotificationReducer } from "./Notification/Reducers";
import { reducer as FlightNotificationReducer } from "./FlightNotification/Reducers";
import { reducer as FlightNotificationDetailReducer } from "./FlightNotificationDetail/Reducers";

import { reducer as AddResourceReducer } from "./Journey/AddResource/Reducers";
import { reducer as PreCacheReducer } from "./PreCache/Reducers";
import { reducer as flightDetailReducer } from "./Journey/FlightDetail/Reducers";
import { reducer as getInsuranceList } from "./Insurance/getInsuranceList/Reducers";
import { reducer as addInsurenceCompany } from "./Insurance/addInsurenceCompany/Reducers";
import { reducer as deleteInsurance } from "./Insurance/deleteInsurance/Reducers";
import { reducer as userInsuranceInfo } from "./Insurance/userInsuranceInfo/Reducers";
import { reducer as purchasedInsurance } from "./Insurance/purchasedInsurance/Reducers";
import { reducer as insuranceDetailsById } from "./Insurance/insuranceDetailsById/Reducers";
import { reducer as deleteTripReducer } from "./Journey/deleteTrip/Reducers";

import { reducer as inviteUserReducer } from "./Journey/inviteUser/Reducers";

import { reducer as editPurchaseReducer } from "./Insurance/editInsurance/Reducers";

import { reducer as consentReducer } from "./Consent/Reducers";
import { reducer as setConsentReducer } from "./setConsent/Reducers";

import { reducer as airportSearchReducer } from "./Journey/AirportSearch/Reducers";

import { reducer as searchFlightThroughAirportReducer } from "./Journey/SearchFlightThrowAirport/Reducers";
// import { reducer as ViewJourneyReducer } from './ViewJourney/Reducers'
import { reducer as deleteJourneyReducer } from "./Journey/deleteJourney/Reducers";

import { reducer as LeaveJourneyReducer } from "./Journey/LeaveJourney/Reducers";

import { reducer as deleteDocumentReducer } from "./Documents/DocumentDelete/Reducers";

import { reducer as FeedCacheReducer } from "./Journey/FeedCache/Reducers";
import { reducer as notificationListCacheReducer } from "./NotificationCache/Reducers";

import { reducer as countryInformationReducer } from "./Journey/CountryInformation/Reducers";

import { reducer as providerDetailsReducer } from "./Journey/ProviderDetails/Reducers";

import { reducer as feedbackReducer } from "./FeedBack/Reducers";

import { reducer as chatReducer } from "./ChatStore/Reducers";
import { reducer as unreadTimelineCountReducer } from './Journey/UnreadTimelineCount/Reducers';

import { reducer as inviteJourney } from "./Journey/InviteJourney/Reducers";

export default () => {
  const rootReducer = combineReducers({
    config: AppConfigReducer,
    intro: IntroReducer,
    navigation: NavigationReducer,
    languages: LanguageReducer,
    listJourney: ListJourneyReducer,
    UserProfile: UserReducer,
    UpdateProfile: UpdateProfileReducer,
    UpdateJourney: UpdateJourneyReducer,
    CreateJourney: CreateJourneyReducer,
    EditJourney: EditJourneyReducer,
    journey: JourneyReducer,
    journeyDetail: JourneyDetailReducer,
    weatherDetail: WeatherDetailReducer,
    documentUpload: DocumentUploadReducer,
    fetchDocument: FetchDocumentReducer,
    downloadDocument: DownloadDocumentReducer,
    listNotification: ListNotificationReducer,
    addResource: AddResourceReducer,
    OfflineStore: PreCacheReducer,
    flightDetail: flightDetailReducer,
    flightNotifications: FlightNotificationReducer,
    flightNotificationDetail : FlightNotificationDetailReducer,
    insuranceList: getInsuranceList,
    insuranceCompanyRequest: addInsurenceCompany,
    userInsuranceInfo: userInsuranceInfo,
    deleteInsurance: deleteInsurance,
    purchasedInsurance: purchasedInsurance,
    insuranceDetailsById: insuranceDetailsById,
    deleteTrip: deleteTripReducer,
    inviteUser: inviteUserReducer,
    editInsurance: editPurchaseReducer,
    consent: consentReducer,
    airportSearch: airportSearchReducer,
    setConsent: setConsentReducer,
    searchFlightThroughAirport: searchFlightThroughAirportReducer,
    deleteJourney: deleteJourneyReducer,
    leaveJourney: LeaveJourneyReducer,
    deleteDocument: deleteDocumentReducer,
    featuredEntries: FeaturedEntriesReducer,
    timelineEntries: TimelineEntriesReducer,
    feedCache: FeedCacheReducer,
    notificationListCache: notificationListCacheReducer,
    countryInfo: countryInformationReducer,
    providerDetails: providerDetailsReducer,
    feedbackRequest: feedbackReducer,
    chatReducer: chatReducer,
    unreadTimelineCount: unreadTimelineCountReducer,
    inviteJourney: inviteJourney
  });

  return configureStore(rootReducer, rootSaga);
};
