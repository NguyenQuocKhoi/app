import React, { useState, useEffect } from 'react';
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
import {BASE_URL, checkPhoneValid, getToken, getUserId} from '../../utils';
import {Alert} from 'react-native';
import axios from 'axios';
export const ChangePasswordScreen = props => {
    const [user, setUser] = useState({});
  const [password, setPassword] = useState('');
  const [eyeClick, setEyeClick] = useState(true);
//   const [eyeClick1, setEyeClick1] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  

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
        password: newPassword,
    };
    // console.log(data);
    try {
      const result = await axios.put(`${BASE_URL}/users/${userId}`, data, {
        headers: {
          'auth-token': `${token}`,
        },
      });
      if (result.status === 200) {
        setUser(result.data); //
        console.log(result.data);
      }
      setPassword("");
      setNewPassword("");
    } catch (error) {
      console.log('err=', error);
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
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={false}></TextInput>
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
                  onChangeText={setNewPassword}
                  secureTextEntry={eyeClick}></TextInput>
                <TouchableOpacity
                  onPress={() => {
                    setEyeClick(!eyeClick);
                  }}>
                  <Text style={{color: '#3399FF', marginLeft:-30}}>View</Text>
                </TouchableOpacity>
              </View>
              <BtnLogin>
                <TouchableOpacity onPress={() => handleUpdatePassword()}>
                  <TextBtnLogin>Update</TextBtnLogin>
                </TouchableOpacity>
              </BtnLogin>

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
