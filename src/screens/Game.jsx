import {View, Text, StyleSheet, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, TouchableOpacity, TextInput, Alert, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

import {fetchGuessWord} from './Home';

const Game = ({navigation}) => {

  useEffect(() => {
    fetchWordFromLocal();
    fetchTheme();
  }, []);

  const [theme, setTheme] = useState("light");
  const [input, setInput] = useState("");
  const [word, setWord] = useState("");
  const [attempts, setAttempts] = useState(5);
  const [resultToggles, setResultToggles] = useState([false, false, false, false, false]);
  const [resultGuesses, setResultGuesses] = useState([[], [], [], [], []]);

  const fetchTheme = async() => {
    const value = await AsyncStorage.getItem("theme");
    setTheme(value);
  }

  const fetchWordFromLocal = async() => {
    const word = await AsyncStorage.getItem("word");
    setWord(word);
  }

  const handleExitEvent = () => {
    if(attempts < 5){
      Alert.alert("Warning", "Are you sure you want to go back? You might lose your progress on this word...", [
        { text : "Cancel", onPress : () => {} },
        { text : "YES", onPress : () => {
            fetchGuessWord();
            navigation.goBack();
          }
        }
      ]);
    }
    else{
      fetchGuessWord();
      navigation.goBack();
    }
  }

  const handleTextInput = (value) => {
    if (typeof value !== "string") return;
    setInput(value); 
  }

  const handleSubmitEvent = async() => {
    if(input.length !== 5){
      Alert.alert("Error!", "Guess should contain exactly 5 letters!");
      setInput("");
      return;
    }

    const containsAnythingExceptAlpha = (guess) => {
      for(let char of guess){
        if(!(char >= 'a' && char <= 'z')){
          return true;
        }
      }
      return false;
    }

    if(containsAnythingExceptAlpha(input.toLowerCase())){
      Alert.alert("Error!", "Guess should only consist of alphabetical characters!");
      setInput("");
      return;
    }

    const res = evaluateUserGuess(word, input.toLowerCase()); // [[char, color]]
    const arrayIndex = 5 - attempts;

    const newResultGuesses = [...resultGuesses];
    const newResultToggles = [...resultToggles];

    newResultGuesses[arrayIndex] = res;
    newResultToggles[arrayIndex] = true;

    setResultGuesses(newResultGuesses);
    setResultToggles(newResultToggles);

    if(input.toLowerCase() === word){
      const currWordsPlayed = parseInt(await AsyncStorage.getItem("wordsPlayed")) || 0;
      const currCorrectGuesses = parseInt(await AsyncStorage.getItem("correctGuesses")) || 0;
      await AsyncStorage.setItem("wordsPlayed", (currWordsPlayed + 1).toString());
      await AsyncStorage.setItem("correctGuesses", (currCorrectGuesses + 1).toString());
      
      Alert.alert("Win!", "Congratulations! You have guessed the word :)", [
        { text : "OK", onPress : () => {
            setResultGuesses([[], [], [], [], []]);
            setResultToggles([false, false, false, false, false]);
            setInput("");
            navigation.replace("Home");
          }
        }
      ]);
    }
    else{
      setAttempts(attempts - 1);
      if(attempts === 1){
        const currWordsPlayed = parseInt(await AsyncStorage.getItem("wordsPlayed")) || 0;
        await AsyncStorage.setItem("wordsPlayed", (currWordsPlayed + 1).toString());
        Alert.alert("Game Over!", `You failed to guess the word ${word}!`, [
          { text : "OK", onPress : () => {
              setResultGuesses([[], [], [], [], []]);
              setResultToggles([false, false, false, false, false]);
              setInput("");
              navigation.replace("Home"); 
            }
          }
        ]);
      }
    }
    setInput("");
  }

  const evaluateUserGuess = (answer, guess) => {
    const wordMap = {};
    const currMap = {};
    const result = [];
  
    for(let ch of answer){
      wordMap[ch] = (wordMap[ch] || 0) + 1;
    }
  
    for(let i = 0; i < guess.length; i++){
      const ch = guess[i];
  
      if(!answer.includes(ch)){
        result.push([ch, "grey"]);
        continue;
      }
  
      currMap[ch] = (currMap[ch] || 0) + 1;
  
      if(ch === answer[i]){
        result.push([ch, "green"]);
      }
      else if (currMap[ch] <= wordMap[ch]){
        result.push([ch.toUpperCase(), "yellow"]);
      }
      else{
        result.push([ch, "grey"]);
      }
    }
  
    return result;
  };  

  const RenderResult = ({guess}) => {
    return(
      <View style = {[Styles.resultView, {backgroundColor : theme === "light" ? "rgba(200, 0, 255, 0.2)" : "rgba(255, 255, 255, 0.65)"}]}>
        <Text style = {Styles.resultText}>
          {guess.map(([char, color], index) => (
            <Text key={index} style={[Styles.resultText, {color}]}>{char}</Text>
          ))}
        </Text>
      </View>
    );
  }

  return(
    <KeyboardAvoidingView style = {Styles.container} behavior = "height">
      <ScrollView style = {{flex : 1, flexGrow : 1, backgroundColor : theme === "light" ? "white" : "rgba(0, 0, 0, 0.85)"}}>
        <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>
          <View style = {Styles.inner}>

            <View style = {[Styles.headerView, 
              {backgroundColor : theme === "light" ? "rgba(200, 0, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"}, 
              {borderBottomColor : theme === "light" ? "black" : "rgba(200, 0, 255, 1)"}]}>
              <TouchableOpacity style = {Styles.headerButtonStyle} activeOpacity = {0.5} onPress = {handleExitEvent}>
                <Icon name = "caret-back" size = {50} color = "rgba(200, 0, 255, 1)"/>
              </TouchableOpacity>
              <Text style = {[Styles.headerText, {color : "rgba(200, 0, 255, 1)"}]}>
                Word
                <Text style = {{color : theme === "light" ? "rgba(200, 0, 255, 0.5)" : "white", fontStyle : "italic"}}>
                  Frenzy
                </Text>
              </Text>
            </View>

            <View style = {Styles.attemptsHeader}>
              <Text style = {[Styles.attemptsText, {color : theme === "light" ? "rgba(200, 0, 255, 0.5)" : "white"}]}>Attempts Left: {attempts}</Text>
            </View>
            
            <View style = {[Styles.textBox]}>
              <TextInput
                style = {{fontSize : 50, fontWeight : "bold", color : theme === "light" ? "black" : "white"}}
                value = {input}
                placeholder = "..."
                placeholderTextColor = {theme === "light" ? "black" : "white"}
                onChangeText = {handleTextInput}
                autoCapitalize = "none" autoComplete = "none" autoCorrect = {false}
              />
            </View>

            <View style = {Styles.resultsOuterView}>
              {resultToggles.map((toggle, idx) => (
                toggle && <RenderResult key={idx} guess={resultGuesses[idx]} />
              ))}
            </View>

            <View style = {Styles.submitButtonView}>
              <TouchableOpacity style = {[Styles.submitButton, {backgroundColor : theme === "light" ? "rgba(200, 0, 255, 1)" : "white", borderColor : theme === "light" ? "rgba(200, 0, 255, 1)" : "white"}]} activeOpacity = {0.5} onPress = {handleSubmitEvent}>
                <Text style = {[Styles.submitButtonText, {color : theme === "light" ? "white" : "rgba(200, 0, 255, 1)"}]}>Submit</Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const Styles = StyleSheet.create({
  container : {
    flex : 1
  },
  inner : {
    flex : 1
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
  attemptsHeader : {
    marginTop : 50, alignItems : "center", justifyContent : "center", padding : 10
  },
  attemptsText : {
    fontSize : 35, fontWeight : "bold"
  },
  textBox : {
    borderWidth : 3, borderColor : "rgba(200, 0, 255, 1)", borderRadius : 15,
    height : 90, marginTop : 60, marginHorizontal : 10, marginBottom : 40,
    padding : 5,
  },
  submitButtonView : {
    alignItems : "center", justifyContent : "center", marginTop : 40, marginBottom : 50, padding : 15
  },
  submitButton : {
    borderWidth : 3, borderRadius : 25, height : 60, width : 180, justifyContent : "center", alignItems : "center"
  },
  submitButtonText : {
    fontSize : 35, fontWeight : "bold"
  },
  resultView : {
    marginTop : 30, padding : 5, alignItems : "center", justifyContent : "center", width : 350, borderWidth : 3, borderRadius : 15, borderColor : "black"
  },
  resultText : {
    fontSize : 35, fontWeight : "bold"
  },
  resultsOuterView : {
    alignItems : "center", justifyContent : "center"
  }
});

export default Game;
