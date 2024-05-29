import { featuredEntriesWeight } from '../shared/featured-entries-weight';
import * as FeaturedEntryHandler from '../shared/FeaturedEntryTypeHandler'

export async function handleFeaturedEntries(feed: any, user: any, context: any) {
    let firstVisit: boolean = false
    let featuredEntries: object[] = [];
    let featuredEntriesbyWeight: object[] = [];
    let nextTripInterval: number = Number(context['nextTripInterval']);
    let assistanceSectionInterval: number = Number(context['assistanceSectionInterval']);
    let orangeCard = await FeaturedEntryHandler.orangeCard(feed)
    if (orangeCard) {
        firstVisit = true
        featuredEntries.push(orangeCard);
    }
    let nextTripCard = await FeaturedEntryHandler.nextTrip(feed,user,nextTripInterval)
    if (nextTripCard) {
        featuredEntries.push(nextTripCard);
    }
    featuredEntriesWeight.forEach((featuredEntry) => {
        switch (featuredEntry['type']) {
            case "journey_participants":
                let addPartcipant = FeaturedEntryHandler.addParticipant(feed, featuredEntry)
                if (addPartcipant) {
                    featuredEntriesbyWeight.push(addPartcipant);
                }
                break;
            case "insurance_suggestion":
                let insuranceSuggest = FeaturedEntryHandler.insuranceSuggestion(user, featuredEntry)
                if (insuranceSuggest) {
                    featuredEntriesbyWeight.push(insuranceSuggest);
                }
                break;
            case "add_more_trip":
                let addMoreTrip = FeaturedEntryHandler.addMoreTrip(feed, featuredEntry)
                if (addMoreTrip) {
                    featuredEntriesbyWeight.push(addMoreTrip);
                }
                break;
            case "add_flight_trip":
                let addFlightTrip = FeaturedEntryHandler.addFlightTrip(feed, featuredEntry)
                if (addFlightTrip) {
                    featuredEntriesbyWeight.push(addFlightTrip);
                }
                break;
            case "document_suggestion":
                let documentSuggestion = FeaturedEntryHandler.documentSuggestion(user, featuredEntry)
                if (documentSuggestion) {
                    featuredEntriesbyWeight.push(documentSuggestion);
                }
                break;
            case "feedback_form":
                let feedbackForm = FeaturedEntryHandler.feedbackForm(featuredEntry)
                featuredEntriesbyWeight.push(feedbackForm);
                break;
            case "assistance_section_teaser":
                let assistanceSectionTeaser = FeaturedEntryHandler.assistanceSectionTeaser(feed, featuredEntry, assistanceSectionInterval)
                if (assistanceSectionTeaser) {
                    featuredEntriesbyWeight.push(assistanceSectionTeaser);
                }
                break;
            case "assistance_providers_registry_teaser":
                let assistanceProviderTeaser = FeaturedEntryHandler.assistanceProviderTeaser(feed, featuredEntry)
                if (assistanceProviderTeaser) {
                    featuredEntriesbyWeight.push(assistanceProviderTeaser);
                }
                break;
            case "see_country_information":
                let countryInformation = FeaturedEntryHandler.countryInformation(feed, featuredEntry)
                if (countryInformation) {
                    featuredEntriesbyWeight.push(countryInformation);
                }
                break;
            case "add_profile_data":
                let addProfileSuggest = FeaturedEntryHandler.addProfileData(user, featuredEntry)
                if (addProfileSuggest) {
                    featuredEntriesbyWeight.push(addProfileSuggest);
                }
                break;
            case "timeline_explanation":
                let timelineExplanationCard = FeaturedEntryHandler.timelineExplanation(user, featuredEntry)
                if (timelineExplanationCard) {
                    featuredEntriesbyWeight.push(timelineExplanationCard);
                }
                break;
            default:
                break;
        }
    })

    let collectedCards: object[] = FeaturedEntryHandler.arrangeCards(featuredEntriesbyWeight, firstVisit, featuredEntries.length)
    let finalFeaturedEntries: object[] = featuredEntries.concat(collectedCards)
    await FeaturedEntryHandler.handleTimelineExplanationCount(user, finalFeaturedEntries);
    return finalFeaturedEntries;
}