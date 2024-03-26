import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreenNav from '../screens/Home/HomeNav';
import Home from '../screens/Home/Home';
import Signup from '../screens/Login/SignUp';
import Login from '../screens/Login/Login';
import Profile from '../screens/Profile/Profile';
import Chat from '../screens/Conservation/Chat';
import Friend_timkiem from '../screens/Friends/FriendSearchScreen';
import Friend_received from '../screens/Friends/FriendReceivedScreen';
import GroupScreen from '../screens/Group/GroupScreen';
import { ChangePasswordScreen } from '../screens/Profile/ChangePassScreen';
import CardAddMembers from '../screens/Group/CardAddMembers';
import ChatInfo1 from '../screens/Conservation/ChatInfo';
import AddMember from '../screens/Group/ScreenAddMember';
import Members from '../screens/Group/Members';
const Stack = createNativeStackNavigator();

const appNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeScreenNav"
          component={HomeScreenNav}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={Signup}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Friend_timkiem"
          component={Friend_timkiem}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Friend_received"
          component={Friend_received}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="GroupScreen"
          component={GroupScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Members"
          component={Members}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddMember"
          component={AddMember}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChatInfo1"
          component={ChatInfo1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CardAddMembers"
          component={CardAddMembers}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default appNavigator;
