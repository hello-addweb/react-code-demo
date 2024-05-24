import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, TextInput } from "react-native";
import styles from "App/Assets/Styles/Components/SearchFlight/FlightSearch";
import Svg, { Image, Defs, Mask, Rect } from "react-native-svg";
import airportSearchAction from "App/Stores/Journey/AirportSearch/Actions"
import { useSelector, useDispatch } from "react-redux";

import Modal from "react-native-modal";
import Colors from "App/Assets/Constants";
import Images from "App/Assets/Images";
const { width, height } = Dimensions.get("window");
import { Icon } from "react-native-elements";
import Loader from "App/Components/Loader";
import { _t } from "../../../../Utils";

const airportsArr = [
  {
    code: "Del",
    city: "Delhi",
    name: "Indira Gandhi International",
    state: "Gujarat",
    country: "India"
  },
  {
    code: "Amd",
    city: "Ahmedabad",
    name: "Sardar vallabhbhai patel internationl",
    state: "Gujarat",
    country: "India"
  },
  {
    code: "Bom",
    city: "Mumbai",
    name: "Chatrapati Shivaji International",
    state: "Gujarat",
    country: "Maharashtra"
  },
  {
    code: "Cph",
    city: "Copenhagen",
    name: "Copenhagen Airport",
    state: "Copenhagen",
    country: "Denmark"
  },
  {
    code: "CDG",
    city: "Paris",
    name: "Paris-Charles de Gaulle",
    state: "Paris",
    country: "France"
  }
]


function AirportSearch({ isVisible, onRequestClose, selected, onSelectPlace }) {
  const [searchLoading, setSearchLoading] = useState(false);
  const [title, setTitle] = useState(_t('flight.flight-search-title'));
  const [airports, setAirports] = useState(airportsArr)
  const [airportDetails, setAirportDetails] = useState([])

  const dispatch = useDispatch();
  const airportSearch = useSelector(state => state.airportSearch)

  useEffect(() => {
    if (searchLoading) {

      if (!airportSearch.airportSearchIsLoading && airportSearch.airportSearchErrorMessage === null) {
        setSearchLoading(false);
        setAirports(airportSearch.airportSearch);
      }
      if (!airportSearch.airportSearchIsLoading && airportSearch.airportSearchErrorMessage !== null) {
        setSearchLoading(false);
      }
    }
  }, [airportSearch])

  useEffect(() => {

    let airportDetailsArr = []

    airports.filter(item => {
      let arrFinal = []
      let arr = []

      arrFinal.push(item.code)

      if(item.city.trim() != '') {
        arr.push(item.city)
      }
      if(item.state.trim() != '') {
        arr.push(item.state)
      }
      if(item.country.trim() != '') {
        arr.push(item.country)
      }

      arrFinal.push(arr)
      airportDetailsArr.push(arrFinal)
    })

    setAirportDetails(airportDetailsArr)
  }, [airports])

  useEffect(() => {
    if (isVisible) {
      if (selected !== '') {
        onChangeSearchText(selected.city)
      } else {
        onChangeSearchText("")
      }
    }
  }, [isVisible])


  function onChangeSearchText(value) {
    let checkValueLength = value

    checkValueLength = checkValueLength.replace(/(^\s*)|(\s*$)/gi,"");
    checkValueLength = checkValueLength.replace(/[ ]{2,}/gi," ");
    checkValueLength = checkValueLength.replace(/\n /,"\n");


    if(checkValueLength.split('').length < 3) {
    }

    if (value === "") {
      setAirports(airportsArr)
      setTitle(_t('flight.flight-search-title'));
      setSearchLoading(false);
    }
    else if(checkValueLength.split('').length < 3) {
      setAirports(airportsArr)
      setTitle(_t('flight.flight-search-title'));
      setSearchLoading(false);
    }
    else {

      setSearchLoading(true);
      setTitle("Search results...");
      dispatch(airportSearchAction.airportSearch(value))
    }
  }

  const renderData = (item) => {
   let details = airportDetails.filter(airport => {
     if(airport.length > 0 && airport[0] !== '') {
       if (item.code === airport[0]){
         return airport
       }
     }
    })

    if(details.length > 0 && details[0] ) {
      let landmarkDetails = details[0][1].join(', ')
      return landmarkDetails
    }

    return ''
  }

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.8}
      animationIn="slideInUp"
      animationOut="fadeOutDown"
      style={{ margin: 0 }}
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      onBackButtonPress={onRequestClose}
    >
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ height: 120 }}>
          <View style={styles.header}>
            <View style={styles.headersearch}>
              <TouchableOpacity onPress={onRequestClose} style={styles.backbtnsrch}>
                <Icon name="md-arrow-back" type="ionicon" size={30} color={Colors.orange} style={styles.backbtnIcon} />
              </TouchableOpacity>
              <TextInput
                style={styles.searchinput}
                placeholder={_t('flight.flight-search-text')}
                defaultValue={selected?.city}
                onChangeText={(value) => onChangeSearchText(value)}
              />
            </View>
          </View>
          <View style={{ zIndex: -1 }}>
            <Svg height={height} width={width}>
              <Image height={120} width={width} href={Images.orange_bg} preserveAspectRatio="xMidYMid slice" clipPath={"url(#clip)"} />
              <Defs>
                <Mask id="mask" x="0" y="0" height={height / 2} width="100%">
                  <Rect height="100%" width="100%" fill="#fff" />
                </Mask>
              </Defs>
              <Rect height={120} width="100%" fill="rgba(0, 0, 0, 0.4)" mask="url(#mask)" fill-opacity="0" />
            </Svg>
          </View>
        </View>

        <View style={{ height: height }}>
          {
            searchLoading ?
              <Loader size={50} color={Colors.orange} style={{ marginTop: -200 }} />
              :
              <ScrollView style={styles.scrollwrap} contentContainerStyle={{ paddingBottom: 150 }}>
                {
                  airports.length > 0 ?
                    <View>
                      <Text style={styles.subhdr}> {title} </Text>

                      <View style={styles.fromtoul}>

                        {airports.map(item => (
                          <View style={styles.fromtoli}>
                            <TouchableOpacity onPress={() => onSelectPlace(item, selected)} key={item.code} >
                              <View style={styles.ftin}>
                                <Text style={styles.ftlb}>{item.code}</Text>
                                <Text style={styles.ftcity}>{item.city}</Text>
                              </View>
                              <Text style={styles.ftairport}>{item.name}</Text>
                              <Text style={styles.airportDes}>{renderData(item)}</Text>
                            </TouchableOpacity>

                          </View>
                        ))}

                      </View>
                    </View> :
                    <View style={{ height: height - 100, justifyContent: "center", alignItems: "center" }}>
                      <Text>no data found</Text>
                    </View>
                }
              </ScrollView>
          }


        </View>

      </View>
    </Modal>
  );
}

export default AirportSearch;
