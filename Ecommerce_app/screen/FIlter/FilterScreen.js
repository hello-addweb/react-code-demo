import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterData } from '../../../../../Store/actions/filterAction';
import AppBackground from '../../../../../Components/AppBackground';
import Colors from '../../../../../../constant/Colors';
import Loader from '../../../../../../constant/Loader';
import FilterCollectionList from './FilterCollectionList';
import NoDataFound from './NoDataFound';

const FilterScreen = ({ closeModal, dataParams, setDataParams }) => {
  const dispatch = useDispatch();
  const { filterList: data, isFilterLoading: loading, filterData: filter, filterCriteria, selectedTab: tab } = useSelector(state => state.filterReducer);

  const selectedTab = tab || data[0]?.key;

  const handleFilter = useCallback((key, data, type) => {
    dispatch(setFilterData({ ...filter, [key]: { data, type } }));
  }, [dispatch, filter]);

  const renderFooter = useMemo(() => {
    return !loading ? null : <ActivityIndicator size="large" color={Colors.themeColor} />;
  }, [loading]);

  const removeDuplicates = useCallback((arr) => {
    const uniqueObjects = [];
    const uniqueObjectStrings = new Set();
    arr.forEach(obj => {
      const objString = JSON.stringify(obj);

      if (!uniqueObjectStrings.has(objString)) {
        uniqueObjectStrings.add(objString);
        uniqueObjects.push(obj);
      }
    });
    return uniqueObjects;
  }, []);

  const filterHandler = useCallback((tag) => {
    const transData = transformData(filter);

    const oldCriteria = { ...filterCriteria };
    const newCriteria = { ...dataParams?.criteria };

    const filters = oldCriteria?.filters;
    const newSortBy = newCriteria?.sortBy;

    const getOldFilters = () => {
      if (!filters) {
        return [];
      }
      const getFilter = (propertyName) => {
        return (tag === "showResult" ? transData : filters).find(ele => ele[propertyName]) || filters.find(ele => ele[propertyName]);
      };
      const brandFilter = getFilter("brand_name");
      const categoryFilter = getFilter("category_slug");
      const productTag = getFilter("product_seo.product_tag.en");
      return [
        brandFilter ? brandFilter : false,
        categoryFilter ? categoryFilter : false,
        productTag ? productTag : false
      ].filter(Boolean);
    };

    const showResultHandler = () => {
      const newFilters = transData;
      const oldFilters = getOldFilters();
      const finalFilters = removeDuplicates([...oldFilters, ...newFilters]);
      console.log(`showResult Result click:`, finalFilters);

      const isSameAsOld = JSON.stringify(newCriteria?.filters) === JSON.stringify(finalFilters);
      if (!isSameAsOld) {
        setDataParams({
          ...dataParams,
          criteria: { ...oldCriteria, filters: finalFilters, sortBy: newSortBy }
        });
      }
    };

    const clearFilterHandler = () => {
      console.log(`clearFilter Result click:`, filterCriteria);
      setDataParams({
        ...dataParams,
        criteria: oldCriteria
      });
    };

    if (tag === "showResult") {
      showResultHandler();
    } else {
      clearFilterHandler();
      dispatch(setFilterData({}));
    }
    closeModal(false);
  }, [closeModal, filter, filterCriteria, dataParams?.criteria]);

  const transformData = useCallback((data) => {
    const resultArray = [];

    for (const key in data) {
      const { data: valueData, type } = data[key];
      if (type === "radioButton") {
        const selectedOption = Object.keys(valueData).find((option) => valueData[option]);
        if (selectedOption !== undefined) {
          resultArray.push({ [key]: selectedOption });
        }
      } else if (type === "checkbox") {
        const selectedOptions = Object.keys(valueData).filter((option) => valueData[option]);
        if (selectedOptions.length > 0) {
          resultArray.push({ [key]: selectedOptions });
        }
      } else if (type === "slider") {
        const [min, max] = valueData;
        resultArray.push({ [key]: `${min} TO ${max}` });
      }
    }
    return resultArray;
  }, []);

  return (
    <AppBackground>
      {loading ? (
        <Loader />
      ) : data.length > 0 ? (
        <FilterCollectionList
          data={data}
          filter={filter}
          selectedTab={selectedTab}
          handleFilter={handleFilter}
          filterHandler={filterHandler}
          loading={loading}
          renderFooter={renderFooter}
        />
      ) : (
        <NoDataFound filterHandler={filterHandler} />
      )}
    </AppBackground>
  );
};

export default React.memo(FilterScreen);
