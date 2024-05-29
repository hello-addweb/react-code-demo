import * as JourneyFeedModel from '../shared/JourneyFeedDataAccess'
import * as UserModel from '../shared/UserDataAccess'
import { FeaturedEntry } from "../classes/FeaturedEntryClass";
var moment = require("moment");
require('moment/locale/en-ca.js');
require('moment/locale/da.js');
const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");
const eventBridge = new EventBridgeClient();

export async function orangeCard(feed: any) {
    let fistVisit: object | null = null;
    if (feed.Item.hasOwnProperty("Visited") && feed.Item.Visited === false) {
        console.log('we will show first time visit card');
        fistVisit = {
            data: {
                fromTranslations: true,
                title: "JourneyFeed.featuredFirstVisitTitle",
                body: "JourneyFeed.featuredFirstVisitBody",
                linktext: "JourneyFeed.featuredFirstVisitLink",
                screen: "JourneyFeed.featuredFirstVisitScreen"
            },
            type: "orangeCard"
        };
        await JourneyFeedModel.updateVisitState(feed.Item.JourneyId, feed.Item.UserId);
        let eventData = {
            event_type: 'AutoEnableSettings',
            event_time: new Date().toISOString(),
            journey_id: feed.Item.JourneyId,
            user_id: feed.Item.UserId
        }
        console.log('we will send this first time event to event bridge');
        console.log('Event envelope');
        console.log(eventData);
        console.log('posting on event bus');
        console.log(process.env.EventBusName);
        let params = {
            Entries: [{
                EventBusName: process.env.EventBusName,
                Source: 'JorneyFeedService',
                DetailType: 'JourneyFeedVisitedFirstTime',
                Detail: JSON.stringify(eventData),
            }]
        }
        let command = new PutEventsCommand(params);
        await eventBridge.send(command);
        console.log('Event sent to Eventbridge');
    }
    return fistVisit;
}
export async function handleTimelineExplanationCount(user: any, finalFeaturedEntries: object[]) {
    for (let index = 0; index < finalFeaturedEntries.length; index++) {
        if (finalFeaturedEntries[index]['type'] === 'timeline_explanation') {
            let timelineExplanationCount: number = 0;
            if (user.Item.hasOwnProperty("TimelineExplanationCount")) {
                console.log('timeline explanation count');
                console.log(user.Item.TimelineExplanationCount);
                timelineExplanationCount = user.Item.TimelineExplanationCount
            }
            timelineExplanationCount++;
            console.log("new timeline explanation count");
            console.log(timelineExplanationCount);
            await UserModel.updateTimelineExplanationCount(user.Item.UserId, timelineExplanationCount);
        }
    }
}
export function addMoreTrip(feed: any, featuredEntry: object) {
    let addMoreTrip: object | null = null;
    if ((feed.Item.hasOwnProperty("BelongsToJourneyAdmin") && feed.Item.BelongsToJourneyAdmin === true) && (feed.Item.hasOwnProperty("TripDetails") && feed.Item.TripDetails.length > 0)) {
        let Trips = feed.Item.TripDetails;
        let containerCount: number = 0;
        for (let i = 0; i < Trips.length; i++) {
            if (Trips[i].TripType === 'container') {
                containerCount++;
            }
        }
        if (containerCount < 1) {
            addMoreTrip = new FeaturedEntry(featuredEntry);
            console.log('add more trip suggestion will be shown');
        }
    }
    return addMoreTrip;
}
export function addFlightTrip(feed: any, featuredEntry: object) {
    let addFlightTrip: object | null = null;
    if(feed.Item.hasOwnProperty("TripDetails")){
        for (let index = 0; index < feed.Item.TripDetails.length; index++) {
            if (feed.Item.hasOwnProperty("IsAdmin") && feed.Item.IsAdmin === true && feed.Item.TripDetails[index].TripType === "generic" && feed.Item.hasOwnProperty("Computed") && feed.Item.Computed.hasOwnProperty("countries") && feed.Item.Computed.countries.length > 1) {
                addFlightTrip = new FeaturedEntry(featuredEntry);
                console.log('add flight trip will be shown');
            }
        }
    }
    return addFlightTrip;
}
export function feedbackForm(featuredEntry: object) {
    let feedbackForm: FeaturedEntry = new FeaturedEntry(featuredEntry);
    console.log('feedback form will be shown');
    return feedbackForm;
}
export function assistanceSectionTeaser(feed: any, featuredEntry: object, assistanceSectionInterval: number) {
    let assitanceTeaser: object | null = null;
    if (feed.Item.hasOwnProperty("TripDetails") && feed.Item.TripDetails.length > 0) {
        let currentDate = moment();
        let inInvertal = false;
        let Trips = feed.Item.TripDetails.sort((a, b) => (a.StartDate > b.StartDate) ? 1 : ((b.StartDate > a.StartDate) ? -1 : 0));
        let startDate = moment(Trips[0].StartDate);
        let daysDiff = startDate.diff(currentDate, 'days');
        if ((Math.sign(daysDiff) === 1) && daysDiff < assistanceSectionInterval) {
            inInvertal = true;
        }
        if ((Trips[0].StartDate < currentDate.utc().format() && currentDate.utc().format() < Trips[Trips.length - 1].StartDate) || (inInvertal)) {
            assitanceTeaser = new FeaturedEntry(featuredEntry);
            console.log('assistance teaser will be shown');
        }
    }
    return assitanceTeaser;
}
export function countryInformation(feed: any, featuredEntry: object) {
    let countryInformation: object | null = null;
    if (feed.Item.hasOwnProperty("Computed") && feed.Item.Computed.hasOwnProperty("countries") && feed.Item.Computed.countries.length > 1) {
        countryInformation = new FeaturedEntry(featuredEntry);
        console.log('country information card will be shown');
    }
    return countryInformation;
}
export function assistanceProviderTeaser(feed: any, featuredEntry: object) {
    let assitanceProviderTeaser: object | null = null;
    let currentDate = new Date().toISOString();
    if (feed.Item.hasOwnProperty("TripDetails") && feed.Item.TripDetails.length > 0) {
        let Trips = feed.Item.TripDetails.sort((a, b) => (a.StartDate > b.StartDate) ? 1 : ((b.StartDate > a.StartDate) ? -1 : 0));
        if (Trips[0].StartDate < currentDate && currentDate < Trips[Trips.length - 1].StartDate) {
            assitanceProviderTeaser = new FeaturedEntry(featuredEntry);
            console.log('assistance provider teaser will be shown');
        }
    }
    return assitanceProviderTeaser;
}
export async function nextTrip(feed: any, user:any, nextTripInterval: number) {
    let nextTrip: object | null = null;
    let preferredLanguage = (user.hasOwnProperty("Item") && user.Item.hasOwnProperty("PreferredLanguage")) ? user.Item.PreferredLanguage : "en";
    console.log("Preferred Language");
    console.log(preferredLanguage);
    if (feed.Item.hasOwnProperty("TripDetails") && feed.Item.TripDetails.length > 0) {
        let Trips = feed.Item.TripDetails.sort((a, b) => (a.StartDate > b.StartDate) ? 1 : ((b.StartDate > a.StartDate) ? -1 : 0))
        for (let i = 0; i < Trips.length; i++) {
            let inInterval = false;
            let startDate = Trips[i].StartDate;
            let dates = addOrSubUtcOffset(Trips[i].Departure.utc_offset,startDate);
            let mostRecentDate = dates.mostRecentDate;
            let startDateTime = dates.startDateTime
            console.log("current date");
            console.log(mostRecentDate);
            console.log("start date");
            console.log(startDate);
            console.log("start date after add or sub utc_offset");
            console.log(startDateTime);
            let daysDiff = startDateTime.diff(mostRecentDate, 'days');
            console.log("days diff");
            console.log(daysDiff);
            console.log("interval");
            console.log(nextTripInterval);
        
            if (((Math.sign(daysDiff) === 1) || (Math.sign(daysDiff) === 0)) && (daysDiff < nextTripInterval)) {
                inInterval = true;
            }
            console.log("inInterval");
            console.log(inInterval);
            await moment.locale(preferredLanguage);
            console.log("moment locale :",moment.locale());
            
            if ((startDateTime > mostRecentDate) && (inInterval)) {
    
                nextTrip = {
                    type: "nextTrip",
                    next_trip_details: {
                        trip_id: Trips[i].TripID,
                        type: "nextTrip",
                        trip_type: Trips[i].TripType,
                        resource_type: Trips[i].ResourceType,
                        resource_name: Trips[i].ResourceName,
                        departure: Trips[i].Departure,
                        destination: Trips[i].Destinaton,
                        start_date: Trips[i].StartDate,
                        timeDifference: startDateTime.from(mostRecentDate)
                    }
                };
                console.log('next trip detail found');
                console.log(nextTrip);
                break;
            }
        }
    }
    return nextTrip;
}

function addOrSubUtcOffset(utcOffset: number,TripStartDate: string){
    let currentDate = moment();
    console.log("current date")
    console.log(currentDate);
    console.log("Utc Offset");
    console.log(utcOffset);
    let hours = (utcOffset / 60);
    let addHours = Math.floor(hours);
    let minutes = (hours - addHours) * 60;
    let addMinutes = Math.round(minutes);
    console.log("hours");
    console.log(addHours);
    console.log("minutes");
    console.log(addMinutes);
    let TripStart = moment(TripStartDate);
    let subtractedDate = TripStart.subtract({ hours: addHours, minutes: addMinutes});
    console.log("subtract");
    console.log(subtractedDate);
    let addDate = TripStart.add(addMinutes, 'minutes').add(addHours, 'hours');
    console.log("add");
    console.log(addDate);
    let startDateTime = utcOffset > 0 ? subtractedDate : addDate;   
    console.log(startDateTime);
    let dates = {
        startDateTime: startDateTime,
        mostRecentDate: currentDate
    };
    return dates;
}

export function addProfileData(user: any, featuredEntry: object) {
    let addProfileDataSuggest: object | null = null;
    if (user.hasOwnProperty("Item") && user.Item.hasOwnProperty("SuggestProfileUpdate") && user.Item.SuggestProfileUpdate === true) {
        addProfileDataSuggest = new FeaturedEntry(featuredEntry);
    } else if (!user.hasOwnProperty("Item")) {
        addProfileDataSuggest = new FeaturedEntry(featuredEntry);
    }
    return addProfileDataSuggest;
}
export function addParticipant(feed: any, featuredEntry: object) {
    let addParticipantCard: object | null = null;
    if ((feed.Item.ParticipantCount === 1 || feed.Item.ParticipantCount === 0) && (feed.Item.hasOwnProperty("BelongsToJourneyAdmin") && feed.Item.BelongsToJourneyAdmin === true)) {
        console.log('Need to show participant add quick link as featured entry');
        addParticipantCard = new FeaturedEntry(featuredEntry);
    }
    return addParticipantCard;
}
export function timelineExplanation(user: any, featuredEntry: object) {
    let timelineExplanationCard: object | null = null;
    if (user.hasOwnProperty("Item") && user.Item.hasOwnProperty("TimelineExplanationCount") && user.Item.TimelineExplanationCount < 2) {
        timelineExplanationCard = new FeaturedEntry(featuredEntry);
    } else if (!user.Item.hasOwnProperty("TimelineExplanationCount")) {
        timelineExplanationCard = new FeaturedEntry(featuredEntry);
    }
    return timelineExplanationCard;
}
export function insuranceSuggestion(user: any, featuredEntry: object) {
    let insuranceSuggest: object | null = null;
    if (user.hasOwnProperty("Item") && user.Item.hasOwnProperty("InsuranceCount") && user.Item.InsuranceCount < 1) {
        insuranceSuggest = new FeaturedEntry(featuredEntry);
    } else if (!user.hasOwnProperty("Item")) {
        insuranceSuggest = new FeaturedEntry(featuredEntry);
    }
    return insuranceSuggest;
}
export function documentSuggestion(user: any, featuredEntry: object) {
    let documentSuggest: object | null = null;
    if (user.hasOwnProperty("Item") && user.Item.hasOwnProperty("DocumentsCount") && user.Item.DocumentsCount < 1) {
        documentSuggest = new FeaturedEntry(featuredEntry);
    } else if (!user.hasOwnProperty("Item") || !user.Item.hasOwnProperty("DocumentsCount")) {
        documentSuggest = new FeaturedEntry(featuredEntry);
    }
    return documentSuggest;
}
function generateRangeBoundary(cards: object[]) {
    let rangeBoundary: number = 0;
    cards.forEach((cardWeight) => {
        rangeBoundary += cardWeight['weight'];
    });
    rangeBoundary = rangeBoundary + cards.length
    console.log("range boundary");
    console.log(rangeBoundary);
    return rangeBoundary;
}
function generateSelectedCard(cards: object[], random: number) {
    let selectedCard: object = {}
    let lastend = 0;
    for (let i = 0; i < cards.length; i++) {
        let start = 0;
        let end = 0;
        if (i == 0) {
            end = cards[i]['weight']
        } else {
            console.log("last end");
            start = lastend + 1;
            end = start + cards[i]['weight'];
        }
        lastend = end
        console.log(start, "start");
        console.log(end, "end");
        if ((start <= random) && (random <= end)) {
            selectedCard = cards[i]['card'];
            cards.splice(i, 1);
            break;
        }
    }
    return selectedCard;
}
export function arrangeCards(cards: object[], firstVisit: boolean, featuredEntryCount: number) {
    let collectCards = 2
    if (firstVisit === true) {
        collectCards = 3
    }
    let selectedCards: object[] = [];
    let pendingCards = collectCards - featuredEntryCount;
    console.log(pendingCards);
    for (let index = 0; index < pendingCards; index++) {
        let rangeBoundary: number = generateRangeBoundary(cards);
        let random = Math.floor(Math.random() * rangeBoundary);
        console.log('random number');
        console.log(random);
        console.log("cards");
        console.log(cards);
        let selectedCard: object = generateSelectedCard(cards, random);
        selectedCards.push(selectedCard);
    }
    console.log("selected Cards");
    console.log(selectedCards);
    return selectedCards;
}

