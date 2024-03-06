import React from 'react';
import {View, SafeAreaView, Keyboard} from 'react-native';
import {Button, Input, Text, Text as TextComp} from '../../components';
import {
  FooterTextBtn,
  FooterText,
  LoginImg,
  ContentContainer,
  TextB,
} from './styles';
import * as Animatable from 'react-native-animatable';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL, checkPhoneValid} from '../../utils';
import {Alert} from 'react-native';
import axios from 'axios';
const Login = props => {
  const [loginType, setLoginType] = React.useState('');
  const [phone, setPhone] = React.useState('0332787756');
  const [password, setPassword] = React.useState('123');
  const [data, setData] = React.useState([]);
  const [footerVisible, setFooterVisible] = React.useState(true);

  React.useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => setFooterVisible(false));
    Keyboard.addListener('keyboardDidHide', () => setFooterVisible(true));
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  React.useEffect(() => {
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
    if (checkPhoneValid(phone)) {
      let data = {
        phone: phone,
        password: password,
      };
      try {
        const result = await axios.post(`${BASE_URL}/auth/login`, data);
        // console.log(result.status);
        if (result.data.error) {
          Alert.alert('Số điện thoại hoặc mật khẩu không đúng')
        } else {
          console.log(result.data);
          await AsyncStorage.setItem('user', JSON.stringify(result.data));
          props.navigation.navigate('HomeScreenNav');
        }
      } catch (error) {
        // props.navigation.navigate('Home')
        Alert.alert('Incorrect phone number or password')
        // console.log(error);
      }
    } else {
      Alert.alert('Invalid Phone');
    }
  };

  return (
    <>
      {!loginType ? (
        <ContentContainer>
          <LoginImg />
          <TextComp size="big" weight="900">
            Chatter Login
          </TextComp>
          <Button
            title="Login with phone"
            style={{marginTop: 35}}
            onPress={() => setLoginType(1)}
          />
        </ContentContainer>
      ) : (
        <Animatable.View animation="fadeIn" style={{flex: 1}}>
          <View style={{padding: 20}}>
            <TextComp size="larger" weight="900">
              Login with phone
            </TextComp>
            <Input
              label="Phone"
              value={phone}
              onChange={setPhone}
              keyboardType="phone-pad"
            />
            <Input
              label="Password"
              value={password}
              onChange={setPassword}
              secureTextEntry
            />

            <Button
              title="Login"
              onPress={() => {
                handleLogin();
              }}
              style={{marginTop: 25, marginBottom: 15}}
            />
          </View>
        </Animatable.View>
      )}
      {footerVisible ? (
        <FooterTextBtn onPress={() => props.navigation.navigate('SignUp')}>
          <SafeAreaView>
            <FooterText>
              <TextB noFont>Don't have an account?</TextB> Sign Up
            </FooterText>
          </SafeAreaView>
        </FooterTextBtn>
      ) : null}
    </>
  );
};

export default Login;
