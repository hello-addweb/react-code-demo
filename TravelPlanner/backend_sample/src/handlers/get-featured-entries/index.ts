import { JourneyFeedController } from '../../controllers/JourneyFeedController';
import sentry from 'middy-middlewares/sentry-middleware';
const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const ssm = require('@middy/ssm');
const controller = new JourneyFeedController();

const getFeaturedEntries:any  = controller.getFeaturedEntries;
export const handler = middy(getFeaturedEntries)
    .use(ssm({
        fetchData: {
            sentryDsn: '/journey-feed-service/sentry-dsn',
            nextTripInterval:'/journey-feed-service/next-trip-interval',
            assistanceSectionInterval:'/journey-feed-service/assistance-section-interval'
        },    
        setToContext: true
    }))    
    .use(sentry({
        environment: process.env.ENVIRONMENT_NAME,
    }))    
    .use(httpErrorHandler());