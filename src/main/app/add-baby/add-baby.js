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
import * as ImagePicker from "expo-image-picker";
import DatePicker from "react-native-datepicker";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  BackHandler,
} from "react-native";
import { slideOutRight, slideInRight } from "../../../assets/anim/index";
import {
  _storage,
  _firebase,
  _database,
  _auth,
} from "../../../assets/config/index";
import { StatusBar } from "expo-status-bar";
export default class AddBaby extends Component {
  state = {
    childDp: "",
    childName: "",
    childId: "",
    birthDate: "",
    closeActive: false,
    disable: true,
    editMode: false,
  };
  async componentDidMount() {
    if (this.props.child) {
      const {
        childDp,
        childName,
        childId,
        birthDate,
        gender,
      } = this.props.child;
      this.setState({
        childDp: childDp,
        childName: childName,
        childId: childId,
        birthDate: birthDate,
        gender: gender,
        disable: false,
      });
    } else {
      const key = (
        await _database.ref(_auth.currentUser.uid).child("kids")
      ).push().key;
      console.log(key);
      this.setState({
        childId: key,
        disable: false,
      });
    }
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      async () => {
        this.setState({ closeActive: true });
        await setTimeout(() => {
          this.props.closeActive();
        }, 200);
      }
    );
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }
  async updateSubcDp(dp) {
    this.props.openSnack("Saving...");
    this.setState({ disable: true });
    const response = await fetch(dp);
    const _file = await response.blob();
    const id = this.state.childId + new Date().getTime();
    const uploadTask = _storage
      .ref("kids")
      .child(this.state.childId)
      .child(id)
      .put(_file);
    uploadTask
      .on(
        "state_changed",
        function () {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(
              async function (downloadURL) {
                var url = "" + downloadURL;
                this.setState({ childDp: url });
                await setTimeout(() => {
                  this.props.closeSnack();
                }, 1000);
                this.setState({ disable: false });
                this.props.openTimedSnack("Save Successfull");
              }.bind(this)
            )
            .catch(async (e) => {
              this.props.closeSnack();
              this.setState({ disable: false });
              console.log(e);
            });
        }.bind(this)
      )
      .bind(this);
  }
  maxDate() {
    var t = new Date();
    return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
  }
  render() {
    return (
      <Animatable.View
        animation={!this.state.closeActive ? slideInRight : slideOutRight}
        duration={350}
        style={styles.mainContent}
      >
        <StatusBar style="dark" />
        <Text style={styles.title}>My Baby's Info</Text>
        <ScrollView>
          <Text style={styles.text}>Picture</Text>
          <TouchableOpacity
            style={styles.dpBtn}
            onPress={async () => {
              if (!this.state.disable)
                await setTimeout(async () => {
                  let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                  });
                  if (result.uri) {
                    this.setState({ childDp: result.uri });
                    await this.updateSubcDp(result.uri);
                  }
                }, 100);
            }}
          >
            <Image
              style={
                this.state.childDp === "" ? styles.dpBtnIcon : styles.dpBtnImage
              }
              source={
                this.state.childDp === ""
                  ? require("../../../assets/drawables/icons/baby.png")
                  : { uri: this.state.childDp }
              }
            />
          </TouchableOpacity>
          <Text style={styles.text}>*Name</Text>
          <View style={styles.inputField}>
            <Image
              style={styles.inputIcon}
              source={require("../../../assets/drawables/icons/logo.png")}
            />
            <TextInput
              style={styles.inputText}
              onChangeText={(text) => {
                this.setState({ childName: text });
              }}
              value={this.state.childName}
              placeholder="Baby's Name"
            />
          </View>
          <Text style={styles.text}>*Birth Date</Text>
          <DatePicker
            style={{ width: "90%", marginLeft: 20, marginRight: 20 }}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            maxDate={this.maxDate()}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={picker}
            date={this.state.birthDate}
            onDateChange={(date) => {
              if (!this.state.disable) this.setState({ birthDate: date });
            }}
          />
          <Text style={styles.text}>Gender</Text>
          <View style={styles.genderPicker}>
            <TouchableOpacity
              style={
                this.state.gender === "boy"
                  ? styles.genderBtnA
                  : styles.genderBtn
              }
              onPress={async () => {
                if (!this.state.disable)
                  await setTimeout(() => {
                    this.setState({ gender: "boy" });
                  }, 100);
              }}
            >
              <Image
                source={require("../../../assets/drawables/icons/boy.png")}
                style={styles.genderBtnImg}
              />
              <Text
                style={
                  this.state.gender === "boy"
                    ? styles.genderBtnTextA
                    : styles.genderBtnText
                }
              >
                Boy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                this.state.gender === "girl"
                  ? styles.genderBtnA
                  : styles.genderBtn
              }
              onPress={async () => {
                if (!this.state.disable)
                  await setTimeout(() => {
                    this.setState({ gender: "girl" });
                  }, 100);
              }}
            >
              <Image
                source={require("../../../assets/drawables/icons/girl.png")}
                style={styles.genderBtnImg}
              />
              <Text
                style={
                  this.state.gender === "girl"
                    ? styles.genderBtnTextA
                    : styles.genderBtnText
                }
              >
                Girl
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
        <TouchableOpacity
          style={styles.noBtn}
          onPress={async () => {
            if (!this.state.disable)
              await setTimeout(async () => {
                this.setState({ closeActive: true });
                await setTimeout(() => {
                  this.props.closeActive();
                }, 200);
              }, 100);
          }}
        >
          <Image
            style={styles.btnImg}
            source={require("../../../assets/drawables/icons/close.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.yesBtn}
          onPress={async () => {
            if (!this.state.disable)
              await setTimeout(async () => {
                this.setState({ disable: true });
                this.props.openSnack("Syncing...");
                const {
                  childId,
                  childName,
                  childDp,
                  birthDate,
                  gender,
                } = this.state;
                const child = {
                  childId: childId,
                  childName: childName,
                  childDp: childDp,
                  birthDate: birthDate,
                  gender: gender,
                };
                if (childName && birthDate) {
                  await _database
                    .ref(_auth.currentUser.uid)
                    .child("kids")
                    .child(childId)
                    .set(child)
                    .then(async (x) => {
                      this.props.closeSnack();
                      await setTimeout(async () => {
                        this.props.openTimedSnack("Succesfull");
                        this.setState({ closeActive: true });
                        await setTimeout(() => {
                          this.props.closeActive();
                        }, 200);
                      }, 200);
                    })
                    .catch(async (x) => {
                      this.props.closeSnack();
                      await setTimeout(() => {
                        this.setState({ disable: false });
                        this.props.openTimedSnack("Faied");
                      }, 200);
                    });
                } else {
                  this.props.openTimedSnack("Fill required values");
                }
              }, 100);
          }}
        >
          <Image
            style={styles.btnImg}
            source={require("../../../assets/drawables/icons/ticket.png")}
          />
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}
export const EditInfo = (props) => {
  return (
    <AddBaby
      child={props.child}
      closeActive={props.closeActive}
      openSnack={props.openSnack}
      closeSnack={props.closeSnack}
      openTimedSnack={props.openTimedSnack}
    />
  );
};
const styles = StyleSheet.create({
  mainContent: {
    height: "100%",
    width: "100%",
    display: "flex",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontFamily: "bold",
    marginTop: 30,
    marginLeft: 20,
    marginBottom: 5,
    color: "#000",
    backgroundColor: "#fff",
  },
  dpBtn: {
    backgroundColor: "#fff",
    elevation: 4,
    width: 250,
    height: 250,
    margin: 5,
    marginBottom: 20,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 200,
  },
  dpBtnIcon: { height: 150, width: 150, alignSelf: "center" },
  dpBtnImage: { height: 250, width: 250, borderRadius: 200 },
  inputField: {
    minHeight: 40,
    maxHeight: 55,
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    borderColor: "#f4741f",
    borderWidth: 2,
    marginBottom: 5,
    display: "flex",
    flexDirection: "row",
    fontFamily: "medium",
    borderRadius: 5,
  },
  inputIcon: {
    width: 30,
    height: 30,
    alignSelf: "center",
    marginLeft: 10,
  },
  inputText: {
    marginLeft: 10,
    paddingLeft: 10,
    borderLeftColor: "#fff",
    borderLeftWidth: 2,
    fontFamily: "medium",
    fontSize: 20,
    minWidth: 100,
  },
  text: {
    marginTop: 5,
    marginLeft: 20,
    fontSize: 20,
    fontFamily: "bold",
    marginBottom: 5,
    color: "#f4741f",
  },
  noBtn: {
    position: "absolute",
    bottom: 10,
    left: 10,
    borderRadius: 50,
    height: 60,
    width: 60,
    backgroundColor: "#fff",
    elevation: 2,
    justifyContent: "center",
    borderColor: "#f4741f",
    borderWidth: 1,
  },
  yesBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: 50,
    height: 60,
    width: 60,
    backgroundColor: "#f4741f",
    elevation: 2,
    justifyContent: "center",
    borderColor: "#f4741f",
    borderWidth: 1,
  },
  btnImg: {
    alignSelf: "center",
    height: 30,
    width: 30,
  },
  genderPicker: {
    flexDirection: "row",
    marginRight: 20,
    marginLeft: 20,
  },
  genderBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    margin: 5,
    borderWidth: 2,
    borderColor: "#f4741f",
    paddingBottom: 2,
    paddingTop: 2,
    borderRadius: 5,
  },
  genderBtnA: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    margin: 5,
    borderWidth: 2,
    borderColor: "#f4741f",
    paddingBottom: 2,
    paddingTop: 2,
    borderRadius: 5,
    backgroundColor: "#f4741f",
  },
  genderBtnImg: {
    height: 30,
    width: 30,
  },
  genderBtnText: {
    alignSelf: "center",
    fontFamily: "medium",
    marginLeft: 10,
    color: "#000",
  },
  genderBtnTextA: {
    alignSelf: "center",
    fontFamily: "medium",
    marginLeft: 10,
    color: "#fff",
  },
});
const picker = {
  dateIcon: {
    position: "absolute",
    left: 0,
    top: 4,
    marginLeft: 0,
  },
  dateInput: {
    marginLeft: 40,
    borderRadius: 5,
    fontFamily: "regular",
    backgroundColor: "#fff",
    borderColor: "#f4741f",
    borderWidth: 2,
  },
};
