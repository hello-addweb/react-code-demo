export class TimelineCount {
    journeyId:string
    userId:string
    count:number;

    constructor(journeyId:string, userId:string, count:number) {
        this.journeyId=journeyId
        this.userId=userId
        this.count=count;
    }

    toJson() {
        return {
            journeyId:this.journeyId,
            userId:this.userId,
            count:this.count
        }
    }
}