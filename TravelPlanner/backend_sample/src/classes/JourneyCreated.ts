export class JourneyFeed {
    id: string
    ownerId:string
    eventTime:string;

    constructor(id: string, ownerId:string, eventTime:string ) {
        this.id = id;
        this.ownerId = ownerId;
        this.eventTime = eventTime;
    }

    toJson() {
        return {
            id: this.id,
            ownerId:this.ownerId,
            eventTime:this.eventTime
        }
    }
}