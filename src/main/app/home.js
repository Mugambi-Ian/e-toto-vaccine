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
import { fadeIn, slideInUp, slideOutLeft } from "../../assets/anim/index";
import AddBaby from "./add-baby/add-baby";

export default class Home extends Component {
  state = {
    activeScreen: null,
    myBabies: [],
  };

  async componentDidMount() {
    this.props.init();
  }
  render() {
    return this.state.activeScreen === null ? (
      <Animatable.View animation={fadeIn} style={styles.mainContent}>
        {this.state.myBabies.length === 0 ? (
          <Animatable.View
            animation={slideInUp}
            duration={300}
            style={{ flex: 1, justifyContent: "center" }}
          >
            <Image
              source={require("../../assets/drawables/icons/logo.png")}
              style={styles.noBabiesLogo}
            />
            <Text style={styles.noBabiesTxt}>
              Click on the button below to start scheduling
            </Text>
            <Image
              source={require("../../assets/drawables/icons/next.png")}
              style={styles.noBabiesImg}
            />
          </Animatable.View>
        ) : (
          ""
        )}
        <TouchableOpacity
          style={styles.addBaby}
          onPress={async () => {
            await setTimeout(() => {
              this.setState({ activeScreen: AddBaby });
            }, 100);
          }}
        >
          <Image
            source={require("../../assets/drawables/icons/add.png")}
            style={styles.addBabyImg}
          />
        </TouchableOpacity>
      </Animatable.View>
    ) : (
      <this.state.activeScreen />
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#f4741f",
  },
  noBabiesTxt: {
    color: "#fff",
    alignSelf: "center",
    fontSize: 22,
    maxWidth: "80%",
    fontFamily: "bold",
  },
  noBabiesImg: {
    width: 30,
    height: 30,
    position: "absolute",
    bottom: 20,
    right: 80,
  },
  noBabiesLogo: {
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
  },
  addBaby: {
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: 50,
    height: 60,
    width: 60,
    backgroundColor: "#fff",
    elevation: 2,
    justifyContent: "center",
  },
  addBabyImg: {
    alignSelf: "center",
    height: 40,
    width: 40,
  },
});
