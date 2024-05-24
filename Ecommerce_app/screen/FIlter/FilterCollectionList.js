import React from 'react';
import { View, FlatList } from 'react-native';
import FilterLabel from './FilterLabel';
import FilterSection from './FilterSection';
import AppButton from '../../../../../Components/AppButton';
import { translate } from '../../../../../../utility';
import styles from './styles';

const FilterCollectionList = ({
  data,
  filter,
  selectedTab,
  handleFilter,
  filterHandler,
  loading,
  renderFooter,
}) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <FlatList
            data={data}
            renderItem={({ item }) => <FilterLabel item={item} selectedTab={selectedTab} />}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={renderFooter}
            refreshing={loading}
          />
        </View>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <FilterSection
              data={item}
              filter={filter}
              activeIndex={selectedTab === item.key}
              setFilter={handleFilter}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={renderFooter}
          refreshing={loading}
          style={styles.subFilterContainer}
        />
      </View>
      <View style={styles.buttonBox}>
        <AppButton
          label={translate('common.clearFilter')}
          containerStyle={styles.buttonStyle}
          onPress={() => filterHandler("clearFilter")}
          isEmptyBG
          labelStyle={styles.labelStyle}
        />
        <AppButton
          label={translate('common.showResult')}
          containerStyle={styles.buttonStyle}
          onPress={() => filterHandler("showResult")}
          labelStyle={styles.labelStyle}
        />
      </View>
    </>
  );
};

export default React.memo(FilterCollectionList);
