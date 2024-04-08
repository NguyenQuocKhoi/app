import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Keyboard,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  FooterTextBtn,
  FooterText,
  LoginImg,
  ContentContainer,
  TextB,
  TextLogin,
  BtnLogin,
  TextInput,
  TextL,
  TextBtnLogin,
} from './stylesChangePassScreen';
import * as Animatable from 'react-native-animatable';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BASE_URL,
  checkPasswordValid,
  checkPhoneValid,
  getToken,
  getUserId,
} from '../../utils';
import {Alert} from 'react-native';
import axios from 'axios';
export const ChangePasswordScreen = props => {
  const [user, setUser] = useState({});
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [eyeClick, setEyeClick] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userId = await getUserId();

    const token = await getToken();

    try {
      const result = await axios.get(`${BASE_URL}/users/${userId}`, {
        headers: {
          'auth-token': `${token}`,
        },
      });
      //   console.log(result.data);
      if (result.status === 200) {
        setUser(result.data);
        setPassword(result.data.password);
        // console.log(result.data);
      }
    } catch (error) {}
  };

  const handleUpdatePassword = async () => {
    const userId = await getUserId();
    const token = await getToken();
    const data = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      
    };
    // console.log(data);
    // console.log(data);
    try {
      const result = await axios.put(
        `${BASE_URL}/users/changePassword/${userId}`,
        data,
        {
          headers: {
            'auth-token': `${token}`,
          },
        },
      );
      if (result.status === 200) {
        // setUser(result.data); //
        Alert.alert('Success');
        handleLogOut();
        console.log(result.data);
      }
      else{
        console.log(result.data.error);
      }
      // setPassword('');
      setNewPassword('');
    } catch (error) {
      Alert.alert('Wrong password');
      console.log(error);
    }
  };

  const handleCheckPassword = async value => {
    if (checkPasswordValid(value)) {
      setNotification('');
    } else {
      setNotification(
        'Password consists of 6 characters, with lowercase letters\nuppercase letters, and numbers',
      );
    }
  };

  const handleLogOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      props.navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <View style={{backgroundColor: '#ffffff', flex: 1}}>
        <Animatable.View animation="fadeIn" style={{flex: 1}}>
          <View style={{padding: 20}}>
            <TextL>Change password</TextL>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: 'gray',
              }}>
              <TextInput
                placeholder="Password"
                value={oldPassword}
                secureTextEntry={eyeClick}
                onChangeText={setOldPassword}></TextInput>
            </View>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: 'gray',
              }}>
              <TextInput
                placeholder="New Password"
                value={newPassword}
                onChangeText={i => {
                  setNewPassword(i);
                  handleCheckPassword(i);
                }}
                secureTextEntry={eyeClick}></TextInput>

              <View style={{position: 'absolute'}}>
                <Text style={{color: 'red', marginTop: 95}}>
                  {notification}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setEyeClick(!eyeClick);
                }}>
                <Text style={{color: '#3399FF', marginLeft: -30}}>View</Text>
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 25}}>
              <BtnLogin>
                <TouchableOpacity onPress={() => handleUpdatePassword()}>
                  <TextBtnLogin>Update</TextBtnLogin>
                </TouchableOpacity>
              </BtnLogin>
            </View>
            <BtnLogin>
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <TextBtnLogin>Back</TextBtnLogin>
              </TouchableOpacity>
            </BtnLogin>
          </View>
        </Animatable.View>
      </View>
    </>
  );
};
