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
import {
  StyleSheet,
  BackHandler,
  View,
  Image,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  slideOutRight,
  slideInRight,
  fadeIn,
} from "../../../assets/anim/index";
import {
  _storage,
  _firebase,
  _database,
  _auth,
} from "../../../assets/config/index";
import { StatusBar } from "expo-status-bar";
import ViewPager from "@react-native-community/viewpager";
import { createReminder } from "../../../assets/config/calendar";
export default class Schedule extends Component {
  state = {
    mySchedule: [],
    currentScreen: 0,
    closeActive: false,
    reminder: undefined,
    event: {
      summary: "Google I/O 2015",
      location: "800 Howard St., San Francisco, CA 94103",
      description: "A chance to hear more about Google's developer products.",
      start: {
        dateTime: "2015-05-28T09:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: "2015-05-28T17:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
      recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
      attendees: [
        { email: "lpage@example.com" },
        { email: "sbrin@example.com" },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    },
    auth: false,
  };

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      async () => {
        this.setState({ closeActive: true });
        await setTimeout(() => {
          this.props.closeActive();
        }, 300);
      }
    );
    const sc = [];
    this.props.schedule.forEach((x) => {
      if (x.numOfDays >= this.props.age()) {
        sc.push(x);
      }
    });
    this.setState({ mySchedule: sc });
  }
  async componentWillUnmount() {
    this.backHandler.remove();
  }
  getAppointment(x, i) {
    var result = undefined;
    if (x === i.numOfDays) {
      result = i.vaccineCode + " today";
    } else if (x < i.numOfDays) {
      var _d = i.numOfDays - x;
      result =
        _d === 1
          ? i.vaccineCode + " in 1 day"
          : i.vaccineCode + " in " + _d + " days";
    }
    return result ? result : "Schedule Completed";
  }

  render() {
    return (
      <Animatable.View
        animation={!this.state.closeActive ? slideInRight : slideOutRight}
        duration={350}
        style={styles.mainContent}
      >
        <StatusBar style="dark" />
        {this.state.mySchedule.length > 0 ? (
          <>
            <ViewPager
              style={styles.viewPager}
              initialPage={0}
              onPageSelected={(x) => {
                this.setState({ currentScreen: x.nativeEvent.position });
              }}
            >
              {this.state.mySchedule.map((d, i) => {
                return (
                  <View style={styles.page} key={i}>
                    <View style={styles.imageCard}>
                      <Image
                        source={require("../../../assets/drawables/icons/calendar.png")}
                        style={styles.icon}
                      />
                    </View>
                    <Text style={styles.text}>
                      {this.getAppointment(this.props.age(), d)}
                    </Text>
                    <Text style={styles.text1}>{d.vaccineName}</Text>
                    <Text style={styles.text2}>{d.description}</Text>
                    <TouchableOpacity
                      style={styles.scheduleBtn}
                      onPress={async () => {
                        await setTimeout(() => {
                          createReminder(d.vaccineName);
                        }, 100);
                      }}
                    >
                      <Image
                        source={require("../../../assets/drawables/icons/google_calendar.png")}
                        style={styles.scheduleBtnImg}
                      />
                      <Text style={styles.scheduleBtnText}>
                        Create Reminder
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ViewPager>
            <View style={styles.pageMarkers}>
              {this.state.mySchedule.map((x, i) => {
                return this.state.currentScreen === i ? (
                  <Animatable.View
                    style={styles.pageMarkerCurrent}
                    animation={fadeIn}
                  />
                ) : (
                  <Animatable.View
                    style={styles.pageMarker}
                    animation={fadeIn}
                  />
                );
              })}
            </View>
          </>
        ) : (
          <Animatable.View
            animation={fadeIn}
            style={{ flex: 1, justifyContent: "center" }}
          >
            <Image
              source={require("../../../assets/drawables/icons/logo.png")}
              style={styles.logo}
            />
            <Text style={styles.text}>Schedule Completed</Text>
            <View style={styles.circle}>
              <Image
                source={require("../../../assets/drawables/icons/ticket.png")}
                style={styles.circleIcon}
              />
            </View>
          </Animatable.View>
        )}
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    height: "100%",
    width: "100%",
    display: "flex",
    backgroundColor: "#fff",
  },
  viewPager: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  imageCard: {
    backgroundColor: "#f4741f",
    width: 150,
    height: 150,
    margin: 5,
    marginBottom: 10,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
  },
  icon: { height: 100, width: 100, alignSelf: "center" },
  logo: { height: 200, width: 200, alignSelf: "center", marginBottom: 10 },
  circle: {
    backgroundColor: "#f4741f",
    width: 70,
    height: 70,
    marginTop: 20,
    marginBottom: 50,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 100,
  },
  circleIcon: { height: 50, width: 50, alignSelf: "center" },
  text: {
    marginTop: 5,
    fontSize: 24,
    fontFamily: "bold",
    marginBottom: 5,
    color: "#f4741f",
    alignSelf: "center",
  },
  text1: {
    fontSize: 20,
    fontFamily: "medium",
    color: "#f4741f",
    marginTop: 20,
  },
  text2: {
    fontSize: 20,
    fontFamily: "regular",
    color: "#000",
    marginLeft: 20,
    marginRight: 20,
    textAlign: "center",
    marginBottom: 40,
  },
  scheduleBtn: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 5,
    borderWidth: 2,
    borderColor: "#f4741f",
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 5,
    width: "80%",
  },
  scheduleBtnImg: {
    height: 30,
    width: 30,
  },
  scheduleBtnText: {
    alignSelf: "center",
    fontFamily: "medium",
    marginLeft: 10,
    color: "#f4741f",
    fontSize: 18,
    marginBottom: 5,
  },
  pageMarkers: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    width: "40%",
    justifyContent: "center",
    flexDirection: "row",
  },
  pageMarkerCurrent: {
    height: 2,
    flex: 3,
    backgroundColor: "#f4741f",
    borderRadius: 10,
    marginLeft: 2,
    marginRight: 2,
  },
  pageMarker: {
    height: 2,
    flex: 1,
    backgroundColor: "#f4741f",
    borderRadius: 10,
    marginLeft: 2,
    marginRight: 2,
  },
});
