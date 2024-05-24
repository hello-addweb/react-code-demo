import React from 'react';
import { View, Text } from 'react-native';
import AppButton from '../../../../../Components/AppButton';
import { translate } from '../../../../../../utility';
import { useCustomFonts } from '../../../../../../context/FontContext';
import styles from './styles';

const NoDataFound = ({ filterHandler }) => {
  const getFonts = useCustomFonts();

  return (
    <View style={styles.sorryMessageCont}>
      <Text style={[styles.sorryMessage, { fontFamily: getFonts.SEMI_BOLD }]}>
        {translate('common.nodatafound')}
      </Text>
      <View style={styles.noDataBox}>
        <AppButton
          label={translate('common.clearFilter')}
          containerStyle={styles.buttonStyle}
          onPress={() => filterHandler("clearFilter")}
          isEmptyBG
          labelStyle={styles.labelStyle}
        />
      </View>
    </View>
  );
};

export default React.memo(NoDataFound);
