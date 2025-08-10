import {View, Text, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Modal, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import wordsData from '../jsonData/words.json'

import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchGuessWord = () => {
  const words = wordsData.words;

  const index = Math.floor(Math.random() * words.length);
  const word = words[index];

  AsyncStorage.setItem("word", word);
}

const Home = ({navigation}) => {

  useEffect(() => {
    fetchProgress();
    fetchGuessWord();
    fetchTheme()
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [wordsPlayed, setWordsPlayed] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [theme, setTheme] = useState("light");

  const handleThemeChangeEvent = async() => {
    const change = theme == "light" ? "dark" : "light";
    setTheme(change);
    await AsyncStorage.setItem("theme", change);
  }

  const handleHelpEvent = () => {
    setShowModal(false);
    navigation.navigate("Help");
  }

  const handleScoreHistoryEvent = () => {
    setShowModal(false);
    setShowScoreModal(true);
  }

  const fetchTheme = async() => {
    const themeValue = await AsyncStorage.getItem("theme");
    setTheme(themeValue);
  }

  const fetchProgress = async() => {
    const words = await AsyncStorage.getItem("wordsPlayed");
    const guesses = await AsyncStorage.getItem("correctGuesses");
    setWordsPlayed(parseInt(words));
    setCorrectGuesses(parseInt(guesses));
  }

  const handlePlayEvent = () => {
    navigation.navigate("Game");
  }

  return(
    <KeyboardAvoidingView style = {Styles.container} behavior = "height">

      <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>

        <View style = {[Styles.inner, {backgroundColor : theme == "light" ? "white" : "rgba(0, 0, 0, 0.85)"}]}>

          <View style = {[Styles.headerView, {backgroundColor : theme == "light" ? "rgba(200, 0, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"}, {borderBottomColor : theme == "light" ? "black" : "rgba(200, 0, 255, 1)"}]}>
            <TouchableOpacity style = {Styles.headerButtonStyle} activeOpacity = {0.5} onPress = {() => setShowModal(true)}>
              <Icon name = "settings" size = {30} color = "rgba(200, 0, 255, 1)"/>
            </TouchableOpacity>
            <Text style = {[Styles.headerText, {color : "rgba(200, 0, 255, 1)"}]}>
              Word
              <Text style = {{color : theme == "light" ? "rgba(200, 0, 255, 0.5)" : "white", fontStyle : "italic"}}>
                Frenzy
              </Text>
            </Text>
          </View>

          <Modal visible = {showModal} animationType = 'fade' transparent = {true}>

            <View style = {[Styles.modalView, {backgroundColor : theme == "light" ? "rgba(200, 0, 255, 0.7)" : "rgba(255, 255, 255, 0.9)"}, {borderColor : theme == "light" ? "black" : "rgba(200, 0, 255, 1)"}]}>

              <View style = {{alignItems : "center", marginTop : 20, marginBottom : 40}}>
                <Text style = {{fontSize : 30, fontWeight : "bold", color : theme == "light" ? "white" : "rgba(200, 0, 255, 1)"}}>Settings</Text>
              </View>

              <View style = {Styles.themeView}>
                <Text style = {[Styles.themeViewText, {color : theme == "light" ? "white" : "rgba(200, 0, 255, 1)"}]}>Change Theme</Text>
                <TouchableOpacity style = {[Styles.themeButtonStyle, {backgroundColor : theme == "light" ? "white" : "rgba(200, 0, 255, 1)"}]} activeOpacity = {0.5} onPress = {handleThemeChangeEvent}>
                  <Icon name = {theme == "light" ? "moon" : "sunny"} size = {40} color = {theme == "light" ? "rgba(200, 0, 255, 1)" : "white"}/>
                </TouchableOpacity>
              </View>

              <View style = {Styles.helpView}>
                <Text style = {[Styles.helpViewText, {color : theme == "light" ? "white" : "rgba(200, 0, 255, 1)"}]}>Learn How to Play</Text>
                <TouchableOpacity style = {[Styles.helpButtonStyle, {backgroundColor : theme == "light" ? "white" : "rgba(200, 0, 255, 1)"}]} activeOpacity = {0.5} onPress = {handleHelpEvent}>
                  <Icon name = 'help-outline' size = {50} color = {theme == "light" ? "rgba(200, 0, 255, 1)" : "white"}/>
                </TouchableOpacity>
              </View>

              <View style = {Styles.statsView}>
                <Text style = {[Styles.statsViewText, {color : theme == "light" ? "white" : "rgba(200, 0, 255, 1)"}]}>View Score History</Text>
                <TouchableOpacity style = {[Styles.statsButtonStyle, {backgroundColor : theme == "light" ? "white" : "rgba(200, 0, 255, 1)"}]} activeOpacity = {0.5} onPress = {handleScoreHistoryEvent}>
                  <Icon name = 'stats-chart' size = {40} color = {theme == "light" ? "rgba(200, 0, 255, 1)" : "white"}/>
                </TouchableOpacity>
              </View>

              <View style = {Styles.modalCloseButtonView}>
                <TouchableOpacity style = {[Styles.closeButtonStyle, {backgroundColor : theme == "light" ? "white" : "rgba(200, 0, 255, 1)"}]} activeOpacity = {0.5} onPress = {() => setShowModal(false)}>
                  <Icon name = 'close' size = {60} color = {theme == "light" ? "rgba(200, 0, 255, 1)" : "white"}/>
                </TouchableOpacity>
              </View>

            </View>

          </Modal>

          <Modal visible = {showScoreModal} animationType = 'fade' transparent = {true}>

            <View style = {[Styles.modalView, {backgroundColor : theme == "light" ? "rgba(200, 0, 255, 0.7)" : "rgba(255, 255, 255, 0.9)"}, {borderColor : theme == "light" ? "black" : "rgba(200, 0, 255, 1)"}]}>

              <View style = {{alignItems : "center", marginTop : 20, marginBottom : 40}}>
                <Text style = {{fontSize : 30, fontWeight : "bold", color : theme == "light" ? "white" : "rgba(200, 0, 255, 1)"}}>Your Progress</Text>
              </View>

              <View style = {Styles.wordsPlayedView}>
                <Text style = {[Styles.wordsPlayedText, {color : theme == "light" ? "white" : "rgba(200, 0, 255, 1)"}]}>
                  Number of Words Played:{' '}
                  <Text>
                    {wordsPlayed}
                  </Text>
                </Text>
              </View>

              <View style = {Styles.correctGuessesView}>
                <Text style = {[Styles.correctGuessesText, {color : theme == "light" ? "white" : "rgba(200, 0, 255, 1)"}]}>
                  Number of Correct Guesses:{' '}
                  <Text>
                    {correctGuesses}
                  </Text>
                </Text>
              </View>

              <View style = {Styles.modalCloseButtonView}>
                <TouchableOpacity style = {[Styles.closeButtonStyle, {backgroundColor : theme == "light" ? "white" : "rgba(200, 0, 255, 1)"}]} activeOpacity = {0.5} onPress = {() => setShowScoreModal(false)}>
                  <Icon name = 'close' size = {60} color = {theme == "light" ? "rgba(200, 0, 255, 1)" : "white"}/>
                </TouchableOpacity>
              </View>

            </View>

          </Modal>

          <View style = {{marginTop : 150, alignItems : "center"}}>
            <Text style = {[Styles.text, {fontSize : 65, textAlign : "center", color : "rgba(200, 0, 255, 1)", fontWeight : "bold"}]}>
              Welcome to Word
              <Text style = {{color : theme == "light" ? "rgba(200, 0, 255, 0.5)" : "white", fontStyle : "italic", fontWeight : "bold"}}>
                Frenzy!
              </Text>
            </Text>
          </View>

          <View style = {Styles.playView}>
            <TouchableOpacity activeOpacity = {0.5} style = {[Styles.playButton, {backgroundColor : theme == "light" ? "rgba(200, 0, 255, 1)" : "white", borderColor : theme === "light" ? "rgba(200, 0, 255, 1)" : "white"}]} onPress = {handlePlayEvent}>
              <Text style = {[Styles.playButtonText, {color : theme == "light" ? "white" : "rgba(200, 0, 255, 1)"}]}>Play</Text>
            </TouchableOpacity>
          </View>

        </View>

      </TouchableWithoutFeedback>

    </KeyboardAvoidingView>
  );
}

const Styles = StyleSheet.create({
  container : {
    flex : 1,
  },
  inner : {
    flex : 1,
  },
  headerView : {
    flexDirection : "row",
    alignItems : "center", justifyContent : "center",
    height : 80,
    borderBottomWidth : 3, borderBottomStartRadius : 15, borderBottomEndRadius : 15
  },
  headerButtonStyle : {
    position : "absolute", left : 10
  },
  headerText : {
    fontSize : 40, fontWeight : "bold"
  },
  modalView : {
    flex : 1,
    marginVertical : 200, marginHorizontal : 30,
    borderWidth : 2, borderRadius : 15,
  },
  modalCloseButtonView : {
    alignItems : "center",
  },
  closeButtonStyle : {
    borderWidth : 2, borderRadius : 25, borderColor : "white",
    backgroundColor : "white",
    width : 80,
    alignItems : "center"
  },
  helpView : {
    marginBottom : 30,
    flexDirection : "row", justifyContent : "space-around",
    paddingLeft : 10, paddingRight : 10
  },
  helpButtonStyle : {
    marginLeft : 20,
    borderWidth : 2, borderRadius : 30, borderColor : "white",
    height : 50, width : 60,
    alignItems : "center"
  },
  helpViewText : {
    fontSize : 28, fontWeight : "bold",
    paddingTop : 5
  },
  themeView : {
    marginBottom : 30,
    flexDirection : "row", justifyContent : "space-around",
    paddingLeft : 10
  },
  themeViewText : {
    fontSize : 28, fontWeight : "bold",
    paddingTop : 5
  },
  themeButtonStyle : {
    marginLeft : 20,
    borderWidth : 2, borderRadius : 30, borderColor : "white",
    height : 50, width : 60,
    alignItems : "center"
  },
  statsView : {
    marginBottom : 25,
    flexDirection : "row", justifyContent : "space-around",
    paddingLeft : 10
  },
  statsViewText : {
    fontSize : 28, fontWeight : "bold",
    paddingTop : 5
  },
  statsButtonStyle : {
    marginLeft : 5, marginRight : 5,
    borderWidth : 2, borderRadius : 30, borderColor : "white",
    height : 50, width : 60,
    alignItems : "center",
  },
  wordsPlayedView : {
    marginBottom : 30,
    flexDirection : "row", justifyContent : "space-around",
    paddingLeft : 10, paddingRight : 10
  },
  wordsPlayedText : {
    fontSize : 28, fontWeight : "bold",
    paddingTop : 5,
    textAlign : "center"
  },
  correctGuessesView : {
    marginBottom : 30,
    flexDirection : "row", justifyContent : "space-around",
    paddingLeft : 10, paddingRight : 10
  },
  correctGuessesText : {
    fontSize : 28, fontWeight : "bold",
    paddingTop : 5,
    textAlign : "center"
  },
  playView : {
    flex : 1,
    marginBottom : 150,
    alignItems : "center", justifyContent : "center"
  },
  playButton : {
    borderWidth : 3, borderRadius : 30,
    width : 180, height : 100,
    justifyContent : "center", alignItems : "center"
  },
  playButtonText : {
    fontSize : 40, fontWeight : "bold"
  }
});

export default Home;