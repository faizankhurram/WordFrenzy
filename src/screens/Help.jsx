import {View, ScrollView, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Help = ({navigation}) => {

  useEffect(() => {
    fetchTheme();
  }, []);

  const [theme, setTheme] = useState("light");

  const fetchTheme = async() => {
    const value = await AsyncStorage.getItem("theme");
    setTheme(value);
  }

  const handleBackEvent = () => {
    navigation.goBack();
  }

  return(
    <ScrollView style = {[Styles.container, {backgroundColor : theme == "light" ? "white" : "rgba(0, 0, 0, 0.85)"}]}>

      <View style = {[Styles.headerView, {backgroundColor : theme == "light" ? "rgba(200, 0, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"}, {borderBottomColor : theme == "light" ? "black" : "rgba(200, 0, 255, 1)"}]}>
        <TouchableOpacity style = {Styles.headerButtonStyle} activeOpacity = {0.5} onPress = {handleBackEvent}>
          <Icon name = "caret-back" size = {50} color = "rgba(200, 0, 255, 1)"/>
        </TouchableOpacity>
        <Text style = {[Styles.headerText, {color : "rgba(200, 0, 255, 1)"}]}>How To Play</Text>
      </View>

      <View style = {{marginTop : 30, alignItems : "center"}}>
        <Text style = {[Styles.text, {fontSize : 55, textAlign : "center", color : "rgba(200, 0, 255, 1)"}]}>
          A Guide to Word
          <Text style = {{color : theme == "light" ? "rgba(200, 0, 255, 0.5)" : "white", fontStyle : "italic"}}>
            Frenzy!
          </Text>
        </Text>
      </View>

      <View style = {{marginTop : 50, marginLeft : 15, alignItems : "justify"}}>
        <Text style = {[Styles.text, {fontSize : 25, textAlign : "left", color : theme == "light" ? "rgba(200, 0, 255, 0.5)" : "white"}]}>1. Each time, a random 5-letter word will be picked for you to guess.</Text>
      </View>

      <View style = {{marginTop : 30, marginLeft : 15, alignItems : "justify"}}>
        <Text style = {[Styles.text, {fontSize : 25, textAlign : "left", color : theme == "light" ? "rgba(200, 0, 255, 0.5)" : "white"}]}>2. You're given a total of 5 attempts to guess the hidden word.</Text>
      </View>

      <View style = {{marginTop : 30, marginLeft : 15, alignItems : "justify"}}>
        <Text style = {[Styles.text, {fontSize : 25, textAlign : "left", color : theme == "light" ? "rgba(200, 0, 255, 0.5)" : "white"}]}>3. The game helps you in the following manner:</Text>
      </View>

      <View style = {{marginTop : 10, marginLeft : 23, marginRight : 5, alignItems : "justify"}}>
        <Text style = {[Styles.text, {fontSize : 20, textAlign : "left", color : theme == "light" ? "rgba(200, 0, 255, 0.5)" : "white"}]}>
          - if a letter does not exist, its{' '}
          <Text style = {{color : theme == "dark" ? "grey" : "grey", fontStyle : "italic"}}>
            shaded out.
          </Text>
        </Text>
        <Text style = {[Styles.text, {fontSize : 20, textAlign : "left", marginTop : 25, color : theme == "light" ? "rgba(200, 0, 255, 0.5)" : "white"}]}>
          - if a letter exists but isn't in the correct spot, it's shown as{' '} 
          <Text style = {{color : theme == "dark" ? "yellow" : "rgba(255, 200, 0, 1)", fontStyle : "italic"}}>
            yellow.
          </Text>
        </Text>
        <Text style = {[Styles.text, {fontSize : 20, textAlign : "left", marginTop : 25, color : theme == "light" ? "rgba(200, 0, 255, 0.5)" : "white"}]}>
          - if a letter exists and matches the correct spot, it's shown as{' '}
          <Text style = {{color : "green", fontStyle : "italic"}}>
            green!
          </Text>
        </Text>
      </View>

      <View style = {{marginTop : 40, marginBottom : 70, alignItems : "center"}}>
        <Text style = {[Styles.text, {fontSize : 40, textAlign : "center", color : "rgba(200, 0, 255, 1)"}]}>Good Luck!</Text>
      </View>

    </ScrollView>
  );
}

const Styles = StyleSheet.create({
  container : {
    flex : 1, flexGrow : 1,
    flexDirection : "column"
  },
  headerView : {
    flexDirection : "row",
    alignItems : "center", justifyContent : "center",
    height : 80,
    borderBottomWidth : 3, borderBottomStartRadius : 15, borderBottomEndRadius : 15,
  },
  headerButtonStyle : {
    position : "absolute", left : 0
  },
  headerText : {
    fontSize : 40, fontWeight : "bold"
  },
  text : {
    fontWeight : "bold"
  }
})

export default Help;