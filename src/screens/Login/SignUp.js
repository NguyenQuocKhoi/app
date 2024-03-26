import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Keyboard,
  Text,
  TouchableOpacity,
} from 'react-native';
// import {Button, Input, Text, Text as TextComp} from '../../components';
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
import {BASE_URL, checkPhoneValid} from '../../utils';
import {Alert} from 'react-native';
import axios from 'axios';
export function Signup(props) {
  const [loginType, setLoginType] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [footerVisible, setFooterVisible] = useState(true);
  const [eyeClick, setEyeClick] = useState(true);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => setFooterVisible(false));
    Keyboard.addListener('keyboardDidHide', () => setFooterVisible(true));
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  const handleSignUp = async () => {
    if (checkPhoneValid(phone)) {
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
          props.navigation.navigate('Login');
          //
          
        }
      } catch (error) {
        console.error('API request failed:', error);
        console.log('Registration failed. Please try again.');
      }
    } else {
      Alert.alert('Invalid phone!');
    }
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
