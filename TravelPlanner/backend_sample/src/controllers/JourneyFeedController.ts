import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { HttpStatusCode } from '../shared/http-status-codes';
import { ResponseBuilder } from '../shared/response-builder';
import httpErrors from 'http-errors';
import * as JourneyFeedModel from '../shared/JourneyFeedDataAccess'
import * as FeaturedEntries from '../shared/FeaturedEntries'
import * as TimelineEntryModel from '../shared/TimelineEntryDataAccess'
import * as UserModel from '../shared/UserDataAccess'
import { InsuranceUpdated } from "../classes/InsuranceUpdate";
import { DocumentsUpdated } from '../classes/DocumentsUpdate';
import { ProfileUpdated } from "../classes/ProfileUpdate";
import { MessagePublished } from "../classes/MessagePublish";
import { JourneyFeed } from '../classes/JourneyCreated';
import { AddedParticipant } from "../classes/ParticipantAdded";
import { TripData } from "../classes/TripData";
import { Alert } from "../classes/Alert";


export class JourneyFeedController {
  public eventController = async (event) => {
    console.log('Event to be processed');
    console.log(event);
    switch (event['detail-type']) {
      case "AlertUpdated":
        let updateAlert: Alert = new Alert(event.detail.alert_data, event.detail.event_time);
        console.log('Journey Alert will be updated sending data to update it');
        console.log(updateAlert);
        await TimelineEntryModel.updateAlert(updateAlert);
        break;
      case "AlertCreated":
        let createAlert: Alert = new Alert(event.detail.alert_data, event.detail.event_time);
        console.log('Journey Alert will be Created sending data to create it');
        console.log(createAlert);
        await TimelineEntryModel.createAlert(createAlert);
        break;
      case "FlightAlertCreated":
        let flightAlertCreated: Alert = new Alert(event.detail.alert_data, event.detail.event_time);
        console.log('Flight Alert will be Created sending data to create it');
        console.log(flightAlertCreated);
        await TimelineEntryModel.createFlightAlert(flightAlertCreated);
        break;
      case "FlightAlertUpdated":
        let flightAlertUpdated: Alert = new Alert(event.detail.alert_data, event.detail.event_time);
        console.log('Flight Alert will be Updated sending data to update it');
        console.log(flightAlertUpdated);
        await TimelineEntryModel.updateFlightAlert(flightAlertUpdated);
        break;
      case "InsurancesUpdated":
        let insuranceCount: number;
        let userId: string = event.detail.user_id;
        console.log('insurance update event found');
        console.log(event.detail);
        console.log("update event found for user");
        console.log(userId);
        if (event.detail.after.hasOwnProperty("insurances") && event.detail.after.insurances.length > 0) {
          console.log("count of insurance");
          console.log(event.detail.after.insurances.length);
          insuranceCount = event.detail.after.insurances.length
        } else {
          console.log("there are no insurances so we will suggest user to add insurance");
          insuranceCount = 0
        }
        let insuranceUpdate: InsuranceUpdated = new InsuranceUpdated(event.detail.event_time, insuranceCount, userId);
        await UserModel.updateInsuranceState(insuranceUpdate);
        break;
      case "UserDocumentsUpdated":
          let documentsCount: number;
          let userID: string = event.detail.user_id;
          console.log('documents update event found');
          console.log(event.detail);
          console.log("documents update event found for user");
          console.log(userID);
          if (event.detail.after.hasOwnProperty("documents") && event.detail.after.documents.length > 0) {
            console.log("count of documents");
            console.log(event.detail.after.documents.length);
            documentsCount = event.detail.after.documents.length
          } else {
            console.log("there are no documents so we will suggest user to add documents");
            documentsCount = 0
          }
          let documentsUpdate: DocumentsUpdated = new DocumentsUpdated(event.detail.event_time, documentsCount, userID);
          await UserModel.updateDocumentsCount(documentsUpdate);
          break;
      case "UserProfileUpdated":
        let UserId: string = event.detail.user_id;
        let suggestProfileUpdate: boolean;
        console.log('profile update event found');
        console.log(event.detail);
        console.log("update event found for user");
        console.log(UserId);
        if ((event.detail.after.hasOwnProperty("full_name")) && (event.detail.after.full_name != "" && event.detail.after.full_name !== null)) {
          console.log("user has filled profile name");
          console.log(event.detail.after.full_name);
          suggestProfileUpdate = false;
        } else {
          console.log("profile name is not set");
          suggestProfileUpdate = true;
        }
        let profileUpdate: ProfileUpdated = new ProfileUpdated(event.detail.event_time, suggestProfileUpdate, UserId, event.detail.after.preferred_langauge);
        await UserModel.updateProfileState(profileUpdate);
        break;
      case "CustomMessagePublished":
        console.log('custom message event found');
        console.log(event.detail);
        let messagePublished: MessagePublished = new MessagePublished(event.time, event.detail.payload, event.detail.journey_id, event.detail.user_id);
        console.log('message to publish');
        console.log(messagePublished);
        await TimelineEntryModel.publishMessage(messagePublished);
        break;
      case "ParticipantAdded":
      case "ParticipantUpdated":
      case "ParticipantRemoved":
        let participants = event.detail.after.journeyData.participants;
        console.log('Participant added and we will create feed for participant');
        console.log(participants);
        let tripDetail;
        tripDetail = event.detail.after.trips || [];
        if (tripDetail.length > 0) {
          console.log(' trip details found');
          console.log(tripDetail);
          tripDetail.forEach((trip, key) => {
            tripDetail[key] = {
              TripID: trip.trip_id,
              TripTitle: trip.title,
              TripType: trip.trip_type,
              Departure: JSON.parse(trip.departure),
              Destinaton: JSON.parse(trip.destination),
              StartDate: trip.start_time
            };
            if (trip.trip_type === 'container') {
              tripDetail[key].ResourceType = trip.vehicle_info.subResourceType;
              tripDetail[key].ResourceName = trip.vehicle_info.name;
            }
          });
        }
        console.log(tripDetail);
        for (let i = 0; i < participants.length; i++) {
          let addedParticipant: AddedParticipant = new AddedParticipant(participants[i], event.detail.after.journeyData, event.detail.event_time, tripDetail);
          console.log('Data to be send for creating feed for newly added participant');
          console.log(addedParticipant);
          await JourneyFeedModel.addParticipant(addedParticipant);
        }
        break;
      case "JourneyCreated":
        let body = event.detail!;
        let journeyFeed: JourneyFeed = new JourneyFeed(body.after.journeyData.journey_id, body.created_by, event.detail.event_time);
        console.log('Journey created so we will create feed based on journey passing data to create journey feed');
        console.log(journeyFeed);
        await JourneyFeedModel.saveJourneyFeed(journeyFeed);
        break;
      case "TripUpdated":
      case "TripAdded":
      case "TripDeleted":
        const journeyParticipants = event.detail.after.journeyData.participants;
        let tripDetails;
        let computed = event.detail.after.journeyData.computed || {};
        tripDetails = event.detail.after.trips || [];
        console.log('Updated trip details found');
        console.log(tripDetails);
        if (tripDetails.length > 0) {
          tripDetails.forEach(async (trip, key) => {
            tripDetails[key] = {
              TripID: trip.trip_id,
              TripTitle: trip.title,
              TripType: trip.trip_type,
              Departure: JSON.parse(trip.departure),
              Destinaton: JSON.parse(trip.destination),
              StartDate: trip.start_time
            };
            if (trip.trip_type === 'container') {
              tripDetails[key].ResourceType = trip.vehicle_info.subResourceType;
              tripDetails[key].ResourceName = trip.vehicle_info.name;
            }
          });
        }
        for (let i = 0; i < journeyParticipants.length; i++) {
          let tripData: TripData = new TripData(journeyParticipants[i]._id, event.detail.after.journeyData.journey_id, tripDetails, event.detail.event_time,computed,journeyParticipants[i]['isAdmin'] );
          console.log('Trip details to be send for adding on journey feed of users');
          console.log(tripData);
          await JourneyFeedModel.addTripData(tripData);
        }
        break;
    }

  };
  public getFeaturedEntries: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context): Promise<APIGatewayProxyResult> => {
    let parameters = event.pathParameters || {};
    let userId: string | undefined = parameters!.userId;
    let journeyId: string | undefined = parameters!.journeyId;
    let username = event.requestContext.authorizer!.jwt.claims.sub;
    let data: object;
    if (userId !== username || !userId) {
      console.error('User not matched');
      throw new httpErrors.Forbidden("User not matched");
    }
    if (!journeyId) {
      console.error('journeyId missing');
      throw new httpErrors.BadRequest("journeyId missing");
    }
    console.log('Getting featured entries for user');
    console.log(userId);
    let feed = JourneyFeedModel.getFeed(journeyId, userId);
    let user = UserModel.getUserInfo(userId);
    let feedPromise = await Promise.all([feed, user]);
    console.log(feedPromise);
    console.log('Feed fetched from table');
    console.log(feedPromise[0]);
    if (!feedPromise[0].hasOwnProperty("Item")) {
      console.error('Matching journey Feed not found');
      throw new httpErrors.BadRequest("Matching journey Feed not found");
    }
    if (feedPromise[0].Item.hasOwnProperty("TripDetails") && feedPromise[0].Item.TripDetails.length > 0) {
      let currentDate = new Date();
      let Trips = feedPromise[0].Item.TripDetails.sort((a, b) => (a.StartDate > b.StartDate) ? 1 : ((b.StartDate > a.StartDate) ? -1 : 0))
      if (currentDate.toISOString() > Trips[Trips.length - 1].StartDate) {
        console.log('journey is expired no featured entries will be shown');
        data = {
          meta: {
            "response_code": HttpStatusCode.NoData,
            "message": "No Featured entries found"
          }
        }
        return ResponseBuilder.custom(data, HttpStatusCode.NoData);
      }
    }
    let featuredEntries = await FeaturedEntries.handleFeaturedEntries(feedPromise[0], feedPromise[1], context);
    if (!(featuredEntries.length > 0)) {
      console.log('No featured entries found');
      data = {
        meta: {
          "response_code": HttpStatusCode.NoData,
          "message": "No Featured entries found"
        }
      }
      return ResponseBuilder.custom(data, HttpStatusCode.NoData);
    }
    console.log('featured entries found');
    console.log(featuredEntries);
    data = {
      meta: {
        "response_code": HttpStatusCode.Ok,
        "message": "Featured entries retrieved successfully"
      },
      data: featuredEntries
    };
    return ResponseBuilder.custom(data, HttpStatusCode.Ok);

  }
  public getTimelineEntries: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context): Promise<APIGatewayProxyResult> => {
    let parameters = event.pathParameters || {};
    let userId: string | undefined = parameters!.userId;
    let journeyId: string | undefined = parameters!.journeyId;
    let username = event.requestContext.authorizer!.jwt.claims.sub;
    let queryParameters = event.queryStringParameters || {};
    if (!queryParameters || !queryParameters.limit) {
      console.error('please specify limit');
      throw new httpErrors.BadRequest("please specify limit");
    }
    if (isNaN(+queryParameters.limit)) {
      console.error('limit should be numeric value');
      throw new httpErrors.BadRequest("limit should be numeric value");
    }
    if (+queryParameters.limit > 50) {
      console.error('limit should not be greater than 50');
      throw new httpErrors.BadRequest("limit should not be greater than 50");
    }
    if (userId !== username || !userId) {
      console.error('User not matched');
      throw new httpErrors.Forbidden("User not matched");
    }
    if (!journeyId) {
      console.error('journeyId missing');
      throw new httpErrors.BadRequest("journeyId missing");
    }
    console.log('Getting timeline entries for user');
    console.log(userId);
    let timelineEntries: object[] = [];
    let data: any;
    let timelines = await TimelineEntryModel.getTimelines(journeyId, userId, queryParameters);
    if (!(timelines.Count > 0)) {
      console.log('No timelines found');
      data = {
        meta: {
          "response_code": HttpStatusCode.NoData,
          "message": "No timeline entries found"
        }
      }
      return ResponseBuilder.custom(data, HttpStatusCode.NoData);
    }
    let Timelines = timelines.Items.sort((a, b) => (a.Modified_at > b.Modified_at) ? -1 : ((b.Modified_at > a.Modified_at) ? 1 : 0));
    Timelines.forEach((timeline, key) => {
      timelineEntries[key] = {
        timeline_entry_id: timeline.TimelineEntryId,
        from_translations: false,
        alert: timeline.Alert,
        title: timeline.Title,
        sub_title: timeline.SubTitle,
        image: timeline.Image,
        link_text: timeline.LinkText,
        screen: timeline.Screen,
        color: timeline.Color,
        description: timeline.Description,
        type: timeline.Type,
        flight_identifier: timeline.FlightIdentifier,
        is_read: timeline.IsRead,
        priority: timeline.Priority,
        category: timeline.Category,
        created_at: timeline.Created_at,
        modified_at: timeline.Modified_at
      };
    });
    console.log(' timelines entries found');
    console.log(timelineEntries);
    data = {
      meta: {
        "reponse_code": HttpStatusCode.Ok,
        "message": "Timeline entries retrieved successfully"
      },
      data: timelineEntries
    };
    return ResponseBuilder.custom(data, HttpStatusCode.Ok);
  };
  public readTimelineEntries: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context): Promise<APIGatewayProxyResult> => {
    let parameters = event.pathParameters || {};
    let userId: string | undefined = parameters!.userId;
    let journeyId: string | undefined = parameters!.journeyId;
    let username = event.requestContext.authorizer!.jwt.claims.sub;
    if (userId !== username || !userId) {
      console.error('User not matched');
      throw new httpErrors.Forbidden("User not matched");
    }
    if (!journeyId) {
      console.error('journeyId missing');
      throw new httpErrors.BadRequest("journeyId missing");
    }
    console.log('marking timelines as read for user');
    console.log(userId);
    let body = JSON.parse(event.body!) || {};
    let timelineIds = body.timeline_ids;
    let data: any;
    if (!timelineIds || !(timelineIds.length > 0)) {
      throw new httpErrors.BadRequest("timeline ids is required");
    }
    for (let i = 0; i < timelineIds.length; i++) {
      console.log('timeline entry id which will be marked as read');
      console.log(timelineIds[i]);
      await TimelineEntryModel.readTimelines(journeyId, userId, timelineIds[i]);
    }
    data = {
      meta: {
        "reponse_code": HttpStatusCode.Accepted,
        "message": "Timeline entries marked as read successfully"
      }
    };
    return ResponseBuilder.custom(data, HttpStatusCode.Accepted);
  };
}
