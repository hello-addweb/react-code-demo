export class MessagePublished {
    eventTime:string
    payload:object
    journeyId:string
    userId:string;

    constructor(eventTime:string, payload:object,journeyId:string, userId:string) {
        this.eventTime=eventTime;
        this.payload=payload;
        this.journeyId=journeyId;
        this.userId=userId;
    }

    toJson() {
        return {
            eventTime:this.eventTime,
            payload:this.payload,
            journeyId:this.journeyId,
            userId:this.userId
        }
    }
}