import React from 'react';

import Home from './src/screens/Home';
import Splash from './src/screens/Splash';
import Help from './src/screens/Help';
import Game from './src/screens/Game';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>

      <Stack.Navigator screenOptions = {{headerShown : false}}>

        <Stack.Screen name = "Splash" component = {Splash}/>
        <Stack.Screen name = "Home" component = {Home}/>
        <Stack.Screen name = "Help" component = {Help}/>
        <Stack.Screen name = "Game" component = {Game}/>

      </Stack.Navigator>

    </NavigationContainer>
  );
}

export default App;

//stuffs to do now
// start working on the main game screen
//implement and test the logic for word fetching and storing (in grids)