export class InsuranceUpdated {
    eventTime: string
    insuranceCount: number
    userId: string;

    constructor(eventTime: string, insuranceCount: number, userId: string) {
        this.eventTime = eventTime;
        this.insuranceCount = insuranceCount;
        this.userId = userId;
    }

    toJson() {
        return {
            eventTime: this.eventTime,
            insuranceCount: this.insuranceCount,
            userId: this.userId
        }
    }
}