import { Store } from "../../../screens/Store";

const getCount = (data, prop, val) => {
  return data.filter(e => (prop ? +e[prop] >= val : +e >= val)).length;
};
const isLanguage = Store?.getState()?.languageReducer?.selectedLanguageItem?.language_id || 0;

const removeSuffix = (str, suffix) => {
  if (str.endsWith(suffix)) {
    return str.slice(0, -suffix.length);
  }
  return str;
}
const getLabel = (text) => {
  let key = text;
  if(text.includes("attributes")){
    key = text.split(".")[1].split("_").join(" ")
  }
  return key.split("_")[0].split("-").join(" ")
}
const getReview = array => {
  return {
    label: 'ratings',
    type: 'radioButton',
    key: 'reviews.rating',
    values: [
      {
        key: '⭐⭐⭐⭐⭐',
        itemCounts: getCount(array, 'rating', 5),
        value: '5 TO 5',
      },
      {
        key: '⭐⭐⭐⭐ & more',
        itemCounts: getCount(array, 'rating', 4),
        value: '4 TO 5',
      },
      {
        key: '⭐⭐⭐ & more',
        itemCounts: getCount(array, 'rating', 3),
        value: '3 TO 5',
      },
      {
        key: '⭐⭐ & more',
        itemCounts: getCount(array, 'rating', 2),
        value: '2 TO 5',
      },
      {
        key: '⭐ & more',
        itemCounts: getCount(array, 'rating', 1),
        value: '1 TO 5',
      },
    ],
  };
};
const getDiscount = array => {
  return {
    label: 'discount',
    type: 'radioButton',
    key: 'price_iqd.discount_percentage',
    filterType: 'generic',
    values: [
      {
        key: '10% & more',
        itemCounts: getCount(array, 'discount_percentage', 10),
        value: '10 TO 100',
      },
      {
        key: '20% & more',
        itemCounts: getCount(array, 'discount_percentage', 20),
        value: '20 TO 100',
      },
      {
        key: '30% & more',
        itemCounts: getCount(array, 'discount_percentage', 30),
        value: '30 TO 100',
      },
      {
        key: '40% & more',
        itemCounts: getCount(array, 'discount_percentage', 40),
        value: '40 TO 100',
      },
      {
        key: '50% & more',
        itemCounts: getCount(array, 'discount_percentage', 50),
        value: '50 TO 100',
      },
    ],
  };
};
const getNewArrival = array => {
  const timestamp = Date.now()/1000;
  return {
    label: 'newArrivals',
    type: 'radioButton',
    key: 'createdAt',
    filterType: 'generic',
    values: [
      {
        key: '5 days',
        itemCounts: getCount(array, '', timestamp - 86400 * 5),
        value: `${timestamp - 86400 * 5} TO ${timestamp}`,
      },
      {
        key: '10 days',
        itemCounts: getCount(array, '', timestamp - 86400 * 10),
        value: `${timestamp - 86400 * 10} TO ${timestamp}`,
      },
      {
        key: '20 days',
        itemCounts: getCount(array, '', timestamp - 86400 * 20),
        value: `${timestamp - 86400 * 20} TO ${timestamp}`,
      },
      {
        key: '30 days',
        itemCounts: getCount(array, '', timestamp - 86400 * 30),
        value: `${timestamp - 86400 * 30} TO ${timestamp}`,
      },
      {
        key: '40 days',
        itemCounts: getCount(array, '', timestamp - 86400 * 40),
        value: `${timestamp - 86400 * 40} TO ${timestamp}`,
      },
    ],
  };
};

const getPriceRange = array => {
  const filterList = Store?.getState()?.filterReducer?.filterList || [];
  const data = array.sort((a, b) => a.store_price - b.store_price);
  if(filterList.length > 0){
    const priceRange = filterList.find(obj => obj.key === 'price_iqd.store_price')
    console.log("priceRange :",priceRange);
    return priceRange ? priceRange : {
      label: 'price',
      type: 'slider',
      key: 'price_iqd.store_price',
      values: [
        {key: 'min', value: data[0].store_price},
        {key: 'max', value: data[data.length - 1].store_price},
      ],
    }
  }
  else{
    return {
      label: 'price',
      type: 'slider',
      key: 'price_iqd.store_price',
      values: [
        {key: 'min', value: data[0].store_price},
        {key: 'max', value: data[data.length - 1].store_price},
      ],
    };
  }
};

const getElasticFilterList = (prodArray, searchText) => {
  const attr = {};
  const filters = [];
  prodArray.forEach(element => {
    const {attributes, ...rest} = element._source;
    if(!searchText){
      const newAttr = {};
      for (key in attributes) {
        if(key.includes('_ar')){
          if(isLanguage === 0){
            delete attributes[key];
          }
          else{
            const newKey = removeSuffix(key, "_ar")
            delete attributes[newKey];
          }
        }
      }
      for (key in attributes) {
        if (attributes.hasOwnProperty(key)) {
          newAttr[`attributes.${key}`] = attributes[key];
        }
      }
      const obj = {...rest, ...newAttr};
      for (const key in obj) {
        if (!attr[key]) {
          attr[key] = [];
        }
        attr[key].push(obj[key]);
      }
    }
    else{
      const obj = {...rest};
      for (const key in obj) {
        if (!attr[key]) {
          attr[key] = [];
        }
        attr[key].push(obj[key]);
      }
    }
  });
  for (const key in attr) {
    switch (key) {
      case 'createdAt':
        const createdAt = getNewArrival(attr[key]);
        filters.push(createdAt);
        break;
      case 'reviews':
        const reviews = getReview(attr[key]);
        filters.push(reviews);
        break;
      case 'price_iqd':
        const priceIqd = getPriceRange(attr[key]);
        filters.push(priceIqd);
        const discount = getDiscount(attr[key]);
        filters.push(discount);
        break;
      default:
        let data = [];
        let values = {};
        if (typeof attr[key][0] !== 'object') {

          data = attr[key].filter((e, i) => attr[key].indexOf(e) === i && e.length > 0);
          values = data.map(e => ({
            key: getLabel(e),
            itemCounts: attr[key].filter(x => e === x).length || 0,
            value: e,
          }));
        }
        filters.push({
          label: getLabel(key),
          type: 'radioButton',
          key: key,
          filterType: 'generic',
          values: values,
        });
        break;
    }
  }
 
  const filteredArray = filters.filter(filter => {
        const values = filter.values;
      
        if (Array.isArray(values) && values.length > 0) {
          return true;
        } else if (typeof values === 'object' && Object.keys(values).length > 0) {
          return true;
        }
      
        return false;
  });
  return filteredArray;
};

export default getElasticFilterList;
