import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import styles from "App/Assets/Styles/Components/SearchFlight/FlightSearch";
import Svg, { Image, Defs, Mask, Rect } from "react-native-svg";

import Modal from "react-native-modal";
import { CalendarList, LocaleConfig } from "react-native-calendars";
import Colors from 'App/Assets/Constants';
import Images from 'App/Assets/Images';
const { width, height } = Dimensions.get("window");
import { Icon } from "react-native-elements";
import moment from "moment";
import { useSelector } from "react-redux";
import { _t } from "App/Utils";

LocaleConfig.locales = {
  fr: {
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: 'Aujourd\'hui'
  },
  da: {
    monthNames: ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'Aug', 'Sept', 'Okt', 'Nov', 'Dec.'],
    dayNames: ['Søndag, Mandag, Tirsdag, Onsdag, Torsdag, Fredag, ​​Lørdag'],
    dayNamesShort: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
    today: 'I dag'
  },
  en: {
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec.'],
    dayNames: ['Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    today: 'Today'
  },
  no: {
    monthNames: ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'],
    monthNamesShort: ['Jan', 'Feb', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'Aug', 'Sept', 'Okt', 'Nov', 'Des.'],
    dayNames: ['Søndag, Mandag, Tirsdag, Onsdag, Torsdag, Fredag, ​​Lørdag'],
    dayNamesShort: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
    today: 'I dag'
  },
  sw: {
    monthNames: ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Aug', 'Sept', 'Okt', 'Nov', 'Dec.'],
    dayNames: ['Söndag, Måndag, Tisdag, Onsdag, Torsdag, Fredag, ​​Lördag'],
    dayNamesShort: ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'],
    today: 'I dag'
  }

};



function CalenderView({ isVisible, onRequestClose, selected, onSelectDate, title }) {
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    selected !== "" ? { [moment(moment(selected, "DD/MM/YYYY")).format("YYYY-MM-DD")]: { selected: true, selectedColor: Colors.orange } } : {}
  );
  const calendarRef = useRef(null);

  const UserProfile = useSelector(state => state.UserProfile);
  if (UserProfile?.profile?.preferred_langauge && ["en", "da", "no", "sw"].find(lan => lan == UserProfile.profile.preferred_langauge)) {
    LocaleConfig.defaultLocale = UserProfile.profile.preferred_langauge
  } else {
    LocaleConfig.defaultLocale = 'en'
  }

  const onSelectDay = async day => {
    setActiveDate(day.dateString);
    setSelectedDate({ [day.dateString]: { selected: true, selectedColor: Colors.orange } });
    await onSelectDate(moment(day.dateString).format("DD/MM/YYYY"), day);
    await onRequestClose();
  };

  const onTapActiveDate =  date => {
    if (date == "") {
       date = new Date()
      onSelectDay({dateString: date.toISOString().split("T")[0],
      day:date.getDay(),
      month: date.getMonth(),
      timestamp: Date.parse(date.toISOString().split("T")[0]),
      year: date.getFullYear()})

    }
    else {
      var dateString = date; // Oct 23
      var dateParts = dateString.split("/");
      var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      calendarRef.current.scrollToDay(dateObject, undefined, true);
    }

  };

  useEffect(() => {
    setActiveDate(selected);
  }, [isVisible])

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.8}
      animationIn="fadeInRight"
      animationOut="fadeOutRight"
      style={{ margin: 0 }}
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
    >
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ height: 120 }}>
          <View style={styles.header}>

            <TouchableOpacity onPress={onRequestClose} style={styles.backbtn}>
              <Icon name="md-arrow-back" type="ionicon" size={30} color={Colors.orange} style={styles.backbtnIcon} />
            </TouchableOpacity>

            <Text style={styles.headertxt}>{title}</Text>
          </View>
          <View style={{ zIndex: -1 }}>
            <Svg height={height} width={width}>
              <Image height={120} width={width} href={Images.orange_bg} preserveAspectRatio="xMidYMid slice" clipPath={"url(#clip)"} />
              <Defs>
                <Mask id="mask" x="0" y="0" height={height / 2} width="100%">
                  <Rect height="100%" width="100%" fill="#fff" />
                </Mask>
              </Defs>
              <Rect height={120} width="100%" fill="rgba(0, 0, 0, 0.7)" mask="url(#mask)" fill-opacity="0" />
            </Svg>
          </View>
        </View>

        <View style={{ height: height - 180 }}>
          <CalendarList
            onVisibleMonthsChange={months => {
            }}
            ref={calendarRef}
            pastScrollRange={50}
            futureScrollRange={50}
            scrollEnabled={true}
            firstDay={1}
            selected={selected !== "" ? moment(selected, "DD/MM/YYYY").format("YYYY-MM-DD") : new Date().toISOString().split("T")[0]}
            minDate={new Date().toISOString().split("T")[0]}
            markedDates={selectedDate}
            onDayPress={day => onSelectDay(day)}
            onDayLongPress={day => {
            }}
            monthFormat={"MMMM yyyy"}
            onMonthChange={month => {
            }}
            disableAllTouchEventsForDisabledDays={true}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#b6c1cd",
              textSectionTitleDisabledColor: "#d9e1e8",
              selectedDayBackgroundColor: "#00adf5",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "red",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e1e8",
              dotColor: "#00adf5",
              selectedDotColor: "#ffffff",
              arrowColor: "orange",
              disabledArrowColor: "#d9e1e8",
              monthTextColor: Colors.orange,
              indicatorColor: "blue",
              textDayFontWeight: "300",
              textMonthFontWeight: "900",
              textDayHeaderFontWeight: "300",
              textDayFontSize: 18,
              textMonthFontSize: 20,
              textDayHeaderFontSize: 15
            }}
          />
        </View>
        <View
          style={[{ flex: 1, borderColor: "#efefef", borderWidth: 2, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }]}
        >
          <TouchableOpacity onPress={() => onTapActiveDate(activeDate)} style={customStyle.footerDateButton}>
            <Text style={[customStyle.footerDateText, selected === "" ? { color: "#999" } : {}]}>
              {selected === "" ? _t('Global.today') : moment(activeDate, "DD/MM/YYYY").format("DD/MM/YYYY")}{" "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRequestClose} style={customStyle.footerDoneButton}>
            <Text style={customStyle.footerDoneText}>{_t('Global.done')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default CalenderView;

const customStyle = StyleSheet.create({
  footerDateButton: {
    backgroundColor: "rgb(247, 247, 246)",
    borderRadius: 50,
    width: width - 200,
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  footerDoneButton: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: Colors.orange,
    borderRadius: 50
  },
  footerDateText: {
    color: Colors.orange
  },
  footerDoneText: {
    color: Colors.white,
    fontWeight: "bold"
  }
});