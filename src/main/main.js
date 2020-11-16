/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Splash from "./splash/splash";
import { Snackbar } from "react-native-paper";
import { _auth, _database } from "../assets/config/index";
import { Login } from "../main/auth/login";
import Home from "./app/home";
import Spinner from "react-native-loading-spinner-overlay";

export default class App extends Component {
  state = {
    activeSplash: true,
    authenticated: false,
    bypassAuth: false,
    snackBar: false,
    snackBarMsg: "",
    snackBarLabel: "",
    schedule: [],
    snackBarOnClick: () => {},
  };
  getSortOrder(prop) {
    return function (a, b) {
      if (parseInt(a[prop]) > parseInt(b[prop])) {
        return 1;
      } else if (parseInt(a[prop]) < parseInt(b[prop])) {
        return -1;
      }
      return 0;
    };
  }
  async componentDidMount() {
    await _auth.onAuthStateChanged(async (u) => {
      if (this.state.activeSplash === false && this.state.loaded === false) {
        this.setState({ activeSplash: true });
      }
      const _a = [];
      await _database.ref("schedule").on("value", (d) => {
        d.forEach((x) => {
          _a.push(x.val());
        });
      });
      const _p = _a.sort(this.getSortOrder("numOfDays"));
      this.setState({ loaded: true, startApp: true, schedule: _p });
      if (this.state.bypassAuth === false && u !== null) {
        this.setState({ authenticated: true });
      }
    });
  }
  async openTimedSnack(m, l, f) {
    this.setState({ snackBarMsg: m, snackBar: true });
    if (l && f) {
      this.setState({ snackBarLabel: l, snackBarOnClick: f });
    }
    await setTimeout(() => {
      this.setState({ snackBarMsg: m, snackBar: false });
    }, 1500);
  }
  async openSnack(m, l, f) {
    this.setState({ snackBarMsg: m, snackBar: true });
    if (l && f) {
      this.setState({ snackBarLabel: l, snackBarOnClick: f });
    }
  }
  closeSnack() {
    this.setState({ snackBar: false });
  }
  render() {
    return (
      <View styles={styles.mainContent}>
        {this.state.activeSplash === true ? (
          <Splash
            closeSplash={() => {
              if (this.state.loaded === true)
                this.setState({ activeSplash: false, startApp: true });
            }}
          />
        ) : this.state.authenticated === false ? (
          <Login
            init={() => {
              this.setState({ bypassAuth: true });
            }}
            authorizeUser={() => {
              this.setState({ authenticated: true });
            }}
            openSnack={this.openSnack.bind(this)}
            closeSnack={this.closeSnack.bind(this)}
            openTimedSnack={this.openTimedSnack.bind(this)}
          />
        ) : (
          <Home
            init={() => {
              this.setState({ bypassAuth: true });
            }}
            unauthorizeUser={() => {
              this.setState({ authenticated: false });
            }}
            openSnack={this.openSnack.bind(this)}
            closeSnack={this.closeSnack.bind(this)}
            openTimedSnack={this.openTimedSnack.bind(this)}
            schedule={this.state.schedule}
          />
        )}
        <Snackbar
          visible={this.state.snackBar}
          action={{
            label: this.state.snackBarLabel,
            onPress: this.state.snackBarOnClick,
          }}
          onDismiss={() => {
            return true;
          }}
        >
          {this.state.snackBarMsg}
        </Snackbar>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mainContent: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
});
