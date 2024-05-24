import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import CheckBox from 'react-native-check-box';
import RenderFix from './RenderFix';
import Colors from '../../../../../../constant/Colors';
import { useCustomFonts } from '../../../../../../context/FontContext';

const RenderCheckbox = ({sectionKey,item, index, setFilterValue, filterValue}) => {
  const getFonts = useCustomFonts();
  return (
    <Pressable
      key={index}
      style={styles.content}
      onPress={() => setFilterValue(item.value, index)}>
      <CheckBox
        isChecked={sectionKey === "createdAt" ? filterValue.index === index : filterValue[item.value]}
        onClick={() => setFilterValue(item.value, index)}
        checkedCheckBoxColor={Colors.themeColor}
        uncheckedCheckBoxColor={Colors.PRICEGRAY}
      />
      <View style={styles.textContent}>
        <View style={styles.contentBox}>
          {item.prefix && <RenderFix data={item.prefix} />}

          <Text style={[styles.contentText,{fontFamily: getFonts.REGULAR}]}>{item.key}</Text>

          {item.suffix && <RenderFix data={item.suffix} />}
        </View>
        <Text style={[styles.contentText,{fontFamily: getFonts.REGULAR}]}>({item.itemCounts})</Text>
      </View>
    </Pressable>
  );
};
export default React.memo(RenderCheckbox);

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 17,
  },
  textContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  contentBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  contentText: {
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0.07,
    color: Colors.PRICEGRAY,
    fontWeight: 500,
    paddingHorizontal: 5,
  },
  itemRating: {
    flexDirection: 'row',
    paddingTop: 3,
    paddingHorizontal: 5,
  },
});
