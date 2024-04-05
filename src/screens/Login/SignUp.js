import React, {useEffect, useState} from 'react';
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
  TextSignUp,
  BtnSignUp,
  TextS,
  TextInput,
  TextBtnSignUp,
} from './styles';
import * as Animatable from 'react-native-animatable';
import auth from '@react-native-firebase/auth';
import {BASE_URL, checkPhoneValid, checkPasswordValid} from '../../utils';
import {Alert} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export function Signup(props) {
  const [loginType, setLoginType] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [footerVisible, setFooterVisible] = useState(true);
  const [eyeClick, setEyeClick] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [notification, setNotification] = useState('');

  const sendOtp = async () => {
    if (checkPhoneValid(phone)) {
      try {
        const phoneNumber = '+84' + phone;
        // const phoneNumber = '+1' + "6505550333";
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        confirmation.set;
        console.log(confirmation);
        setConfirm(confirmation);
      } catch (error) {
        console.log(error);
        Alert.alert('some thing went wrong');
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
        Alert.alert('verify success');
      }
    } catch (error) {
      Alert.alert('Invalid code');
      console.log(error);
    }
  };

  const handleCheckPhoneExist = async phoneNumber => {
    if (checkPhoneValid(phoneNumber)) {
      await axios
        .get(`${BASE_URL}/users/search?phone=${phoneNumber}`)
        .then(() => {
          Alert.alert('Phone already exist');
        })
        .catch(error => {
          console.log(error);
        });
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

  const handleSignUp = async () => {
    if (!verified) {
      Alert.alert('Please verify code');
      return;
    }
    if (checkPhoneValid(phone)) {
      if (checkPasswordValid(password)) {
        let data = {
          phone: phone,
          name: name,
          password: password,
        };
        try {
          const result = await axios.post(`${BASE_URL}/auth/register`, data);
          if (result.data.error) {
            Alert.alert(result.data.error);
          } else {
            Alert.alert('Registration successful');
            console.log(result.data);
            await AsyncStorage.setItem('user', JSON.stringify(result.data));
            props.navigation.navigate('HomeScreenNav');
            // props.navigation.navigate('Login');
            //
          }
        } catch (error) {
          console.error('API request failed:', error);
          console.log('Registration failed. Please try again.');
        }
      } else {
        Alert.alert(
          'Password consists of 6 characters, with lowercase letters\nuppercase letters, and numbers',
        );
      }
    } else Alert.alert('Invalid phone!');
  };

  return (
    <>
      <View style={{backgroundColor: '#ffff', flex: 1}}>
        {!loginType ? (
          <ContentContainer>
            <LoginImg />
            <TextSignUp>Appchat Sign Up</TextSignUp>
            <BtnSignUp>
              <TouchableOpacity onPress={() => setLoginType(1)}>
                <TextBtnSignUp>Sign up with phone</TextBtnSignUp>
              </TouchableOpacity>
            </BtnSignUp>
          </ContentContainer>
        ) : (
          <Animatable.View animation="fadeIn" style={{flex: 1}}>
            <View style={{padding: 20}}>
              <TextS>Sign up with phone</TextS>
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}>
                <TextInput
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}></TextInput>
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
                  placeholder="Phone"
                  value={phone}
                  onChangeText={i => {
                    setPhone(i);
                    handleCheckPhoneExist(i);
                  }}
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
                  onChangeText={i => {
                    setPassword(i);
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
                  <Text style={{color: '#3399FF'}}>View</Text>
                </TouchableOpacity>
              </View>

              <View style={{marginTop: 30}}>
                <BtnSignUp>
                  <TouchableOpacity onPress={() => sendOtp()}>
                    <TextBtnSignUp>Send OTP</TextBtnSignUp>
                  </TouchableOpacity>
                </BtnSignUp>
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
                  placeholder="Code"
                  value={code}
                  onChangeText={setCode}
                  secureTextEntry={eyeClick}></TextInput>
              </View>
              <BtnSignUp>
                <TouchableOpacity onPress={() => confirmCode()}>
                  <TextBtnSignUp>Verify</TextBtnSignUp>
                </TouchableOpacity>
              </BtnSignUp>
              <BtnSignUp>
                <TouchableOpacity
                  onPress={() => {
                    handleSignUp();
                  }}>
                  <TextBtnSignUp>Sign up</TextBtnSignUp>
                </TouchableOpacity>
              </BtnSignUp>
            </View>
          </Animatable.View>
        )}
        {footerVisible ? (
          <FooterTextBtn onPress={() => props.navigation.navigate('Login')}>
            <SafeAreaView>
              <FooterText>
                <TextB>Have an account?</TextB> Login
              </FooterText>
            </SafeAreaView>
          </FooterTextBtn>
        ) : null}
      </View>
    </>
  );
}
export default Signup;
