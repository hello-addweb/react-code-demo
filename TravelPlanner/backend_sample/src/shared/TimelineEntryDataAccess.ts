import { Alert } from "../classes/Alert";
import { Timelines } from "../classes/Timelines";
import { MessagePublished } from "../classes/MessagePublish";
const uuid = require('uuid');
import { TimelineEntryEntity } from "./DatabaseDefinitions";

export async function createFlightAlert(Alert: Alert) {
  const alertData = Alert.alertData;
  const journeyId = alertData['journey_id'];
  const userId = alertData['user_id'];
  let item = {
    JourneyId: journeyId,
    UserId: userId,
    TimelineEntryId: alertData['alert_id'],
    Alert: alertData['notification_message'],
    FlightIdentifier: alertData['FlightIdentifier'],
    Description: alertData['body'],
    Type: 'FLIGHT_UPDATE',
    IsRead: false,
    TimelineOplock: Alert.eventTime,
    Created_at: new Date().toISOString(),
    Modified_at: new Date().toISOString()
  }
  console.log('flight alert to be store');
  console.log(item);
  await TimelineEntryEntity.put(item);
}

export async function publishMessage(MessagePublished: MessagePublished) {
  const journeyId = MessagePublished.journeyId;
  console.log('journey id');
  console.log(journeyId);
  const userId = MessagePublished.userId;
  console.log('user id');
  let color;
  if (MessagePublished.payload['type'] === 'DARK_CARD') {
    color = '#313131';
  } else {
    color = '#989191';
  }
  console.log(userId);
  let item = {
    JourneyId: journeyId,
    UserId: userId,
    TimelineEntryId: uuid.v1(),
    Title: MessagePublished.payload['title'],
    SubTitle: MessagePublished.payload['subtitle'],
    Image: MessagePublished.payload['image'],
    Description: MessagePublished.payload['description'],
    LinkText: MessagePublished.payload['linktext'],
    Screen: MessagePublished.payload['screen'],
    Type: MessagePublished.payload['type'],
    Color: color,
    IsRead: false,
    TimelineOplock: MessagePublished.eventTime,
    Created_at: new Date().toISOString(),
    Modified_at: new Date().toISOString()
  }
  console.log('published message to store');
  console.log(item);
  await TimelineEntryEntity.put(item);
}

export async function updateFlightAlert(Alert: Alert) {
  const alertData = Alert.alertData;
  const journeyId = alertData['journey_id'];
  const userId = alertData['user_id'];
  const alertId = alertData['alert_id'];
  let item = {
    JourneyId: journeyId,
    UserId: userId,
    TimelineEntryId: alertId,
    Alert: alertData['notification_message'],
    FlightIdentifier: alertData['FlightIdentifier'],
    Description: alertData['body'],
    IsRead: false,
    TimelineOplock: Alert.eventTime,
    Modified_at: Alert.eventTime
  }
  console.log('flight alert to be updated');
  console.log(item);
  try {
    await TimelineEntryEntity.update(item, {
      conditions: [
        { exists: false, attr: "TimelineOplock" },
        { or: true, attr: 'TimelineOplock', lt: Alert.eventTime }
      ]
    });
  } catch (err) {
    if (err.code !== "ConditionalCheckFailedException") {
      console.error('error while updating flight alert');
      console.error(err);
      throw err;
    }
  }
}
export async function readTimelines(journeyId: string, userId: string, timelineId: string) {
  let item = {
    JourneyId: journeyId,
    UserId: userId,
    TimelineEntryId: timelineId,
    IsRead: true
  }
  console.log('Timeline entry to mark as read');
  console.log(item);
  await TimelineEntryEntity.update(item);
}
export async function getTimelines(journeyId: string, userId: string, queryParameters: any) {
  let timelineID: string = queryParameters.timeline_id;
  let createdAt: string = queryParameters.created_at;
  let modifiedAt: string = queryParameters.modified_at;
  let filter: string[];
  let limit = Number(queryParameters.limit);
  if (!queryParameters.filter || queryParameters.filter === null) {
    console.log('Request received from previous version of app (earlier than Jul/22)');  
    console.log('User id');
    console.log(userId);  
    limit = 15;    
    filter = ['JOURNEY_ALERT', 'FLIGHT_UPDATE'];
  } else {
    filter = queryParameters.filter.split(",");
  }
  console.log("filter according to");
  console.log(filter);
  let exStartKey: any;
  if (!timelineID || !createdAt || !modifiedAt) {
    exStartKey = null
  }
  else {
    exStartKey = {
      PK: `JOURNEY#${journeyId}#USER#${userId}#TIMELINE_ENTRY#${timelineID}`,
      SK: `METADATA#${timelineID}`,
      GSI1_PK: `JOURNEY#${journeyId}#USER#${userId}`,
      GSI1_SK: `TIMELINE_ENTRY#${createdAt}#${modifiedAt}`
    };
  }
  console.log('exclusive start key');
  console.log(exStartKey);
  const result = await TimelineEntryEntity.query(`JOURNEY#${journeyId}#USER#${userId}`, {
    limit: limit,
    index: 'GSI1',
    reverse: true,
    filters: { attr: 'Type', in: filter },
    startKey: exStartKey
  }
  );
  console.log('result of query');
  console.log(result);
  return result;
}
export async function getTimelinesCount(Timelines: Timelines) {
  const result = await TimelineEntryEntity.query(`JOURNEY#${Timelines.journeyId}#USER#${Timelines.userId}`, {
    index: 'GSI1'
  });
  let unread = result.Items.filter(item => item.IsRead === false);
  let count = unread.length
  return count;
}

export async function createAlert(Alert: Alert) {
  const alertData = Alert.alertData;
  const journeyId = alertData['journey_id'];
  const userId = alertData['user_id'];
  let item = {
    JourneyId: journeyId,
    UserId: userId,
    TimelineEntryId: alertData['alert_id'],
    Alert: alertData['notification_message'],
    Description: alertData['description'],
    Type: 'JOURNEY_ALERT',
    IsRead: false,
    Category: alertData['category_name'],
    Priority: alertData['risk_level'],
    TimelineOplock: Alert.eventTime,
    Created_at: new Date().toISOString(),
    Modified_at: new Date().toISOString()
  }
  console.log('Alert to be created');
  console.log(item);
  await TimelineEntryEntity.put(item);
}

export async function updateAlert(Alert: Alert) {
  const alertData = Alert.alertData;
  const journeyId = alertData['journey_id'];
  const userId = alertData['user_id'];
  const alertId = alertData['alert_id'];
  let item = {
    JourneyId: journeyId,
    UserId: userId,
    TimelineEntryId: alertId,
    Alert: alertData['notification_message'],
    Description: alertData['description'],
    IsRead: false,
    Category: alertData['category_name'],
    Priority: alertData['risk_level'],
    TimelineOplock: Alert.eventTime,
    Modified_at: Alert.eventTime
  }
  console.log('Alert to be updated');
  console.log(item);
  try {
    await TimelineEntryEntity.update(item, {
      conditions: [
        { exists: false, attr: "TimelineOplock" },
        { or: true, attr: 'TimelineOplock', lt: Alert.eventTime }
      ]
    });
  } catch (err) {
    if (err.code !== "ConditionalCheckFailedException") {
      console.error('error while updating alert');
      console.error(err);
      throw err;
    }
  }
}