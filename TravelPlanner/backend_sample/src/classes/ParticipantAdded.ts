export class AddedParticipant {
    participant:object
    journeyData:object
    eventTime:string
    tripDetail:object[];

    constructor(participant:object, journeyData:object , eventTime:string,tripDetail:object[]) {
        this.participant=participant
        this.journeyData=journeyData;
        this.eventTime =eventTime;
        this.tripDetail= tripDetail;
    }

    toJson() {
        return {
            participant:this.participant,
            journeyData:this.journeyData,
            eventTime:this.eventTime,
            tripDetail:this.tripDetail
        }
    }
}