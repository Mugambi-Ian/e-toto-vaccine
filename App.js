import React from "react";
import App from "./src/main/main";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

export default function start() {
  let [fontsLoaded] = useFonts({
    medium: require("./src/assets/font/medium.ttf"),
    bold: require("./src/assets/font/semi-bold.ttf"),
    regular: require("./src/assets/font/regular.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return <App />;
  }
}