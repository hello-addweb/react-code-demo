import {StyleSheet, Dimensions} from 'react-native'
import { Colors } from "App/Theme";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  header: {
    top: 50,
    position: 'absolute',
    flexDirection: 'row',
    paddingHorizontal:20,
    alignItems: 'center'
  },
  backbtn: {
   backgroundColor: 'rgba(0,0,0,0.5)',
   paddingHorizontal: 10,
   paddingVertical:5,
   borderRadius:50
  },
  backbtnIcon : {

  },
  headerimg: {
    width: 26,
    height: 20,
  },
  headertxt: {
    color: '#efefef',
    fontSize: 20,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginLeft: 20

  },
  headerflightTxt: {
    color: '#efefef',
    fontSize: 15,
    fontWeight: '600',
  },
  headerflightSubTxt: {
    color: '#efefef',
    fontSize: 12,
    fontWeight: '300',
  },
  scrollwrap: {
    backgroundColor: '#fff',
    flex: 1
  },
  tabcontainer: {
    backgroundColor: '#F49815',
    paddingHorizontal: 15,
    paddingVertical: 20
  },
  fddtext: {
    color: '#A5A5A5',
    fontSize: 18,
    lineHeight: 19,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  inputdate: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
    borderStyle: 'solid',
    color: '#000',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: 'normal',
    height: 50,
    paddingHorizontal: 5,
    backgroundColor: '#ffffff',
    width: '85%'
  },
  bookwrap: {
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  innerView: {
    position: 'absolute',
    alignSelf: 'center',
    top:120
  },
  tabView: {
    zIndex:9999,
    height:50,
    marginBottom:20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderStyle: 'solid',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 8,
  },
  tabBtn: {
    width:(width -60)/2,
    padding:10,
    borderRadius: 50,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: Colors.orange,
  },
  activeText: {
    color :  Colors.white,
    fontWeight:'bold'
  },
  datecard: {
    zIndex:9999,
    marginBottom:10,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 0,
    borderColor: '#ECECEC',
    borderStyle: 'solid',
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 0.75,
    // shadowRadius: 3.84,
    // elevation: 2,
  },
  tabwrap: {
    zIndex:9999,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 0,
    borderColor: '#ECECEC',
    borderStyle: 'solid',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.75,
    shadowRadius: 12.84,
    elevation: 8,
  },
  tabText: {
    color: '#A5A5A5',
    fontSize: 16,
    fontWeight: 'bold'
  },
  tabbody: {
    paddingHorizontal: 15,
  },
  tbtext: {
    color: '#F49815',
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 22,
    fontWeight: 'normal',
    alignSelf: 'center',
    textAlign: 'center'
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
    borderStyle: 'solid',
    color: '#000',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: 'normal',
    height: 50,
    marginBottom: 20,
    paddingHorizontal: 5,
    backgroundColor: '#ffffff',
  },
  tabftr: {
    width: '100%',
    marginTop: 20
  },
  ftrbnt: {
    backgroundColor: '#F49815',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 60,
  },
  ftrbnttext: {
    color: '#ffffff',
    fontSize: 20,
    lineHeight: 30,
    fontWeight: 'normal',
    textTransform: 'uppercase',
  },
  datewrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateimg: {
    width: 30,
    height: 30
  },
  slash: {
    color: '#A5A5A5',
    fontSize: 20,
    marginTop: 10,
    lineHeight: 22,
    fontWeight: 'normal'    
  },
  dttm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inputhalf: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
    borderStyle: 'solid',
    color: '#000',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: 'normal',
    height: 50,
    width: '40%',
    paddingHorizontal: 5,
    backgroundColor: '#ffffff',
  },
  subhdr: {
    color: '#A5A5A5',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'normal',
    marginBottom: 0,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#ECECEC',    
  },
  headersearch: {
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    // paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    borderRadius: 5,
  },
  backbtnsrch: {
    position: 'absolute',
    left: 18,
    // top: 21,
  },
  searchinput: {
    borderWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#ECECEC',
    borderStyle: 'solid',
    color: '#000',
    fontSize: 15,
    fontWeight: 'normal',
    height: 50,
    width: '80%',
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
  },
  fromtoli: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: '#ECECEC',
    borderStyle: 'solid',
    paddingVertical: 15,
    paddingHorizontal: 15,
    // flexDirection: 'row',
    // justifyContent: 'space-between'
  },
  ftairport: {
    color: '#666666',
    fontSize: 16,
    letterSpacing: 1,
    fontWeight: 'normal'
  },
  airportDes: {
    color: '#666666',
    fontSize: 13,
    letterSpacing: 1,
    fontWeight: 'normal'
  },
  ftin: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  ftcity: {
    color: '#000000',
    fontSize: 18,
    letterSpacing: 1,
    fontWeight: 'normal'
  },
  ftlb: {
    color: '#ffffff',
    minWidth: 70,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    backgroundColor: '#F49815',
    borderRadius: 10,
    overflow:'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10
  },
  nodatadv: {
    backgroundColor: '#ECECEC',
    alignSelf: 'center',
    flex: 1,
    padding : 15,
    borderRadius: 5,
    textAlign: 'center',
    margin: 20
  },
  nodatatxt: {
    color: '#666666',
    fontSize: 16,
    letterSpacing: 1,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: 'normal'
  },
  nodataback: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#F49815',
    borderRadius: 50,
    width: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  nodatabackimg: {
    width: 26,
    height: 20,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 8,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});