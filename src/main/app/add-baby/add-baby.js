/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-key */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react/prop-types */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from "react";
import * as Animatable from "react-native-animatable";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { fadeIn, slideOutLeft } from "../../../assets/anim/index";

export default class AddBaby extends Component {
  state = {};

  render() {
    return (
      <Animatable.View
        animation={fadeIn}
        style={styles.mainContent}
      >
        <Text style={styles.title}>My Babies Infomartion</Text>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    width: "100%",
    height: "100%",
    display: "flex",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontFamily: "bold",
    marginTop: 40,
    marginLeft: 20,
    color: "#000",
  },
  
});
