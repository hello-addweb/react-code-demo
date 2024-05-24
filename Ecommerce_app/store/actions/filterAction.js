import { filterListAPI } from "../../../services/apis/FilterAPI";
import { FILTER_CRITERIA, FILTER_DATA, FILTER_FAIL, FILTER_LOADING, FILTER_SUCCESS, FILTER_SELECTED_TAB, FILTER_UPDATE} from "../types";

export const filterLoadingStart = bool => ({
  type: FILTER_LOADING,
  payload: bool,
});

export const filterSuccess = data => ({
  type: FILTER_SUCCESS,
  payload: data,
});

export const filterUpdate = error => ({
  type: FILTER_UPDATE,
  payload: error,
});

export const filterListFail = error => ({
  type: FILTER_FAIL,
  payload: error,
});

export const setFilterData = data => ({
  type: FILTER_DATA,
  payload: data,
});

export const setCriteria = criteria => ({
  type: FILTER_CRITERIA,
  payload: criteria,
});

export const setSelectedTab = tab => ({
  type: FILTER_SELECTED_TAB,
  payload: tab,
});


const getFilterData = (filArray) => {
  const filterArray = filArray.map(obj=>{
    const [keys,values] = Object.entries(obj)[0];
    const newObj = {
      [keys]:{
        data:{
          [values]:true,
        },
        type: "radioButton"
      }
    }
    return newObj
  })

  const mergedObject = filterArray.reduce((result, currentObject) => {
    const key = Object.keys(currentObject)[0];
    result[key] = currentObject[key];
    return result;
  }, {});

  return mergedObject
}

export const getFilterList = (criteria) => {
  return async dispatch => {
    dispatch(filterLoadingStart(true));
    await filterListAPI(criteria)
      .then(response => {
        if (response) {
        const filterData = getFilterData(criteria?.filters);
        dispatch(setFilterData(filterData));
        dispatch(filterSuccess(response));
        console.log("appliedFilters getFilterList : ",response);
        console.log("AppliedFilters getFilterList filterData : ",filterData);
        }
        else{
          dispatch(filterListFail(err));
        }
      })
      .catch(err => {
        dispatch(filterListFail(err));
      })
      .finally(()=>{
        dispatch(filterLoadingStart(false));
      });
  };
};


export const updateFilterList = (criteria) => {
  return async dispatch => {
    dispatch(filterLoadingStart(true));
    await filterListAPI(criteria)
      .then(response => {
        if (response) {
          console.log("AppliedFilters updateFilterList criteria?.filters : ",criteria?.filters);
          console.log("appliedFilters updateList : ",response);
          dispatch(filterUpdate(response));
        }
        else{
          dispatch(filterListFail(err));
        }
      })
      .catch(err => {
        dispatch(filterListFail(err));
      })
      .finally(()=>{
        dispatch(filterLoadingStart(false));
      });
  };
};