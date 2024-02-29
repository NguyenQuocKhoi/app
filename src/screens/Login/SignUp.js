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
import {BASE_URL, checkPhoneValid} from '../../utils';
import {postApiNoneToken} from '../../config/Axios';
import {Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
export function Signup(props) {
  const [loginType, setLoginType] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [footerVisible, setFooterVisible] = React.useState(true);

  React.useEffect(() => {
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
          Alert.alert('The phone number already exists or the password must have three or more characters');
        } else {
          Alert.alert('Registration successful');
          props.navigation.navigate('Login');
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
      {!loginType ? (
        <ContentContainer>
          <LoginImg />
          <TextComp size="big" weight="900">
            Chatter Sign Up
          </TextComp>
          <Button
            title="Sign up with phone"
            style={{marginTop: 35}}
            onPress={() => setLoginType(1)}
          />
        </ContentContainer>
      ) : (
        <Animatable.View animation="fadeIn" style={{flex: 1}}>
          <View style={{padding: 20}}>
            <TextComp size="larger" weight="900">
              Sign up with phone
            </TextComp>
            <Input label="Name" value={name} onChange={setName} />
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
              title="Sign Up"
              style={{marginTop: 25}}
              onPress={() => {
                handleSignUp();
              }}
            />
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
    </>
  );
}
export default Signup;
