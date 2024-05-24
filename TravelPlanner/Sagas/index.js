import { takeLatest, all } from "redux-saga/effects";

//Redux actions
import { StartupTypes } from "App/Stores/Startup/Actions";
import { AppConfigTypes } from "App/Stores/AppConfig/Actions";
import { IntroTypes } from "App/Stores/IntroScreen/Actions";
import { NavigationTypes } from "App/Stores/Navigation/Actions";
import { LanguageTypes } from "App/Stores/Language/Actions";
import { ListJourneyTypes } from "App/Stores/Journey/ListJourney/Actions";
import { CreateJourneyTypes } from "App/Stores/Journey/CreateJourney/Actions";
import { JourneyTypes } from "App/Stores/Journey/Journey/Actions";
import { UpdateJourneyTypes } from "App/Stores/Journey/UpdateJourney/Actions";
import { UserTypes } from "App/Stores/UserStore/User/Actions";
import { ProfileTypes } from "App/Stores/UserStore/UpdateProfile/Actions";
import { DocumentUploadTypes } from "App/Stores/Documents/DocumentUpload/Actions";
import { FetchDocumentTypes } from "App/Stores/Documents/FetchDocument/Actions";
import { DownloadDocumentTypes } from "App/Stores/Documents/DownloadDocument/Actions";
import { DocumentDeleteTypes } from "App/Stores/Documents/DocumentDelete/Actions";
import { JourneyDetailTypes } from "App/Stores/Journey/JourneyDetail/Actions";
import { EditJourneyTypes } from "App/Stores/Journey/EditJourney/Actions";
import { WeatherDetailTypes } from "../Stores/Journey/Weather/Actions";
import { ListNotificationTypes } from "App/Stores/Notification/Actions";

import { FlightNotificationTypes } from "App/Stores/FlightNotification/Actions";
import { FlightNotificationDetailTypes } from "../Stores/FlightNotificationDetail/Actions";

import { SearchFlightThroughAirportTypes } from "../Stores/Journey/SearchFlightThrowAirport/Actions";

import { AddResourceTypes } from "App/Stores/Journey/AddResource/Actions";
import { PreCacheTypes } from "App/Stores/PreCache/Actions";
import { FlightDetailTypes } from "App/Stores/Journey/FlightDetail/Actions";
import { airportSearchTypes } from "../Stores/Journey/AirportSearch/Actions";
import { insuranceListTypes } from "../Stores/Insurance/getInsuranceList/Actions";
import { FeaturedEntriesTypes } from '../Stores/Journey/featuredEntries/Actions'
import { FeedCacheTypes } from '../Stores/Journey/FeedCache/Actions'
import { TimelineEntriesTypes } from '../Stores/Journey/timelineEntries/Actions'
import { userInsuranceInfoTypes } from "../Stores/Insurance/userInsuranceInfo/Actions";
import { purchasedInsuranceTypes } from "../Stores/Insurance/purchasedInsurance/Actions";
import { deleteInsuranceTypes } from "../Stores/Insurance/deleteInsurance/Actions";

import { deleteTripTypes } from "../Stores/Journey/deleteTrip/Actions";

import { inviteUserTypes } from "../Stores/Journey/inviteUser/Actions";

import { editPurchasedInsuranceTypes } from "../Stores/Insurance/editInsurance/Actions";
import { addInsuranceCompanyTypes } from "../Stores/Insurance/addInsurenceCompany/Actions";
import { insuranceDetailsByIdListTypes } from "../Stores/Insurance/insuranceDetailsById/Actions";

import { consentTypes } from "../Stores/Consent/Actions";
import { setConsentTypes } from "../Stores/setConsent/Actions";
import { deleteJourneyTypes } from "../Stores/Journey/deleteJourney/Actions";
import { leaveJourneyTypes } from "../Stores/Journey/LeaveJourney/Actions";
import { NotificationListCacheTypes } from '../Stores/NotificationCache/Actions';

import { countryInformationTypes } from '../Stores/Journey/CountryInformation/Actions';
import { providerDetailsTypes } from '../Stores/Journey/ProviderDetails/Actions';

import { addFeedBackTypes } from '../Stores/FeedBack/Actions';

import { unreadTimelineCountTypes } from '../Stores/Journey/UnreadTimelineCount/Actions';

import { InitiateChannelTypes } from '../Stores/ChatStore/Actions';

import { inviteJourneyTypes } from '../Stores/Journey/InviteJourney/Actions'

//Saga functions

import {
  searchFlight,
  airportSearch,
  SearchFlightThroughAirport
} from "./FlightDetail";
import { startup, setLanguage } from "./StartupSaga";
import { setAppConfig, doLogout } from "./AppConfig";
import { fetchIntro } from "./IntroSaga";
import { goToPage } from "./NavigationSaga";
import { fetchLanguages } from "./LanguageSaga";
import {
  fetchListJourney,
  CreateJourney,
  UpdateJourney,
  cleanCreateJourney,
  cleanUpdateJourney,
  cleanResponceJournyData,
  journeyDetail,
  cleanJourneyDetail,
  SaveEditData,
  editJourney,
  cleanEditJourney,
  addResource,
  getGlobalImages,
  uploadImage,
  deleteTrip,
  inviteUser,
  journeyDetailRefresh,
  deleteJourney,
  leaveJourney,
  SetLocalJourney,
  featuredEntries,
  timelineEntries,
  moreTimelineEntries,
  clearTimelineEntries,
  clearFeaturedEntries,
  readTimelineEntries,
  feedCachedData,
  countryInformation,
  countryName,
  providerDetails,
  googlePlaceData,
  getUnreadTimelineCount,
  ResendInviteLink
} from "./JourneySaga";
import { fetchProfile, updateProfile, uoloadImage,deleteUser } from "./UserSaga";
import { weatherDetail } from "./WeatherSaga";
import {
  documentUpload,
  fetchDocument,
  downloadDocument,
  deleteDocument
} from "./DocumentSaga";
import {
  fetchListNotification,
  cleanNotificationCount,
  setDeviceToken,
  setPushNotification,
  moreFetchListNotification,
  cacheNotificationListData,
  getNotificationDetailsById
} from "./NotificationSaga";
import { fetchFlightNotification } from "./FlightNotificationSaga";
import {fetchFlightNotificationDetail} from "./FlightNotificationDetailSaga";
import { fetchCacheData, cleanCachedData } from "./PreCache";

import {
  insuranceList,
  userInsuranceInfo,
  purchasedInsurance,
  addInsuranceCompany,
  editPurchasedInsurance,
  insuranceDetailsById,
  deleteInsurance
} from "./Insurance";

import { addFeedBack } from "./Feedback"

import { getConsent, setConsentData } from "./Consent";

import { initiateChannel } from "./ChatSaga"

export default function* root() {
  yield all([
    takeLatest(StartupTypes.SET_LANGUAGE, setLanguage),
    takeLatest(StartupTypes.STARTUP, startup),

    takeLatest(AppConfigTypes.SET_APP_CONFIG, setAppConfig),
    takeLatest(AppConfigTypes.DO_LOGOUT, doLogout),

    takeLatest(IntroTypes.FETCH_INTRO, fetchIntro),
    takeLatest(NavigationTypes.GO_TO_PAGE, goToPage),
    takeLatest(LanguageTypes.FETCH_LANGUAGES, fetchLanguages),
    takeLatest(ListJourneyTypes.FETCH_LIST_JOURNEY, fetchListJourney),
    takeLatest(UpdateJourneyTypes.UPDATE_JOURNEY, UpdateJourney),
    takeLatest(UpdateJourneyTypes.CLEAN_UPDATE_JOURNEY, cleanUpdateJourney),

    takeLatest(JourneyDetailTypes.JOURNEY_DETAIL, journeyDetail),
    takeLatest(JourneyDetailTypes.JOURNEY_DETAIL_REFRESH, journeyDetailRefresh),

    takeLatest(JourneyDetailTypes.CLEAN_JOURNEY_DETAIL, cleanJourneyDetail),

    takeLatest(WeatherDetailTypes.WEATHER_DETAIL, weatherDetail),

    takeLatest(DocumentUploadTypes.DOCUMENT_UPLOAD, documentUpload),
    takeLatest(FetchDocumentTypes.FETCH_DOCUMENT, fetchDocument),
    takeLatest(DownloadDocumentTypes.DOWNLOAD_DOCUMENT, downloadDocument),

    takeLatest(CreateJourneyTypes.CREATE_JOURNEY, CreateJourney),
    takeLatest(CreateJourneyTypes.CLEAN_CREATE_JOURNEY, cleanCreateJourney),
    takeLatest(
      CreateJourneyTypes.CLEAN_CREATE_JOURNEY,
      cleanResponceJournyData
    ),
    takeLatest(CreateJourneyTypes.GET_GLOBAL_IMAGES, getGlobalImages),
    takeLatest(CreateJourneyTypes.UPLOAD_IMAGE, uploadImage),

    takeLatest(JourneyTypes.SET_JOURNEY, SetLocalJourney),

    takeLatest(UserTypes.FETCH_PROFILE, fetchProfile),
    takeLatest(UserTypes.USER_DELETE, deleteUser),

    takeLatest(ProfileTypes.UPDATE_PROFILE, updateProfile),
    takeLatest(ProfileTypes.UOLOAD_IMAGE, uoloadImage),

    takeLatest(EditJourneyTypes.EDIT_JOURNEY, editJourney),
    takeLatest(EditJourneyTypes.SAVE_EDIT_DATA, SaveEditData),
    takeLatest(EditJourneyTypes.CLEAN_EDIT_JOURNEY, cleanEditJourney),

    /*------------------Notification----------------------------*/
    takeLatest(ListNotificationTypes.SET_DEVICE_TOKEN, setDeviceToken),
    takeLatest (NotificationListCacheTypes.NOTIFICATION_LIST_CACHE,cacheNotificationListData),
    takeLatest(
      ListNotificationTypes.FETCH_LIST_NOTIFICATION,
      fetchListNotification
    ),
    takeLatest(
      ListNotificationTypes.MORE_FETCH_LIST_NOTIFICATION,
      moreFetchListNotification
    ),
    takeLatest(
      ListNotificationTypes.GET_NOTIFICATION_DETAILS_BY_ID,
      getNotificationDetailsById
    ),
    takeLatest(
      ListNotificationTypes.CLEAN_NOTIFICATION_COUNT,
      cleanNotificationCount
    ),
    takeLatest(
      ListNotificationTypes.SET_PUSH_NOTIFICATION,
      setPushNotification
    ),

    takeLatest(
      FlightNotificationTypes.FETCH_FLIGHT_NOTIFICATION,
      fetchFlightNotification
    ),

    takeLatest(
      FlightNotificationDetailTypes.FETCH_FLIGHT_NOTIFICATION_DETAIL,
      fetchFlightNotificationDetail
    ),

    /*------------------AddResource----------------------------*/
    takeLatest(AddResourceTypes.ADD_RESOURCE, addResource),

    /*------------------PreCache----------------------------*/
    takeLatest(PreCacheTypes.FETCH_CACHE_DATA, fetchCacheData),
    takeLatest(PreCacheTypes.CLEAN_CACHED_DATA, cleanCachedData),

    takeLatest(FlightDetailTypes.SEARCH_FLIGHT, searchFlight),

    takeLatest(airportSearchTypes.AIRPORT_SEARCH, airportSearch),

    /*------------------insurance----------------------------*/
    takeLatest(insuranceListTypes.INSURANCE_LIST, insuranceList),
    takeLatest(FeaturedEntriesTypes.FEATURED_ENTRIES, featuredEntries),
    takeLatest(FeaturedEntriesTypes.CLEAR_FEATURED_ENTRIES,clearFeaturedEntries),
    takeLatest(FeedCacheTypes.FEED_CACHE,feedCachedData),
    takeLatest(TimelineEntriesTypes.TIMELINE_ENTRIES,timelineEntries),

    takeLatest(TimelineEntriesTypes.MORE_TIMELINE_ENTRIES,moreTimelineEntries),
    takeLatest(TimelineEntriesTypes.CLEAR_TIMELINE_ENTRIES,clearTimelineEntries),
    takeLatest(TimelineEntriesTypes.READ_TIMELINE_ENTRIES,readTimelineEntries),
    takeLatest(userInsuranceInfoTypes.USER_INSURANCE_INFO, userInsuranceInfo),
    takeLatest(purchasedInsuranceTypes.PURCHASED_INSURANCE, purchasedInsurance),
    takeLatest(deleteInsuranceTypes.DELETE_INSURANCE, deleteInsurance),
    takeLatest(
      addInsuranceCompanyTypes.ADD_INSURANCE_COMPANY,
      addInsuranceCompany
    ),
    takeLatest(
      editPurchasedInsuranceTypes.EDIT_PURCHASED_INSURANCE,
      editPurchasedInsurance
    ),
    takeLatest(insuranceDetailsByIdListTypes.INSURANCE_DETAILS_BY_ID_LIST, insuranceDetailsById
    ),

    takeLatest(deleteTripTypes.DELETE_TRIP, deleteTrip),

    takeLatest(inviteUserTypes.INVITE_USER, inviteUser),

    takeLatest(consentTypes.GET_CONSENT, getConsent),
    takeLatest(setConsentTypes.SET_CONSENT_DATA, setConsentData),

    takeLatest(
      SearchFlightThroughAirportTypes.SEARCH_FLIGHT_THROUGH_AIRPORT,
      SearchFlightThroughAirport
    ),

    takeLatest(
      addFeedBackTypes.ADD_FEED_BACK,
      addFeedBack
    ),

    /*------------------ delete journey ----------------------------*/
    takeLatest(deleteJourneyTypes.DELETE_JOURNEY, deleteJourney),

    /*------------------ delete journey ----------------------------*/
    takeLatest(leaveJourneyTypes.LEAVE_JOURNEY, leaveJourney),

    /*------------------ delete document ----------------------------*/
    takeLatest(DocumentDeleteTypes.DOCUMENT_DELETE, deleteDocument),

    /*------------------ country information ----------------------------*/
    takeLatest(countryInformationTypes.COUNTRY_INFORMATION, countryInformation),
    takeLatest(countryInformationTypes.COUNTRY_NAME, countryName),

    /*------------------ provider details ----------------------------*/
    takeLatest(providerDetailsTypes.PROVIDER_DETAILS, providerDetails),

    /*------------------ google place data ----------------------------*/
    takeLatest(providerDetailsTypes.GOOGLE_PLACE_DATA, googlePlaceData),

    /*------------------ stream chat ----------------------------*/
    takeLatest(InitiateChannelTypes.INITIATE_CHANNEL, initiateChannel),
    takeLatest(unreadTimelineCountTypes.UNREAD_TIMELINE_COUNT, getUnreadTimelineCount),

    /*------------------ Invite User in journey ----------------------------*/
    takeLatest(inviteJourneyTypes.INVITE_JOURNEY, ResendInviteLink)
  ]);
}
