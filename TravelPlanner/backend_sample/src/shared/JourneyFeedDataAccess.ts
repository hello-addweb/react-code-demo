import { TripData } from "../classes/TripData";
import { JourneyFeed } from "../classes/JourneyCreated";
import { AddedParticipant } from "../classes/ParticipantAdded";
import { TimelineCount } from "../classes/TimelineCount";
import { journeyFeedEntity } from "./DatabaseDefinitions";

export async function addParticipant(AddedParticipant: AddedParticipant) {
  const participant = AddedParticipant.participant
  const JourneyData = AddedParticipant.journeyData;
  const journeyId = JourneyData['journey_id'];
  let participants = JourneyData['participants'];
  let participantCount = participants.length;
  let computed = JourneyData['computed'] || {};
  let isAdmin = participant['isAdmin'];
  const participantId = participant['_id'];
  let feed = await getFeed(journeyId, participantId);
  let visited = false;
  console.log("feed of participant");
  console.log(feed);
  if (feed.hasOwnProperty("Item") && feed.Item.hasOwnProperty("Visited")) {
    visited = feed.Item.Visited;
  }
  let item = {
    JourneyId: journeyId,
    UserId: participantId,
    ParticipantCount: participantCount,
    BelongsToJourneyAdmin: participant['isJourneyOwner'],
    Visited: visited,
    Computed: computed,
    IsAdmin: isAdmin,
    ParticipantOplock: AddedParticipant.eventTime,
    TripDetails: AddedParticipant.tripDetail
  }
  console.log('journey feed to stored for participant');
  console.log(item);
  try {
    await journeyFeedEntity.update(item, {
      conditions: [
        { exists: false, attr: "ParticipantOplock" },
        { or: true, attr: 'ParticipantOplock', lt: AddedParticipant.eventTime }
      ]
    })
  } catch (err) {
    if (err.code !== "ConditionalCheckFailedException") {
      console.log('error while adding participant');
      console.error(err);
      throw err;
    }
  }
}
export async function updateVisitState(journeyId: string, userId: string) {
  let item = {
    JourneyId: journeyId,
    UserId: userId,
    Visited: true
  }
  let response = await journeyFeedEntity.update(item)
}
export async function updateCounts(TimelineCount: TimelineCount) {
  let item = {
    JourneyId: TimelineCount.journeyId,
    UserId: TimelineCount.userId,
    UnreadTimelineEntriesCount: TimelineCount.count
  }
  console.log('journey feed where unread count to be updated');
  console.log(item);
  let response = await journeyFeedEntity.update(item);
}
export async function saveJourneyFeed(journeyFeed: JourneyFeed) {
  let item = {
    JourneyId: journeyFeed.id,
    UserId: journeyFeed.ownerId,
    ParticipantCount: 1,
    BelongsToJourneyAdmin: true,
    UnreadTimelineEntriesCount: 0,
    Visited: false,
    Oplock: journeyFeed.eventTime
  }
  console.log('journey feed to be stored');
  console.log(item);
  let response = await journeyFeedEntity.put(item)

}
export async function getFeed(journeyId: string, userId: string) {
  let item = {
    JourneyId: journeyId,
    UserId: userId,
  }
  let response = await journeyFeedEntity.get(item)
  return response;
}
export async function getFeedBatch() {
  let i: number = 0;
  let exclusiveStartKey: object | null = null;
  let items: any = [];
  while (true) {
    if ((i != 0) && (!exclusiveStartKey)) {
      console.log("breaking loop");
      break;
    }else {
      const result = await journeyFeedEntity.scan(
        {
          filters: { attr: 'entity', eq: 'JOURNEY_FEED' },
          startKey: exclusiveStartKey
        }
      );
      console.log('result of query');
      console.log(result);
      exclusiveStartKey = result.LastEvaluatedKey;
      console.log('start key');
      console.log(exclusiveStartKey);
      items = items.concat(result.Items)
      i++;
    }
  }
  console.log('items');
  console.log(items);
  return items;
}
export async function addTripData(TripData: TripData) {
  let item = {
    JourneyId: TripData.journeyId,
    UserId: TripData.participantId,
    TripDetails: TripData.tripDetails,
    TripOplock: TripData.eventTime,
    Computed: TripData.computed,
    IsAdmin:TripData.isAdmin,
  }
  console.log('journey feed to be updated with trip data');
  console.log(item);
  try {
    await journeyFeedEntity.update(item, {
      conditions: [
        { exists: false, attr: "TripOplock" },
        { or: true, attr: 'TripOplock', lt: TripData.eventTime }
      ]
    })
  } catch (err) {
    if (err.code !== "ConditionalCheckFailedException") {
      console.log('error while saving trip data');
      console.error(err);
      throw err;
    }
  }
}