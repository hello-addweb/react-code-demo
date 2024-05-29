const { Table, Entity } = require('dynamodb-toolbox')

const DynamoDB = require('aws-sdk/clients/dynamodb');
const DocumentClient = new DynamoDB.DocumentClient()

export const journeyFeedTable = new Table({
  // Specify table name (used by DynamoDB)
  name: 'JourneyFeedServiceTable',

  // Define partition and sort keys
  partitionKey: 'PK',
  sortKey: 'SK',
  indexes: {
    GSI1: { partitionKey: 'GSI1_PK', sortKey: 'GSI1_SK' }
  },
  // Add the DocumentClient
  DocumentClient
})
export const journeyFeedEntity = new Entity({
  name: 'JOURNEY_FEED',
  attributes: {
    PK: { partitionKey: true, hidden: true, default: (data) => `JOURNEY#${data.JourneyId}` },
    SK: { sortKey: true, hidden: true, default: (data) => `USER#${data.UserId}` },
    GSI1_PK: { partitionKey: 'GSI1', hidden: true, default: (data) => `USER#${data.UserId}` },
    GSI1_SK: { sortKey: 'GSI1', hidden: true, default: (data) => `JOURNEY#${data.JourneyId}` },
    JourneyId: { required: true },
    UserId: { required: true },
    TripDetails: { type: 'list' },
    Computed: { type: 'map' },
    IsAdmin: { type: 'boolean' },
    Oplock: { type: 'string' },
    TripOplock: { type: 'string' },
    Visited: { type: 'boolean' },
    ParticipantOplock: { type: 'string' },
    BelongsToJourneyAdmin: { type: 'boolean' },
    ParticipantCount: { type: 'number' },
    UnreadTimelineEntriesCount: { type: 'number' },
  },
  table: journeyFeedTable
});
export const userEntity = new Entity({
  name: 'USER_ENTITY',
  attributes: {
    PK: { partitionKey: true, hidden: true, default: (data) => `USER#${data.UserId}` },
    SK: { sortKey: true, hidden: true, default: (data) => `USER#${data.UserId}` },
    GSI1_PK: { partitionKey: 'GSI1', hidden: true, default: (data) => `USER#${data.UserId}` },
    GSI1_SK: { sortKey: 'GSI1', hidden: true, default: (data) => `USER#${data.UserId}` },
    UserId: { required: true },
    PreferredLanguage: { type: 'string'},
    InsuranceCount: { type: 'number' },
    InsuranceOplock: { type: 'string' },
    DocumentsCount: { type: 'number' },
    DocumentsOplock: { type: 'string' },
    SuggestProfileUpdate: { type: 'boolean' },
    TimelineExplanationCount: { type: 'number' },
    ProfileOplock: { type: 'string' }
  },
  table: journeyFeedTable
});
export const TimelineEntryEntity = new Entity({
  name: 'TIMELINE_ENTRY',
  attributes: {
    PK: { partitionKey: true, hidden: true, default: (data) => `JOURNEY#${data.JourneyId}#USER#${data.UserId}#TIMELINE_ENTRY#${data.TimelineEntryId}` },
    SK: { sortKey: true, hidden: true, default: (data) => `METADATA#${data.TimelineEntryId}` },
    GSI1_PK: { partitionKey: 'GSI1', hidden: true, default: (data) => `JOURNEY#${data.JourneyId}#USER#${data.UserId}` },
    GSI1_SK: { sortKey: 'GSI1', hidden: true, default: (data) => `TIMELINE_ENTRY#${data.Created_at}#${data.Modified_at}` },
    Type: { type: 'string' },
    Title: { type: 'string' },
    SubTitle: { type: 'string' },
    LinkText: { type: 'string' },
    Image: { type: 'string' },
    Screen: { type: 'string' },
    Color: { type: 'string' },
    Alert: { type: 'string' },
    Description: { type: 'string' },
    JourneyId: { required: true },
    IsRead: { type: 'boolean' },
    UserId: { required: true },
    Category: { type: 'string' },
    FlightIdentifier: { type: 'map' },
    Priority: { type: 'string' },
    TimelineEntryId: { required: true },
    TimelineOplock: { type: 'string' },
    Created_at: { type: 'string' },
    Read_at: { type: 'string' },
    Modified_at: { type: 'string' }
  },
  table: journeyFeedTable
});