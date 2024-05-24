import React, {useCallback, useMemo}from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import RenderCheckbox from './RenderCheckbox';
import FilterValuePrice from './FilterValuePrice';

const FilterSection = ({data, activeIndex, setFilter ,filter}) => {

  const filterValue = useMemo(() => filter ? filter[data.key]?.data : {}, [filter, data.key]);

  const handleFilterValue = useCallback((value, index) => {
    let newFilterValue;
    switch (data.type) {
      case 'checkbox':
        newFilterValue = { ...filterValue, [value]: !filterValue?.[value] };
        break;
      case 'radioButton':
        newFilterValue = { [value]: !filterValue?.[value], index: !filterValue?.[value] && index };
        break;
      default:
        newFilterValue = value;
    }
    setFilter(data.key, newFilterValue, data.type);
  }, [data.key, data.type, filterValue, setFilter]);

  if (!activeIndex) {
    return null;
  }

  return (
    <View style={styles.container}>
      {data.type === 'slider' && (
        <FilterValuePrice 
          from={data.values[0].value} 
          to={data.values[1].value}
          filterValue={filterValue || [data.values[0].value,data.values[1].value]} 
          setFilterValue={handleFilterValue}
        />
      )}
      {(data.type === 'checkbox' || data.type === 'radioButton') && (
        <FlatList
          data={data.values}
          renderItem={({item, index}) => (
            <RenderCheckbox
              sectionKey={data.key}
              item={item}
              index={index}
              setFilterValue={handleFilterValue}
              filterValue={filterValue || {}}
            />
          )}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
});

export default React.memo(FilterSection);
