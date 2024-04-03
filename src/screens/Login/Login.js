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
} from './styles';
import * as Animatable from 'react-native-animatable';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL, checkPhoneValid} from '../../utils';
import {Alert} from 'react-native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
const Login = props => {
  const [loginType, setLoginType] = useState('');
  const [phone, setPhone] = useState('0354597106');
  const [password, setPassword] = useState('123');
  const [data, setData] = useState([]);
  const [footerVisible, setFooterVisible] = useState(true);
  const [eyeClick, setEyeClick] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);

 useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => setFooterVisible(false));
    Keyboard.addListener('keyboardDidHide', () => setFooterVisible(true));
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    try {
      AsyncStorage.getItem('user').then(value => {
        if (value != null) {
          props.navigation.navigate('HomeScreenNav');
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    if(!verified){
      Alert.alert('Please verify code');
      return;
    }


    if (checkPhoneValid(phone)) {
      let data = {
        phone: phone,
        password: password,
      };
      try {
        const result = await axios.post(`${BASE_URL}/auth/login`, data);
        if (result.data) {
          console.log(result.data);
          await AsyncStorage.setItem('user', JSON.stringify(result.data));
          props.navigation.navigate('HomeScreenNav');
        }
      } catch (error) {
        // props.navigation.navigate('Home')
        Alert.alert('Incorrect phone number or password');
        // console.log(error);
      }
    } else {
      Alert.alert('Invalid Phone');
    }
  };

  const sendOtp = async () => {
    if (checkPhoneValid(phone)) {
      try {
        const phoneNumber = '+84' + phone; 
        // const phoneNumber = '+1' + "6505550333"; 
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
      } catch (error) {
        Alert.alert( "some thing went wrong");
      }
    } else {
      Alert.alert('Invalid Phone');
    }
  };
  const confirmCode = async () => {
    try {
      const result = await confirm.confirm(code);
      if (result) {
        setVerified(true);
      }
    } catch (error) {
      Alert.alert('Invalid code');
    }
  };

  return (
    <>
      <View style={{backgroundColor: '#ffffff', flex: 1}}>
        {!loginType ? (
          <ContentContainer>
            <View style={{margin: 10}}>
              <LoginImg />
              <TextLogin>Appchat Login</TextLogin>
              <BtnLogin>
                <TouchableOpacity onPress={() => setLoginType(1)}>
                  <TextBtnLogin>Login with phone</TextBtnLogin>
                </TouchableOpacity>
              </BtnLogin>
            </View>
          </ContentContainer>
        ) : (
          <Animatable.View animation="fadeIn" style={{flex: 1}}>
            <View style={{padding: 20}}>
              <TextL>Login with phone</TextL>
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}>
                <TextInput
                  placeholder="Phone"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"></TextInput>
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
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={eyeClick}></TextInput>
                <TouchableOpacity
                  onPress={() => {
                    setEyeClick(!eyeClick);
                  }}>
                  <Text style={{color: '#3399FF'}}>View</Text>
                </TouchableOpacity>
              </View>
              {/* verify code */}
              <BtnLogin>
                <TouchableOpacity onPress={() => sendOtp()}>
                  <TextBtnLogin>sendOtp</TextBtnLogin>
                </TouchableOpacity>
              </BtnLogin>
              <TextInput
                  placeholder="Code"
                  value={code}
                  onChangeText={setCode}
                  secureTextEntry={eyeClick}>
                </TextInput>
              <BtnLogin>
                <TouchableOpacity onPress={() => confirmCode()}>
                  <TextBtnLogin>verify</TextBtnLogin>
                </TouchableOpacity>
              </BtnLogin>
              {/* verify code */}
              <BtnLogin>
                <TouchableOpacity onPress={() => handleLogin()}>
                  <TextBtnLogin>Login</TextBtnLogin>
                </TouchableOpacity>
              </BtnLogin>
            </View>
          </Animatable.View>
        )}
      
          <FooterTextBtn onPress={() => props.navigation.navigate('SignUp')}>
            <SafeAreaView>
              <FooterText>
                <TextB noFont>Don't have an account?</TextB> Sign Up
              </FooterText>
            </SafeAreaView>
          </FooterTextBtn>
       
        
      </View>
    </>
  );
};

export default Login;
