import { JourneyFeedController } from '../../controllers/JourneyFeedController';
import sentry from 'middy-middlewares/sentry-middleware';
const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const ssm = require('@middy/ssm');
const controller = new JourneyFeedController();

const getTimelineEntries:any  = controller.getTimelineEntries;
export const handler = middy(getTimelineEntries)
    .use(ssm({
        fetchData: {
            sentryDsn: '/journey-feed-service/sentry-dsn'
        },    
        setToContext: true
    }))    
    .use(sentry({
        environment: process.env.ENVIRONMENT_NAME,
    }))    
    .use(httpErrorHandler());