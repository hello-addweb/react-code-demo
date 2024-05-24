import React from 'react';
import { View, Modal } from "react-native";
import FlightSearch from "./FlightSearch";
import { RootSiblingParent } from 'react-native-root-siblings';

export default function SearchFlight(props) {


    return (
        <View>
            <Modal
                animationType="slide"
                transparent={false}
                visible={props.isVisible}
                onRequestClose={() => {
                    props.onSelectFlight("closeModal");
                }}
            >
                <RootSiblingParent>
                    <FlightSearch {...props} onBackPress={() => props.onSelectFlight("closeModal")} onSelectFlight={data => { props.onSelectFlight(data) }} selectedItem={props.selectedItem} />
                </RootSiblingParent>
            </Modal>
        </View>
    )
}

