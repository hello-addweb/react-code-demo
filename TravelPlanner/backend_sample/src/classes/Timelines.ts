export class Timelines {
    journeyId:string
    userId:string

    constructor(journeyId:string, userId:string) {
        this.journeyId=journeyId
        this.userId=userId;
    }

    toJson() {
        return {
            journeyId:this.journeyId,
            userId:this.userId
        }
    }
}