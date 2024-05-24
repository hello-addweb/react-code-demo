import React, {useCallback, useState} from 'react';
import {Text, TextInput, View} from 'react-native';
import {Slider} from '@miblanchard/react-native-slider';
import Thumb from '../PriceSlider/Thumb';
import Colors from '../../../../../../constant/Colors';

const FilterValuePrice = ({from, to ,filterValue, setFilterValue}) => {

  const [minimumInputValue, setMinimumInputValue] = useState(filterValue[0].toString() || from.toString());
  const [maximumInputValue, setMaximumInputValue] = useState(filterValue[1].toString() || to.toString());

  const handleValueChange = useCallback(
    ([newLow, newHigh]) => {
      setFilterValue([newLow, newHigh])
      setMinimumInputValue(newLow.toString());
      setMaximumInputValue(newHigh.toString());
    },
    [setFilterValue, setMinimumInputValue, setMaximumInputValue],
  );

  const handleMinInputChange = text => {
    setMinimumInputValue(text);
    const minValue = parseInt(text) || from;
    const maxValue = parseInt(maximumInputValue) || to;
    if (minValue >= from && minValue <= to && minValue <= maxValue) {
      setFilterValue([minValue,filterValue[1]]);
    }
  };

  const handleMaxInputChange = text => {
    setMaximumInputValue(text);
    const minValue = parseInt(minimumInputValue) || from;
    const maxValue = parseInt(text) || to;
    if (maxValue >= from && maxValue <= to && maxValue >= minValue) {
      setFilterValue([filterValue[0],maxValue]);
    }
  };

  return (
    <View style={{gap: 10}}>
      <Slider
            animateTransitions
            maximumTrackTintColor="#d3d3d3"
            minimumValue={from}
            maximumValue={to}
            minimumTrackTintColor={Colors.themeColor}
            step={1}
            thumbTintColor={Colors.themeColor}
            value={filterValue}
            onValueChange={handleValueChange}
            onSlidingComplete={()=>{}}
            renderThumbComponent={Thumb}
            trackStyle={{height:7,borderRadius:7}}
        />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        <Text style={{fontSize: 16, fontWeight: '500', lineHeight: 21}}>
          Price:
        </Text>
        <View style={{gap: 7}}>
          <TextInput
            value={minimumInputValue}
            onChangeText={handleMinInputChange}
            keyboardType="numeric"
            style={{
              borderWidth: 2,
              borderColor: '#E7E5E5',
              width: 144,
              paddingHorizontal: 20,
              height: 40,
              color: '#101010',
            }}
          />
          <TextInput
            value={maximumInputValue}
            onChangeText={handleMaxInputChange}
            keyboardType="numeric"
            style={{
              borderWidth: 2,
              borderColor: '#E7E5E5',
              width: 144,
              paddingHorizontal: 20,
              height: 40,
              color: '#101010',
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default FilterValuePrice;
