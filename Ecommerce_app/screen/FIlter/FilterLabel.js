import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { setSelectedTab } from '../../../../../Store/actions/filterAction';
import { useCustomFonts } from '../../../../../../context/FontContext';
import styles from './styles';

const FilterLabel = ({ item, selectedTab }) => {
  const dispatch = useDispatch();
  const getFonts = useCustomFonts();

  return (
    <TouchableOpacity
      style={styles.filterSection(selectedTab, item.key)}
      onPress={() => dispatch(setSelectedTab(item.key))}>
      <Text style={[styles.filterText(selectedTab, item.key), { fontFamily: getFonts.SEMI_BOLD }]} numberOfLines={2}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(FilterLabel);
