export class DocumentsUpdated {
    eventTime: string
    documentsCount: number
    userID: string;

    constructor(eventTime: string, documentsCount: number, userID: string) {
        this.eventTime = eventTime;
        this.documentsCount = documentsCount;
        this.userID = userID;
    }

    toJson() {
        return {
            eventTime: this.eventTime,
            documentsCount: this.documentsCount,
            userID: this.userID
        }
    }
}