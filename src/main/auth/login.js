/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/prop-types */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component, useRef, useState } from "react";
import * as Animatable from "react-native-animatable";
import { fadeIn, fadeOut, slideInRight } from "../../assets/anim/index";
import { _firebase } from "../../assets/config/index";
import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "../../assets/config/config";
import { StatusBar } from "expo-status-bar";
class LoginContent extends Component {
  state = {
    phoneNumber: "",
    authCode: "",
    codeSent: false,
    closeLogin: false,
  };
  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      async () => {
        if (this.state.codeSent === true) {
          this.setState({ codeSent: false });
        }
      }
    );
    this.props.init();
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    return this.state.codeSent === false ? (
      <Animatable.View
        animation={this.state.closeLogin === false ? fadeIn : fadeOut}
        style={styles.mainContent}
      >
        <StatusBar style="dark" />
        <Text style={styles.loginTitle}>
          Enter your phone number to get started
        </Text>
        <Text style={styles.loginSubTitle}>
          We will send you a verification code.
        </Text>
        <View style={styles.inputField}>
          <Image
            style={styles.inputIcon}
            source={require("../../assets/drawables/icons/kenya.png")}
          />
          <Text style={styles.phoneCode}>+254</Text>
          <TextInput
            keyboardType="phone-pad"
            style={styles.inuptText}
            onChangeText={(text) => {
              this.setState({ phoneNumber: text });
            }}
            value={this.state.phoneNumber}
            placeholder="Phone Number"
            maxLength={9}
          />
        </View>
        <View style={styles.signIn}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={async () => {
              await setTimeout(async () => {
                await this.props.openSnack("Sending Verification Code");
                const x = await this.props.sendVerification(
                  "+254" + this.state.phoneNumber
                );
                this.props.closeSnack();
                await setTimeout(() => {
                  if (x === true) {
                    this.setState({ codeSent: true });
                    this.props.openTimedSnack("Sent Successfully");
                  } else {
                    this.props.openTimedSnack("Sending Failed");
                  }
                }, 100);
              }, 100);
            }}
          >
            <Image
              style={styles.loginBtnIcon}
              source={require("../../assets/drawables/icons/sms.png")}
            />
            <Text style={styles.loginBtnText}>Request Code</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    ) : (
      <VerifyNumber
        closeLogin={this.state.closeLogin}
        signIn={this.signIn.bind(this)}
        phoneNumber={"+254" + this.state.phoneNumber}
      />
    );
  }
  async signIn(authCode) {
    await setTimeout(async () => {
      await this.props.openSnack("Verifying Code");
      const x = await this.props.confirmCode(authCode);

      this.props.closeSnack();
      await setTimeout(async () => {
        if (x === true) {
          this.props.openTimedSnack("Login Successfull");
          this.setState({ closeLogin: true });
          await setTimeout(() => {
            this.props.authorizeUser();
          }, 400);
        } else {
          this.props.openTimedSnack("Login Failed");
        }
      }, 100);
    }, 100);
  }
}

class VerifyNumber extends Component {
  state = {
    authCode: "",
  };
  render() {
    return (
      <Animatable.View
        style={styles.mainContent}
        animation={this.props.closeLogin === false ? fadeIn : fadeOut}
      >
        <StatusBar style="dark" />
        <Text style={styles.loginTitle}>Enter verification code</Text>
        <Text style={styles.loginSubTitle}>
          A code was sent to: {this.props.phoneNumber}
        </Text>
        <View style={styles.inputField}>
          <Image
            style={styles.inputIcon}
            source={require("../../assets/drawables/icons/sms.png")}
          />
          <TextInput
            keyboardType="phone-pad"
            style={styles.inuptText}
            onChangeText={(text) => {
              this.setState({ authCode: text });
            }}
            value={this.state.authCode}
            placeholder="Verification Code"
          />
        </View>
        <View style={styles.signIn}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={async () => {
              await setTimeout(async () => {}, 100);
              await this.props.signIn(this.state.authCode);
            }}
          >
            <Image
              style={styles.loginBtnIcon}
              source={require("../../assets/drawables/icons/ticket.png")}
            />
            <Text style={styles.loginBtnText}>Verify My Number</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    width: "100%",
    height: "100%",
    display: "flex",
  },
  loginTitle: {
    fontSize: 22,
    fontFamily: "bold",
    marginTop: 40,
    marginLeft: 20,
    color: "#000",
  },
  loginSubTitle: {
    fontSize: 20,
    fontFamily: "regular",
    marginBottom: 20,
    marginLeft: 20,
    color: "#6e6e6e",
  },
  inputField: {
    minHeight: 35,
    maxHeight: 45,
    borderRadius: 5,
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    borderColor: "#f4741f",
    borderWidth: 2,
    marginBottom: 5,
    display: "flex",
    flexDirection: "row",
    fontFamily: "light",
  },
  inputIcon: {
    width: 35,
    height: 35,
    alignSelf: "center",
    marginLeft: 10,
  },
  inuptText: {
    paddingLeft: 5,
    height: "100%",
    fontSize: 18,
    borderLeftColor: "#fff",
    borderLeftWidth: 2,
  },
  phoneCode: {
    fontSize: 18,
    fontFamily: "regular",
    color: "#000",
    marginTop: 10,
    marginLeft: 10,
  },
  signIn: {
    display: "flex",
    flexDirection: "row",
    marginRight: 20,
    marginLeft: 15,
    position: "absolute",
    bottom: 10,
  },
  loginBtn: {
    marginLeft: 5,
    height: 40,
    backgroundColor: "#f4741f",
    marginTop: 10,
    flex: 1,
    maxHeight: 45,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 5,
  },
  loginBtnIcon: {
    width: 30,
    height: 30,
    alignSelf: "center",
  },
  loginBtnText: {
    alignSelf: "center",
    margin: 10,
    fontSize: 18,
    color: "#fff",
    fontFamily: "bold",
  },
});

export const Login = (props) => {
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);

  const sendVerification = async (phone) => {
    const phoneProvider = new _firebase.auth.PhoneAuthProvider();
    var success = false;
    await phoneProvider
      .verifyPhoneNumber(phone, recaptchaVerifier.current)
      .then((x) => {
        if (x) {
          success = true;
        }
        setVerificationId(x);
      })
      .catch((e) => {
        success = false;
        console.log(e);
      });
    return success;
  };

  const confirmCode = async (code) => {
    const credential = _firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
    var success = false;
    await _firebase
      .auth()
      .signInWithCredential(credential)
      .then((result) => {
        if (result.user) {
          success = true;
        }
      })
      .catch((e) => {
        success = false;
        console.log(e);
      });
    return success;
  };
  return (
    <View style={styles.mainContent}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      <LoginContent
        confirmCode={confirmCode}
        sendVerification={sendVerification}
        init={props.init}
        authorizeUser={props.authorizeUser}
        openSnack={props.openSnack}
        closeSnack={props.closeSnack}
        openTimedSnack={props.openTimedSnack}
      />
    </View>
  );
};
