export class ProfileUpdated {
    eventTime: string
    suggestProfileUpdate: boolean
    userId: string
    preferredLanguage: String;

    constructor(eventTime: string, suggestProfileUpdate: boolean, userId: string, preferredLanguage: string) {
        this.eventTime = eventTime;
        this.suggestProfileUpdate = suggestProfileUpdate;
        this.userId = userId;
        this.preferredLanguage = preferredLanguage;
    }

    toJson() {
        return {
            eventTime: this.eventTime,
            suggestProfileUpdate: this.suggestProfileUpdate,
            userId: this.userId,
            preferredLanguage: this.preferredLanguage
        }
    }
}