import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import styles from "App/Assets/Styles/Components/SearchFlight/FlightSearch";
import Modal from "react-native-modal";
import Colors from 'App/Assets/Constants';
import Images from 'App/Assets/Images';
import { Icon, ListItem } from "react-native-elements";
import moment from "moment";
import { Card, CardItem, Body, Col, Grid } from "native-base";
import FastImage from "react-native-fast-image";
import { _t, Toast } from "../../../../Utils";
import Loader from 'App/Components/Loader';
import { ApiEndPoints } from "App/Constant";
import { API } from "aws-amplify";
import { RootSiblingParent } from 'react-native-root-siblings';

const { width, height } = Dimensions.get("window");

function SearchResultsNew(props) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [flightInfoData, setFlightInfoData] = useState({});
  const flightDetails = props.data;
  const [selectLoadingIndex, setSelectLoadingIndex] = useState("");

  const toggleModal = () => {
    setModalVisible(false);
  };

  const renderColumn = (title, value, isChanges) => {
    return (
      <ListItem
        leftIcon={() => {
          return (
            <View
              style={{
                width: 25,
                height: 25,
                backgroundColor: Colors.orange,
                borderRadius: 5,
                padding: 5
              }}
            >
              <FastImage resizeMode={FastImage.resizeMode.stretch} source={Images.accPlane} style={{ width: 15, height: 15 }} />
            </View>
          );
        }}
        title={title}
        subtitle={value}
        containerStyle={{
          backgroundColor: "transparent",
          padding: 0,
          margin: 0,
          marginBottom: 10
        }}
        titleStyle={{ color: "#333", fontWeight: "bold", fontSize: 10, lineHeight: 15 }}
        subtitleStyle={{ color: isChanges ? 'red' : "#333", fontSize: 9, fontWeight: isChanges ? '700' : '300' }}
      />
    );
  };

  const timeDuration = (endDate, startDate) => {
    let duration = moment.duration(moment.utc(endDate).diff(moment.utc(startDate)));
    return parseInt(duration.asHours()) + " " + _t('flight.hours-text') + " " + (parseInt(duration.asMinutes()) % 60) + " " + "min"
  }

  const showUserInfo = (info) => {
    setFlightInfoData(info)
    setModalVisible(true);
  }

  const getPlaceDetails = async (data) => {
    let myInit = {
      body: data // replace this with attributes you need
    };
    return API.post("FLIGHT_API", ApiEndPoints.GET_FLIGHT_PLACE_DETAILS, myInit)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        return null;
      });
  }

  const onConfirmFlight = async (flightData, index) => {
    setSelectLoadingIndex(index);
    props.changeLoading(true)
    try {
      const placeDetails = await getPlaceDetails(flightData);

      if(placeDetails?.departureLocation?.googlePlacesDetails?.result && placeDetails?.arrivalLocation?.googlePlacesDetails?.result) {
        props.onSelectFlight({ flightNumber: flightData?.Acid?.Airline?.Code + flightData?.Acid?.FlightNumber, item: props.selectedItem, flightDetail: flightData, "departureLocation": placeDetails?.departureLocation?.googlePlacesDetails?.result ?? {}, "destinationLocation": placeDetails?.arrivalLocation?.googlePlacesDetails?.result ?? {}, time: flightData?.ScheduledDeparture?.Utc ?? '' })
        setSelectLoadingIndex(index)
      } else {
        Toast.show(_t("myprofile.something went wrong"), "error");
        props.changeLoading(false)
      }
    } catch (err){
      Toast.show(_t("myprofile.something went wrong"), "error");
      props.changeLoading(false)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Modal
          testID={'modal'}
          isVisible={isModalVisible}
          backdropOpacity={0.8}
          animationIn="zoomIn"
          animationOut="zoomOut"
          animationInTiming={600}
          animationOutTiming={600}
          onRequestClose={toggleModal}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}>
            <RootSiblingParent>
                <View style={{ backgroundColor: '#fff', height: 300, padding: 20, borderRadius: 0 }}>
                  <View style={{ marginLeft: "auto" }}>
                      <Icon name="md-close" type="ionicon" size={25} color={Colors.orange} onPress={() => toggleModal()} />
                  </View>

                  <Grid>
                      <Col>{renderColumn(_t('flight.airport-search-from-title'), flightInfoData.hasOwnProperty('Acid') && flightInfoData.DepartureAirport.Name)}</Col>
                  </Grid>

                  <Grid>
                      <Col>{renderColumn(_t('flight.airport-search-to-title'), flightInfoData.hasOwnProperty('Acid') && flightInfoData.ArrivalAirport.Name)}</Col>
                  </Grid>

                  <Grid>
                      <Col>{renderColumn(_t('flight.flight-info-departure-date'), flightInfoData.hasOwnProperty('Acid') && moment(flightInfoData.ScheduledDeparture.Local).format('DD/MM/YYYY'))}</Col>
                      <Col>{renderColumn(_t('flight.flight-info-arrival-date'), flightInfoData.hasOwnProperty('Acid') && moment(flightInfoData.ScheduledArrival.Local).format('DD/MM/YYYY'))}</Col>
                  </Grid>

                  <Grid>
                      <Col>{renderColumn(_t('flight.flight-info-departure-time'), flightInfoData.hasOwnProperty('Acid') && moment(flightInfoData.ScheduledDeparture.Local).format('HH:mm'))}</Col>
                      <Col>{renderColumn(_t('flight.flight-info-arrival-time'), flightInfoData.hasOwnProperty('Acid') && moment(flightInfoData.ScheduledArrival.Local).format('HH:mm'))}</Col>
                  </Grid>

                  <Grid>
                      <Col>{renderColumn(_t('flight.flight-info-departure-terminal'), flightInfoData.hasOwnProperty('Acid') && flightInfoData.hasOwnProperty('Acid') && flightInfoData.DepartureTerminal)}</Col>
                      <Col>{renderColumn(_t('flight.flight-info-departure-gate'), flightInfoData.hasOwnProperty('Acid') && flightInfoData.DepartureGate)}</Col>
                  </Grid>

                  <Grid>
                      <Col>{renderColumn(_t('flight.flight-info-airline'), flightInfoData.hasOwnProperty('Acid') && flightInfoData.hasOwnProperty('Acid') && flightInfoData.Acid.Airline.Name)}</Col>
                      <Col>{renderColumn(_t('flight.duration'), flightInfoData.hasOwnProperty('Acid') && flightInfoData.hasOwnProperty('Acid') && flightInfoData.ScheduledDuration)}</Col>
                  </Grid>
                </View>
            </RootSiblingParent>
        </Modal>

      <RootSiblingParent>
        <View style={{ height: height }}>
            <ScrollView style={[styles.scrollwrap, { backgroundColor: '#E1E1E1' }]} contentContainerStyle={{ paddingBottom: 250, }}>
                <View style={[styles.fromtoul]}>
                    {flightDetails.map((item, index) => {
                      if (item?.ArrivalAirport?.Code) {
                        return (
                            <Card>
                                <CardItem  bordered>
                                    <Body>
                                        <Grid>
                                            <Col>
                                                <View style={[styles.center, { alignItems: 'flex-start' },]}>
                                                    <Text style={{ fontWeight: 'bold', color: '#999', fontSize: 17 }}>{item.DepartureAirport.Code}</Text>
                                                    <Text style={{ fontWeight: 'bold', color: Colors.orange, fontSize: 20 }}>{moment.utc(item.ScheduledDeparture.Local).format("HH:mm")}</Text>
                                                    <Text style={{  color:"#666", fontSize: 8 }}>{`(${item?.DepartureAirport?.Location?.CityName} TIME)`}</Text>
                                                </View>
                                            </Col>
                                            <Col style={{ justifyContent: 'center' }}>
                                                <TouchableOpacity  >
                                                    <View style={[styles.center,]}>
                                                    <View>
                                                        <View style={{ width: 150, borderWidth: 2, borderStyle: 'dotted', borderColor: '#efefef', position: 'absolute', alignSelf: 'center', top: 12 }}></View>
                                                        <Icon
                                                        name="md-airplane"
                                                        type="ionicon"
                                                        size={25}
                                                        color={Colors.orange}
                                                        iconStyle={{ paddingHorizontal: 10 }}
                                                        // containerStyle={{ transform: [{ rotate: '90deg' }] }}
                                                        />
                                                    </View>
                                                    <Text style={{ fontWeight: 'bold', color: '#999', fontSize: 12 }}>{timeDuration(item.ScheduledArrival.Local, item.ScheduledDeparture.Local)}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </Col>
                                            <Col>
                                                <TouchableOpacity >
                                                    <View style={[styles.center, { alignItems: 'flex-end' },]}>
                                                    <Text style={{ fontWeight: 'bold', color: '#999', fontSize: 17 }}>{item?.ArrivalAirport?.Code}</Text>
                                                    <Text style={{ fontWeight: 'bold', color: Colors.orange, fontSize: 20 }}>{moment.utc(item.ScheduledArrival.Local).format("HH:mm")}</Text>
                                                    <Text style={{  color:"#666", fontSize: 8 }}>{`(${item?.ArrivalAirport?.Location?.CityName} TIME)`}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </Col>
                                        </Grid>
                                    </Body>
                                </CardItem>
                                <CardItem style={{ borderRadius: 10 }} footer bordered>
                                    <Grid>
                                        <Col>
                                            <View style={[styles.center, { marginTop: 3, alignItems: 'flex-start' },]}>
                                            <Text style={{ fontWeight: 'bold', color: '#999' }}>{item.Acid?.Airline?.Code} {item.Acid.FlightNumber}</Text>
                                            </View>
                                        </Col>

                                        <Col>
                                            <TouchableOpacity onPress={() => showUserInfo(item)} >
                                            <View style={[{ flexDirection: 'row' }, styles.center]}>
                                                <Icon size={20} color={'#999'} name='info' />
                                                <Text style={{ color: '#999', padding: 4, paddingHorizontal: 5, }}>{_t('flight.flight-info-text')}</Text>
                                            </View>
                                            </TouchableOpacity>
                                        </Col>

                                        <Col>
                                            <TouchableOpacity onPress={() => onConfirmFlight(item, index)} >
                                            <View style={[styles.center, { flexDirection: 'row', justifyContent: 'flex-end' },]}>
                                                <View style={{ backgroundColor: Colors.orange, padding: 4, paddingHorizontal: 5, borderRadius: 3, height: 30, minHeight: 30, justifyContent: "center", alignItems: "center", width: 80 }}>
                                                {(props.loading) && selectLoadingIndex === index ?
                                                    <Loader size={15} color="#fff" />
                                                    :
                                                    <Text style={{ color: Colors.white }}>{_t('flight.select-text')}</Text>
                                                }
                                                </View>
                                            </View>
                                            </TouchableOpacity>
                                        </Col>
                                    </Grid>
                                </CardItem>
                            </Card>
                        )
                      }
                    })}
                </View>
            </ScrollView>
        </View>
      </RootSiblingParent>
    </View>
  );
}

export default SearchResultsNew;
