export class Alert {
    alertData:object
    eventTime:string;

    constructor(alertData:object, eventTime:string ) {
        this.alertData = alertData;
        this.eventTime = eventTime;
    }

    toJson() {
        return {
            alertData:this.alertData,
            eventTime:this.eventTime
        }
    }
}