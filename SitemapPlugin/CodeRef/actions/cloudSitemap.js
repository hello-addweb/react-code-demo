// React app - actions for building sitemap in cloud
import { createRequestTypes } from "helpers/constants";
import { customLogger  } from 'logger'
export const CLOUD_SITEMAP_BUILD = createRequestTypes("CLOUD_SITEMAP_BUILD");

customLogger(">>>CLOUD_SITEMAP_BUILD:");
customLogger(CLOUD_SITEMAP_BUILD);

export const buildCloudSitemap = {
    request: request => ({ type: CLOUD_SITEMAP_BUILD.REQUEST, request }),
    success: () => ({ type: CLOUD_SITEMAP_BUILD.SUCCESS }),
    error:   error => ({ type: CLOUD_SITEMAP_BUILD.FAILURE, error })
};

// INDEX BUILDING:
export const CLOUD_SITEMAP_INDEX_BUILD = createRequestTypes("CLOUD_SITEMAP_INDEX_BUILD");

customLogger(">>>CLOUD_SITEMAP_INDEX_BUILD:");
customLogger(CLOUD_SITEMAP_INDEX_BUILD);

export const buildCloudSitemapIndex = {
    request: request => ({ type: CLOUD_SITEMAP_INDEX_BUILD.REQUEST, request }),
    success: () => ({ type: CLOUD_SITEMAP_INDEX_BUILD.SUCCESS }),
    error:   error => ({ type: CLOUD_SITEMAP_INDEX_BUILD.FAILURE, error })
};
