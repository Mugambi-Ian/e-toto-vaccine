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
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fadeIn, fadeOut, slideInUp } from "../../assets/anim/index";
import AddBaby, { EditInfo } from "./add-baby/add-baby";
import { getAge, _auth, _database } from "../../assets/config";
import ViewPager from "@react-native-community/viewpager";
import Spinner from "react-native-loading-spinner-overlay";
import Schedule from "./schedule/schedule";
import { StatusBar } from "expo-status-bar";

export default class Home extends Component {
  state = {
    activeScreen: null,
    myBabies: null,
    closeActive: false,
    currentScreen: 1,
  };

  async componentDidMount() {
    this.props.init();
    await _database
      .ref("users/" + _auth.currentUser.uid)
      .child("kids")
      .on("value", (x) => {
        const C = [];
        x.forEach((c) => {
          const _c = c.val();
          C.push(_c);
        });
        this.setState({ myBabies: C });
      });
  }
  getAppointment(x) {
    var result = undefined;
    for (let index = 0; index < this.props.schedule.length; index++) {
      const i = this.props.schedule[index];
      if (x === i.numOfDays) {
        result = i.vaccineCode + " today";
        break;
      } else if (x < i.numOfDays) {
        var _d = i.numOfDays - x;
        result =
          _d === 1
            ? i.vaccineCode + " in 1 day"
            : i.vaccineCode + " in " + _d + " days";
        break;
      }
    }
    return result ? result : "Schedule Completed";
  }
  render() {
    return this.state.activeScreen === null ? (
      <Animatable.View
        animation={!this.state.closeActive ? fadeIn : fadeOut}
        style={styles.mainContent}
        duration={500}
      >
        <StatusBar style={!this.state.closeActive ? "light" : "dark"} />
        {this.state.myBabies === null ? (
          <Spinner visible={true} />
        ) : this.state.myBabies.length === 0 ? (
          <Animatable.View
            animation={slideInUp}
            duration={500}
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
            <TouchableOpacity
              style={
                !this.state.closeActive ? styles.addBaby : { display: "none" }
              }
              onPress={async () => {
                await setTimeout(async () => {
                  this.setState({ closeActive: true });
                  await setTimeout(() => {
                    this.setState({
                      activeScreen: AddBaby,
                      openChild: undefined,
                    });
                  }, 400);
                }, 100);
              }}
            >
              <Image
                source={require("../../assets/drawables/icons/add.png")}
                style={styles.addBabyImg}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={
                !this.state.closeActive ? styles.logOut : { display: "none" }
              }
              onPress={async () => {
                await setTimeout(async () => {
                  this.setState({ closeActive: true });
                  await setTimeout(async () => {
                    await _auth.signOut();
                    this.props.unauthorizeUser();
                  }, 400);
                }, 100);
              }}
            >
              <Image
                source={require("../../assets/drawables/icons/log_out.png")}
                style={styles.addBabyImg}
              />
            </TouchableOpacity>
          </Animatable.View>
        ) : (
          <>
            <Animatable.View
              animation={!this.state.closeActive ? slideInUp : fadeOut}
              style={{ flex: 1 }}
              delay={!this.state.closeActive ? 100 : 0}
              duration={500}
            >
              <ViewPager
                style={styles.viewPager}
                initialPage={0}
                onPageSelected={(x) => {
                  this.setState({ currentScreen: x.nativeEvent.position });
                }}
              >
                {this.state.myBabies.map((d, i) => {
                  var age = getAge(d.birthDate);
                  var nextAppointment = this.getAppointment(age);
                  return (
                    <View style={styles.babyPage} key={i}>
                      <View style={styles.babyImageCard}>
                        <Image
                          source={
                            d.childDp === ""
                              ? require("../../assets/drawables/icons/logo.png")
                              : { uri: d.childDp }
                          }
                          style={
                            d.childDp === ""
                              ? styles.baybyIcon
                              : styles.babyImage
                          }
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.scheduleBtn}
                        onPress={async () => {
                          await setTimeout(async () => {
                            this.setState({ closeActive: true });
                            await setTimeout(() => {
                              this.setState({
                                activeScreen: EditInfo,
                                openChild: d,
                              });
                            }, 400);
                          });
                        }}
                      >
                        <Image
                          source={require("../../assets/drawables/icons/pacifier.png")}
                          style={styles.scheduleBtnImg}
                        />
                        <Text style={styles.scheduleBtnText}>Edit Info</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.scheduleBtn}
                        onPress={async () => {
                          await setTimeout(async () => {
                            this.setState({ closeActive: true });
                            await setTimeout(() => {
                              this.setState({
                                activeScreen: Schedule,
                                childInfo: d,
                              });
                            }, 400);
                          });
                        }}
                      >
                        <Image
                          source={require("../../assets/drawables/icons/calendar.png")}
                          style={styles.scheduleBtnImg}
                        />
                        <Text style={styles.scheduleBtnText}>
                          Open Schedule
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.text}>{d.childName}</Text>
                      <Text style={styles.text1}>
                        {age === 0
                          ? "new born"
                          : age === 1
                          ? "A day old"
                          : age + " days old"}
                      </Text>
                      <Text style={styles.text1}>{d.birthDate}</Text>
                      <Text style={styles.text1}>{nextAppointment}</Text>
                    </View>
                  );
                })}
              </ViewPager>
              <View style={styles.pageMarkers}>
                {this.state.myBabies.map((x, i) => {
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
            </Animatable.View>
            <TouchableOpacity
              style={
                !this.state.closeActive ? styles.addBaby : { display: "none" }
              }
              onPress={async () => {
                await setTimeout(async () => {
                  this.setState({ closeActive: true });
                  await setTimeout(() => {
                    this.setState({
                      activeScreen: AddBaby,
                      openChild: undefined,
                    });
                  }, 400);
                }, 100);
              }}
            >
              <Image
                source={require("../../assets/drawables/icons/add.png")}
                style={styles.addBabyImg}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={
                !this.state.closeActive ? styles.logOut : { display: "none" }
              }
              onPress={async () => {
                await setTimeout(async () => {
                  this.setState({ closeActive: true });
                  await setTimeout(async () => {
                    await _auth.signOut();
                    this.props.unauthorizeUser();
                  }, 400);
                }, 100);
              }}
            >
              <Image
                source={require("../../assets/drawables/icons/log_out.png")}
                style={styles.addBabyImg}
              />
            </TouchableOpacity>
          </>
        )}
      </Animatable.View>
    ) : (
      <this.state.activeScreen
        closeActive={async () => {
          this.setState({
            activeScreen: () => {
              return (
                <Animatable.View
                  style={{ flex: 1, backgroundColor: "#fff" }}
                  animation={fadeOut}
                  duration={150}
                >
                  <StatusBar style="dark" />
                </Animatable.View>
              );
            },
            closeActive: true,
          });
          await setTimeout(() => {
            this.setState({
              activeScreen: null,
              closeActive: false,
            });
          }, 50);
        }}
        openSnack={this.props.openSnack}
        closeSnack={this.props.closeSnack}
        openTimedSnack={this.props.openTimedSnack}
        child={this.state.openChild}
        childInfo={this.state.childInfo}
        schedule={this.props.schedule}
        age={() => {
          return getAge(this.state.childInfo.birthDate);
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    width: "100%",
    height: "100%",
    display: "flex",
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
  logOut: {
    position: "absolute",
    top: 50,
    right: 10,
    borderRadius: 50,
    height: 50,
    width: 50,
    backgroundColor: "#fff",
    elevation: 2,
    justifyContent: "center",
  },
  addBabyImg: {
    alignSelf: "center",
    height: 35,
    width: 35,
  },
  viewPager: {
    flex: 1,
    backgroundColor: "#f4741f",
    justifyContent: "center",
  },
  babyPage: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  babyImageCard: {
    backgroundColor: "#fff",
    width: 250,
    height: 250,
    margin: 5,
    marginBottom: 10,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 200,
  },
  babyIcon: { height: 150, width: 150, alignSelf: "center" },
  babyImage: { height: 250, width: 250, borderRadius: 200 },
  text: {
    marginTop: 5,
    fontSize: 24,
    fontFamily: "bold",
    marginBottom: 5,
    color: "#fff",
  },
  text1: {
    fontSize: 20,
    fontFamily: "medium",
    color: "#fff",
  },
  scheduleBtn: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 5,
    borderWidth: 2,
    borderColor: "#fff",
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
    color: "#fff",
    width: 70,
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
    backgroundColor: "#fff",
    borderRadius: 10,
    marginLeft: 2,
    marginRight: 2,
  },
  pageMarker: {
    height: 2,
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginLeft: 2,
    marginRight: 2,
  },
});

export const _ViewPager = ViewPager;
