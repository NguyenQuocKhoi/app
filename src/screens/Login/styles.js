import styled from 'styled-components/native';

const LoginImg = styled.Image.attrs(() => ({
  source: require('../../images/logochat.jpeg'),
}))`
  width: 250px;
  height: 210px;
  resize-mode: contain;
  margin-top: -150px;
  align-self: center;
`;

const FooterTextBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
`;

const FooterText = styled.Text`
  text-align: center;

  font-size: 18px;
  color: #3399ff;
`;

const ContentContainer = styled.View`
  flex: 1;

  justify-content: center;
  align-items: center;
`;

const TextB = styled.Text`
  color: black;
`;

export {FooterText, FooterTextBtn, LoginImg, ContentContainer, TextB};

export const TextLogin = styled.Text`
  font-size: 25px;
  color: black;
  text-align: center;
  margin: 12px;
  font-weight: 700;
 
`;

export const TextBtnLogin = styled.Text`
  font-size: 20px;
  color: white;
  text-align: center;
`;

export const TextL = styled.Text`
  font-size: 18px;
  color: black;
  margin-left: 5px;
  font-weight:500;
  margin-bottom: 10px;
`;

export const TextSignUp = styled.Text`
  font-size: 25px;
  color: black;
  text-align: center;
  margin: 12px;
  font-weight: 700;
`;

export const TextBtnSignUp = styled.Text`
  font-size: 20px;
  color: white;
  text-align: center;
`;

export const TextS = styled.Text`
  font-size: 18px;
  color: black;
  margin-left: 5px;
  margin-bottom: 10px;
`;

export const BtnSignUp = styled.View`
  margin: 10px;
  background-color: #3399ff;
  height: 40px;
  width: 355px;
  align-self: center;
  justify-content: center;
  border-radius: 10px;
  shadowcolor: #000000;
  shadowoffset: {
    width: 0px;
    height: 2px;
  }
  shadowopacity: 0.17;
  shadowradius: 2.54px;
  margin-top:20px;
`;

export const BtnLogin = styled.View`
  margin: 10px;
  background-color: #3399ff;
  height: 40px;
  width: 355px;
  align-self: center;
  justify-content: center;
  border-radius: 10px;
  shadowcolor: #000000;
  shadowoffset: {
    width: 0px;
    height: 2px;
  }
  shadowopacity: 0.17;
  shadowradius: 2.54px;
  margin-top:20px;
`;

export const TextInput = styled.TextInput`
  font-size: 18px;
  color: black;
  height: 50px;
  width: 320px;
`;
