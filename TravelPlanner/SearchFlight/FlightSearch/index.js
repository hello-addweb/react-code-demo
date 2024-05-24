import React, { useState, Fragment, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions, Keyboard, Modal } from "react-native";
import styles from "App/Assets/Styles/Components/SearchFlight/FlightSearch";
import Svg, { Circle, ClipPath, Image, Defs, Mask, Rect } from "react-native-svg";
import moment from "moment";
import Colors from 'App/Assets/Constants';
import Images from 'App/Assets/Images';
const { width, height } = Dimensions.get("window");
import { Icon } from "react-native-elements";
import Calender from "./Components/Calender";
import TextInput from "./Components/TextInput";
import AirportSearch from "./Components/AirportSearch";
import DateTimePickerModal, { Header } from "react-native-modal-datetime-picker";
import SearchResults from './Components/SearchResults'
import { useSelector, useDispatch } from "react-redux";
import flightDetailAction from 'App/Stores/Journey/FlightDetail/Actions';
import searchFlightThrowAirportAction from "@/Stores/Journey/SearchFlightThrowAirport/Actions";
import Loader from 'App/Components/Loader';
import { Toast, _t } from "App/Utils";

import AwesomeAlert from 'react-native-awesome-alerts';


function FlightSearch(props) {
  const dispatch = useDispatch();
  const flightDetail = useSelector(state => state.flightDetail);
  const searchFlightThroughAirport = useSelector(state => state.searchFlightThroughAirport)
  const flightInputRef = React.createRef();

  const [selected, setSelected] = useState("flight");
  const [isCalenderVisible, setCalenderVisible] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [searchType, setSearchType] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [fromPlace, setFromPlace] = useState('');
  const [toPlace, setToPlace] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [flightNo, setFlightNo] = useState(props.selectedItem.flight_no);
  const [showResults, setShowResults] = useState(false);
  const [resultArray, setResultArray] = useState([]);
  const [searchFlightLoading, setSearchFlightLoading] = useState(false);
  const [isFocus, setFocus] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [searchFlightThroughAirportLoading, setSearchFlightThroughAirportLoading] = useState(false)


  useEffect(() => {
    if (searchFlightLoading) {
      if (!flightDetail.flightDetaiIsLoading && flightDetail.flightDetaiErrorMessage === null) {
        if (flightDetail.flightData.Flights) {
          setResultArray(flightDetail.flightData.Flights);
          setShowResults(true);
          setSearchFlightLoading(false);
        } else {
          setShowAlert(true)
          setSearchFlightLoading(false);
        }
      } else if (!flightDetail.flightDetaiIsLoading && flightDetail.flightDetaiErrorMessage !== null) {
        setShowAlert(true)
        setSearchFlightLoading(false);
      }
    }
  }, [flightDetail]);

  useEffect(() => {
    if (searchFlightThroughAirportLoading) {
      if (!searchFlightThroughAirport.SearchFlightThroughAirportIsLoading && searchFlightThroughAirport.SearchFlightThroughAirportErrorMessage === null) {
        if (searchFlightThroughAirport.SearchFlightThroughAirport.Flights) {
          setResultArray(searchFlightThroughAirport.SearchFlightThroughAirport.Flights);
          setShowResults(true);
          setSearchFlightThroughAirportLoading(false);
        } else {
          setShowAlert(true)
          setSearchFlightThroughAirportLoading(false);
        }
      }
      if (!searchFlightThroughAirport.SearchFlightThroughAirportIsLoading && searchFlightThroughAirport.SearchFlightThroughAirportErrorMessage !== null) {
        setShowAlert(true)
        setSearchFlightThroughAirportLoading(false);
      }
    }
  }, [searchFlightThroughAirport])


  useEffect(() => {
    if (isFocus === true && selected !== 'airport') {
      setTimeout(() => {
        if (flightInputRef.current && isFocus === true) {
          flightInputRef.current.focus();
        }
      }, 1000);
    }
  }, [isFocus]);



  useEffect(() => {
    if (props.selectedItem.flight_no !== "") {
      setFlightNo(props.selectedItem.flight_no);
      setDepartureDate(props.selectedItem.startTimeUnix * 1000);
    }
  }, [props.selectedItem])

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    setDepartureTime(date)
  };


  const onTabPress = tab => {
    setSelected(tab);
  };

  const onRequestClose = () => {
    setCalenderVisible(false);
    setSearchVisible(false);
    setFocus(true);
  };


  const onSelectDate = (date, day) => {
    setDepartureDate(day.timestamp);
    setCalenderVisible(false);

  };

  const onPressSearch = async (type) => {
    setSearchType(type);
    setSearchVisible(true)
  };

  const onSelectPlace = async (place, type) => {
    (searchType == 'from') ? setFromPlace(place) : setToPlace(place)
    onRequestClose();
  };

  const isValid = () => {
    if (selected === 'airport') {
      return (departureDate !== '' && ((fromPlace !== '' && toPlace !== '') || ((fromPlace !== '' || toPlace !== '') && departureTime !== ''))) ? true : false;
    } else {
      return (departureDate !== '' && flightNo !== '') ? true : false;
    }
  };

  const onPressSearchFlight = () => {
    Keyboard.dismiss()
    setSearchFlightLoading(true);
    let date = new Date(moment.unix(departureDate / 1000))
    let flightData = {
      number: flightNo,
      time: moment(date).format("YYYYMMDD")
    }
    dispatch(flightDetailAction.searchFlight(flightData));
  }

  const onSearchFlightThroughAirport = () => {
    let date = new Date(moment.unix(departureDate / 1000))
    let searchFlightData;
    if (departureDate !== '' && fromPlace !== '' && toPlace !== '' && departureTime !== '') {
      searchFlightData = {
        depap: fromPlace.code,
        depdate: moment(date).format("YYYYMMDD"),
        arrap: toPlace.code,
        dephr: moment(departureTime).format("HHmm")
      }
    } else if (departureDate !== '' && fromPlace !== '' && toPlace !== '' && departureTime === '') {
      searchFlightData = {
        depdate: moment(date).format("YYYYMMDD"),
        depap: fromPlace.code,
        arrap: toPlace.code
      }
    } else if (departureDate !== '' && fromPlace === '' && toPlace !== '' && departureTime !== '') {
      searchFlightData = {
        ARRDATE: moment(date).format("YYYYMMDD"),
        ARRAP: toPlace.code,
        ARRHR: moment(departureTime).format("HHmm")
      }
    } else if (departureDate !== '' && fromPlace !== '' && toPlace === '' && departureTime !== '') {
      searchFlightData = {
        DEPDATE: moment(date).format("YYYYMMDD"),
        DEPAP: fromPlace.code,
        DEPHR: moment(departureTime).format("HHmm")
      }
    } else {
      searchFlightData = null
    }

    if (fromPlace.code === toPlace.code) {
      Toast.show(_t("createAndEditJourney.source-destination-same-error"), "error");
      return;
    }

    dispatch(searchFlightThrowAirportAction.SearchFlightThroughAirport(searchFlightData))
    setSearchFlightThroughAirportLoading(true);

  }

  if (showResults) {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={showResults}
        onRequestClose={() => {
          setShowResults(false);
        }}>
        <SearchResults {...props} onRequestClose={() => setShowResults(false)} data={resultArray} type={selected} onSelectFlight={data => props.onSelectFlight(data)} selectedItem={props.selectedItem} fromPlace={fromPlace} toPlace={toPlace}   />
      </Modal>)
  } else {
    return (
      <View style={styles.container}>

        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title=""
          overlayStyle={{backgroundColor: 'rgba(0,0,0,0.8)'}}
          message={_t("errorMessage.search-flight-error")}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={false}
          cancelText="Close"
          confirmText="Yes, delete it"
          cancelButtonColor={Colors.orange}
          onCancelPressed={() => {
           setShowAlert(false)
          }}
          onConfirmPressed={() => {
            setShowAlert(false)
          }}
        />

        <Calender isVisible={isCalenderVisible} onSelectDate={onSelectDate} onRequestClose={onRequestClose} selected={departureDate === "" ? "" : moment(departureDate).format("DD/MM/YYYY")} title={_t('Global.departure-date')} />

        <AirportSearch isVisible={isSearchVisible} onSelectPlace={onSelectPlace} onRequestClose={onRequestClose} selected={searchType === 'from' ? fromPlace : searchType === 'to' ? toPlace : ''} />

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          titleIOS={'Departure time'}
          customHeaderIOS={(props) => <Header label="Select Time" />}
          onCancel={hideDatePicker}
          date={departureTime === '' ? new Date() : departureTime}
          is24Hour={true}
          locale="en_GB"
        />

        <View style={styles.header}>
          <TouchableOpacity style={styles.backbtn} onPress={() => props.onBackPress()}>
            <Icon name="md-arrow-back" type="ionicon" size={30} color={Colors.orange} style={styles.backbtnIcon} />
          </TouchableOpacity>

          <Text style={styles.headertxt}>{_t("flight.search-flight-title")}</Text>
        </View>
        <View style={{ zIndex: -1 }}>
          <Svg height={height} width={width}>
            <ClipPath id="clip">
              <Circle r={height / 2.5} cx={width / 2} />
            </ClipPath>
            <Image height={height / 2.5} width={width} href={Images.orange_bg} preserveAspectRatio="xMidYMid slice" clipPath={"url(#clip)"} />
            <Defs>
              <Mask id="mask" x="0" y="0" height={height / 2} width="100%">
                <Rect height="100%" width="100%" fill="#fff" />
              </Mask>
            </Defs>
            <Circle r={height / 2.5} cx={width / 2} fill="rgba(0, 0, 0, 0.5)" mask="url(#mask)" fill-opacity="0" />
          </Svg>
        </View>

        <View style={[styles.innerView, { marginHorizontal: 20 }]}>
          <View style={styles.tabView}>
            <TouchableOpacity onPress={() => onTabPress("flight")} style={[styles.tabBtn, selected === "flight" ? styles.tabBtnActive : {}]}>
              <Text style={[styles.tabText, selected === "flight" ? styles.activeText : {}]}>{_t('flight.flight-no-title')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onTabPress("airport")} style={[styles.tabBtn, selected === "airport" ? styles.tabBtnActive : {}]}>
              <Text style={[styles.tabText, selected === "airport" ? styles.activeText : {}]}>{_t('flight.airport-title')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabwrap}>
            <View style={styles.datecard}>
              <View style={styles.bookwrap}>
                <Text style={{ paddingVertical: 10, fontSize: 14, color: "#999" }}>{_t('flight.departure-date-title')}</Text>
                <View style={styles.datewrap}>
                  <TouchableOpacity onPress={() => {
                    setCalenderVisible(true)
                    setFocus(false)
                  }} disabled={searchFlightLoading} style={[{ width: "100%", borderColor: "#efefef", borderWidth: 2, borderRadius: 5 }]}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Icon
                        name="md-calendar"
                        type="ionicon"
                        size={30}
                        color={Colors.orange}
                        containerStyle={{ paddingVertical: 5, paddingHorizontal: 12, backgroundColor: "#efefef", marginRight: 20 }}
                      />
                      <Text style={[{ color: departureDate !== '' ? '#333' : '#999', fontSize: 20 }]}>{(departureDate && departureDate !== '') ? moment(departureDate).format("DD/MM/YYYY") : 'DD/MM/YYYY'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.tabchange}>
              <View style={styles.tabbody}>
                {selected === "flight" && (
                  <TextInput
                    editable={!searchFlightLoading}
                    label={_t('flight.flight-number-placeholder')}
                    title={_t('flight.flight-number-format-text')}
                    renderLeftAccessory={() => (
                      <Icon
                        name="md-airplane"
                        type="ionicon"
                        size={30}
                        color={Colors.orange}
                        containerStyle={{ paddingVertical: 5, paddingHorizontal: 12, backgroundColor: "#efefef", marginRight: 20 }}
                      />
                    )}
                    value={flightNo}
                    ref={flightInputRef}
                    name="flight_no"
                    fontSize={18}
                    onChangeText={(value) => setFlightNo(value)}
                    containerStyle={{ width: "100%" }}
                    blurOnSubmit={false}
                    returnKeyType={"next"}
                    onSubmit={() => onPressSearchFlight()}
                  />
                )}

                {selected === "airport" && (
                  <Fragment>
                    <View style={{ marginBottom: 20 }}>
                      <TouchableOpacity onPress={() => onPressSearch('from')} style={[{ width: "100%", borderColor: "#efefef", borderBottomWidth: 2 }]}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>

                          {fromPlace === '' ? (
                            <Icon
                              name="ellipsis-h"
                              type="font-awesome"
                              size={30}
                              color={Colors.orange}
                              containerStyle={{
                                paddingVertical: 0,
                                paddingHorizontal: 12,
                                backgroundColor: "#efefef",
                                marginRight: 20,
                                marginBottom: 10,
                                borderRadius: 5
                              }}
                            />
                          ) :
                            (
                              <View style={{
                                backgroundColor: Colors.orange,
                                marginRight: 20,
                                marginBottom: 10,
                                borderRadius: 5
                              }}>
                                <Text style={{ paddingHorizontal: 10, paddingVertical: 6, color: Colors.white, fontWeight: 'bold', textTransform: 'uppercase' }}>{fromPlace.code}</Text>
                              </View>
                            )}

                          <Text style={[{ color: fromPlace !== '' ? '#333' : "#999", fontSize: 20, marginTop: -10 }]}>{fromPlace !== '' ? fromPlace.city : _t('flight.airport-search-from-title')}</Text>
                          {fromPlace !== '' &&
                            <Icon
                              name="times"
                              type="font-awesome"
                              size={25}
                              color={Colors.orange}
                              containerStyle={{
                                paddingHorizontal: 12,
                                marginBottom: 10,
                                borderRadius: 5,
                                position: 'absolute',
                                right: 0
                              }}
                              onPress={() => setFromPlace('')}
                            />
                          }
                        </View>
                      </TouchableOpacity>
                    </View>


                    <View style={{ marginBottom: 20 }}>
                      <TouchableOpacity onPress={() => onPressSearch('to')} style={[{ width: "100%", borderColor: "#efefef", borderBottomWidth: 2 }]}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          {toPlace === '' ? (
                            <Icon
                              name="ellipsis-h"
                              type="font-awesome"
                              size={30}
                              color={Colors.orange}
                              containerStyle={{
                                paddingVertical: 0,
                                paddingHorizontal: 12,
                                backgroundColor: "#efefef",
                                marginRight: 20,
                                marginBottom: 10,
                                borderRadius: 5
                              }}
                            />
                          ) :
                            (
                              <View style={{
                                backgroundColor: Colors.orange,
                                marginRight: 20,
                                marginBottom: 10,
                                borderRadius: 5
                              }}>
                                <Text style={{ paddingHorizontal: 10, paddingVertical: 6, color: Colors.white, fontWeight: 'bold', textTransform: 'uppercase' }}>{toPlace.code}</Text>
                              </View>
                            )}
                          <Text style={[{ color: toPlace !== '' ? '#333' : "#999", fontSize: 20, marginTop: -10 }]}>{toPlace !== '' ? toPlace.city : _t('flight.airport-search-to-title')}</Text>
                          {toPlace !== '' &&
                            <Icon
                              name="times"
                              type="font-awesome"
                              size={25}
                              color={Colors.orange}
                              containerStyle={{
                                paddingHorizontal: 12,
                                marginBottom: 10,
                                borderRadius: 5,
                                position: 'absolute',
                                right: 0
                              }}
                              onPress={() => setToPlace('')}
                            />
                          }
                        </View>
                      </TouchableOpacity>
                      <Text style={{ paddingVertical: 2, fontSize: 10, color: "#999" }}>{_t('flight.airport-format-text')}</Text>
                    </View>

                    <View style={{ marginBottom: 20 }}>
                      <TouchableOpacity onPress={showDatePicker} style={[{ width: "100%", borderColor: "#efefef", borderBottomWidth: 2 }]}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Icon
                            name="md-time"
                            type="ionicon"
                            size={30}
                            color={Colors.orange}
                            containerStyle={{ paddingVertical: 0, paddingHorizontal: 12, marginRight: 20, marginBottom: 10, borderRadius: 5 }}
                          />
                          <Text style={[{ color: departureTime !== '' ? '#333' : "#999", fontSize: 20, marginTop: -10 }]}>{departureTime !== '' ? moment(departureTime).format('HH:mm') : 'Departure Time'}</Text>
                          {departureTime !== '' &&
                            <Icon
                              name="times"
                              type="font-awesome"
                              size={25}
                              color={Colors.orange}
                              containerStyle={{
                                paddingHorizontal: 12,
                                marginBottom: 10,
                                borderRadius: 5,
                                position: 'absolute',
                                right: 0
                              }}
                              onPress={() => setDepartureTime('')}
                            />
                          }
                        </View>
                      </TouchableOpacity>
                    </View>
                  </Fragment>
                )}
              </View>

              <View style={styles.tabftr}>
                <TouchableOpacity
                  onPress={selected === 'airport' ? () => onSearchFlightThroughAirport() : () => onPressSearchFlight()}
                  disabled={!isValid() || searchFlightLoading}
                  style={[styles.ftrbnt, !isValid() ? { backgroundColor: '#999' } : {}]}
                >
                  {
                    searchFlightLoading || searchFlightThroughAirportLoading ? <Loader size={30} color="#fff" /> : <Text style={styles.ftrbnttext}>{_t('flight.search-button-text')}</Text>
                  }

                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }



};

export default FlightSearch;
