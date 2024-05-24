// @flow

import { sitemapStatusHeaderConfig } from "components/dashboard/mockedData";
import { prepereBigNumber } from "helpers/functions";
import { customLogger } from 'logger';

type rowItem = {
    submitted: number,
    indexed: number,
    contents: string,
}

export const getSitemapsTotalSum = (data: Array<rowItem>, key: any) => {
    return data.reduce((prev, cur) => prev + parseInt(cur.contents[0][key]), 0);
};

export const preparesubmittedSitemaps = (data: Array<rowItem>) => {
    let count = getSitemapsTotalSum(data, "submitted");
    return prepereBigNumber(count);
};

export const prepareindexedSitemaps = (data: Array<rowItem>) => {
    let count = getSitemapsTotalSum(data, "indexed");
    return prepereBigNumber(count);
};

export const prepareHeaderSitemapData = (data: Array<rowItem>) => {
    const prepare = { preparesubmittedSitemaps, prepareindexedSitemaps };
    return sitemapStatusHeaderConfig.map(item => {
        item.value = prepare[`prepare${item.type}`](data);
        return item;
    });
};

// export const prepareHeaderSitemapData = (data: any) => {

    
//     return sitemapStatusHeaderConfig.map(headerItem => {
//         headerItem.value =  data.filter(item => {
//             if(headerItem.type == "submittedSitemaps" && item.hasOwnProperty('lastSubmitted')) {
//                 return true
//             } else if(headerItem.type == "indexedSitemaps" && item.isSitemapsIndex == true ) {
//                 return true
//             }
//         }).length
//         return headerItem;
//     });
// };

export const prepareTableSitemapData = (data: any) => {
    let Result = data.map(item => {
        if(item.hasOwnProperty('lastDownloaded')){
            item.processed = "Yes"
        }else {
            item.processed = "No"
        }
        if(!item.hasOwnProperty('type')){
            item.type = 'html'
        }
        return item;
    });

    return compressArray(Result)
};


function compressArray(original) {
 
	// make a copy of the input array
	var copy = original.slice(0);

	// customLogger("original", original)
  original.map(item=> {
    item.submitted  = item.hasOwnProperty('lastSubmitted') ? 1 : 0;
    item.indexed  = item.isSitemapsIndex == true ? 1 : 0;
    return item
  })

  original.forEach(item => {
    copy.forEach((copyItem,i) => {
      if(item.path === copyItem.path ) {
          if(copyItem.hasOwnProperty('lastSubmitted')) {
            item.submitted = item.submitted + 1
          } 
          if(copyItem.isSitemapsIndex) {
            item.indexed = item.indexed + 1
          }
          copy.splice(i, 1);
        //   original.splice(i, 1);
      }
    })

  })

 
	return original;
}

