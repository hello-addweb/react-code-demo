import {APP_CONFIG,ELASTIC_SEARCH_API_ENDPOINT, ELASTIC_SEARCH_API_KEY} from '@env';
import getElasticFilterList from '../helpers/esFilter';
import { constructESFilters, constructESSearch, constructFilters } from '../helpers/esSearch';

import {FILTER_LIST_API} from '../../../utility/apiUrls';
import sendRequest from '../../axios/AxiosApiRequest';

export const filterListAPI = (criteria) => {
   if(APP_CONFIG === 'staging'){
    const data = {
      ...criteria,
      filters:constructFilters(criteria)
    };
    return new Promise((resolve, _reject) => {
        sendRequest({
        url: FILTER_LIST_API,
        method: 'POST',
        data: data,
        })
        .then(response => {
            resolve(response.data.records);
        })
        .catch(error => {
            console.error('Error from FILTER_LIST_API api', error);
            _reject(error);
        });
    });
   }
   else{

    const includes = [
      "brand_name",
      "category_slug",
      "product_seo",
      "attributes",
      "reviews",
      "price_iqd",
      "createdAt"
    ]
    
    const filters = constructFilters(criteria);
    const esFilters = constructESFilters(filters);
    const esSort = criteria?.sortBy ? criteria.sortBy : [];
    const esSearch = constructESSearch(criteria);
  
    const data = {
      _source: {
        includes,
      },
      query: {
        bool: {
          filter: esFilters,
          must: esSearch,
        },
      },
      sort: esSort,
      size: 10000,
      track_total_hits: true,
    };
  
    console.log('FilterAPI payload:', data);
  
    const headerData = {
      Authorization: `ApiKey ${ELASTIC_SEARCH_API_KEY}`,
      'Content-Type': 'application/json',
    };
  
    const url = `${ELASTIC_SEARCH_API_ENDPOINT}/search-product/_search?pretty`;
  
    const queryParams = {
      method: 'POST',
      headers: headerData,
      body: JSON.stringify(data),
    };
    return new Promise((resolve, _reject) => {
      fetch(url, queryParams)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('FilterAPI response:', data);
          if(data.hits.hits.length > 0){
            const newData = getElasticFilterList(data.hits.hits, criteria?.searchText);
            console.log('FilterAPI getElasticFilterList data:', newData);
            resolve(newData);
          }
          else{
            _reject("No data found")
          }
  
        })
        .catch(error => {
          console.error('Error from FILTER_LIST_API api', error);
          _reject(error);
        });
    });
   }
    
};
