import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const RenderFix = ({data}) => {
  return (
    <View>
      {data.type === 'color' && (
        <View style={[styles.circle, {backgroundColor: data.value}]}></View>
      )}
      {data.type === 'image' && 
        <View style={styles.imageBox}>
          <Image style={styles.image} source={{ uri: data.value }} />
        </View>
      }
      {data.type === 'text' && (
        <Text style={styles.contentText}>{data.value}</Text>
      )}
    </View>
  );
};

export default RenderFix;

const styles = StyleSheet.create({
  circle: {
    width: 16,
    height: 16,
    borderRadius: 100,
    marginTop: 3,
    marginHorizontal: 3,
  },
  imageBox: {
    flex:1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  image:{
    flex:1,
    width:50,
    maxHeight:19,
    resizeMode: "contain",
  }
});
