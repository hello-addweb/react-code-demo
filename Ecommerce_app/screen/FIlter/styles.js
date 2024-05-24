import { StyleSheet } from 'react-native';
import { wp } from '../../../../../../constant/responsiveFunc';
import Colors from '../../../../../../constant/Colors';

const styles = StyleSheet.create({
  filterSection: (selectedTab, key) => ({
    width: '100%',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: selectedTab === key ? Colors.LightGray : Colors.WHITE,
    borderBottomColor: Colors.GRAY,
    borderBottomWidth: 1,
  }),
  filterText: (selectedTab, key) => ({
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 0.5,
    color: selectedTab === key ? Colors.themeColor : Colors.GRAY3,
    marginHorizontal: '2%',
    textTransform: "capitalize",
  }),
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  filterContainer: {
    width: wp(33),
    backgroundColor: Colors.WHITE,
    borderRightWidth: 3,
    borderRightColor: Colors.GRAY,
  },
  subFilterContainer: {
    flex: 1,
    paddingVertical: 10,
    marginBottom: 4,
  },
  sorryMessageCont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sorryMessage: {
    fontSize: 15,
  },
  buttonBox: {
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingBottom: 60,
    flexDirection: "row",
    gap: 10,
  },
  noDataBox: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 60,
    flexDirection: "row",
    gap: 10,
  },
  buttonStyle: {
    flex: 1,
    paddingHorizontal: 16,
  },
  labelStyle: {
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0.07,
    paddingHorizontal: 0,
  }
});

export default styles;
