import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from './Home';
import Profile from '../Profile/Profile';
import React from 'react';
import ChatInfo1 from '../Conservation/ChatInfo';
import Friend_banbe from '../Friends/FriendScreen';
// import Friend1 from '../Friends/ListFriends';
const BottomTab = createBottomTabNavigator();

export default function HomeScreenNav() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarStyle: {backgroundColor: 'white'},
        headerShown: false,
        // tabBarActiveTintColor: '#4E9F3D',
        tabBarActiveTintColor: '#3399FF', //8/2
      }}>
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../../images/message-circle.png')}
              style={[
                styles.bottomTabIcon,
                focused && styles.bottomTabIconFocused,
              ]}
            />
          ),
        }}
      />

      <BottomTab.Screen
        name="Friends"
        component={Friend_banbe}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../../images/icons8-phonebook-24.png')}
              style={[
                styles.bottomTabIcon,
                focused && styles.bottomTabIconFocused,
              ]}
            />
          ),
        }}
      />

      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../../images/user2.png')}
              style={[
                styles.bottomTabIcon,
                focused && styles.bottomTabIconFocused,
              ]}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bottomTabIcon: {
    width: 25,
    height: 25,
    tintColor: 'black',
  },
  bottomTabIconFocused: {
    // tintColor: '#4E9F3D',
    tintColor: '#3399FF', //8/2
  },
  newVideoButton: {
    width: 48,
    height: 24,
  },
});
