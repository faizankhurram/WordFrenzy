import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({navigation}) => {

  const [theme, setTheme] = useState("light");
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    initializeProgress();
    initializeTheme();
  }, []);

  const initializeTheme = async () => {
    const themeValue = await AsyncStorage.getItem("theme");
    if (themeValue) setTheme(themeValue);
    setTimeout(() => {
      setShowIndicator(false);
      setTimeout(() => {
        navigation.replace("Home");
      }, 1000);
    }, 3000);
  };

  const initializeProgress = async() => {
    const words = await AsyncStorage.getItem("wordsPlayed");
    const guesses = await AsyncStorage.getItem("correctGuesses");

    if(!words && !guesses){
      await AsyncStorage.setItem("wordsPlayed", "0");
      await AsyncStorage.setItem("correctGuesses", "0");
    }
  }

  return(
    <View style = {[Styles.container, {backgroundColor : theme == "light" ? "white" : "rgba(0, 0, 0, 0.85)"}]}>

      <View style = {Styles.innerTextView}>
        <Text style = {Styles.text1}>Word</Text>
        <Text style = {[Styles.text2, {color : theme == "light" ? "rgba(200, 0, 255, 0.5)" : "white", fontStyle : "italic"}]}>Frenzy</Text>
      </View>

      {
        showIndicator && (
          <View style = {{marginTop : 20}}>
            <ActivityIndicator size = {"large"} color = "rgba(200, 0, 255, 1)"/>
          </View>
        )
      }

    </View>
  );
}

const Styles = StyleSheet.create({
  container : {
    flex : 1, flexDirection : "column",
    alignItems : "center", justifyContent : "center"
  },
  innerTextView : {
    flexDirection : "row"
  },
  text1 : {
    fontSize : 70, fontWeight : "bold",
    color : "rgba(200, 0, 255, 1)"
  },
  text2 : {
    fontSize : 70, fontWeight : "bold"
  }
});

export default Splash;