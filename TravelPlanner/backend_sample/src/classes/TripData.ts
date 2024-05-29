export class TripData {
    participantId:string
    journeyId:string
    tripDetails:object[]
    eventTime:string
    computed:object
    isAdmin:boolean;

    constructor(participantId:string, journeyId:string, tripDetails:object[] , eventTime:string, computed: object, isAdmin:boolean) {
        this.participantId = participantId
        this.journeyId = journeyId
        this.tripDetails = tripDetails
        this.eventTime = eventTime
        this.computed = computed
        this.isAdmin = isAdmin;
    }

    toJson() {
        return {
            participantId:this.participantId,
            journeyId:this.journeyId,
            tripDetails:this.tripDetails,
            eventTime:this.eventTime,
            computed:this.computed,
            isAdmin:this.isAdmin
        }
    }
}