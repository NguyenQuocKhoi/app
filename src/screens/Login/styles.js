import styled from "styled-components/native";

const LoginImg = styled.Image.attrs(({theme}) => ({
  source: theme.mode === 'light' ? require('../../images/logochat.jpeg') : require('../../images/logochat.jpeg')
  // source: theme.mode === 'light' ? require('../../images/welcome_v2.jpg') : require('../../images/login-dark.png')
}))`
  width: 250px;
  height: 210px;
  resize-mode: contain;
  margin-top: -150px;
`;

const FooterTextBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 10px;
  left: 0; right: 0;
`;

const FooterText = styled.Text`
  text-align: center;
  color: ${({theme}) => theme.primary};
  font-size: 16px;
`;

const ContentContainer = styled.View`
  flex: 1;
  paddingHorizontal: 20px;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.mode === 'light' ? '#fff' : 'transparent'};
`;

const TextB = styled.Text`
  color: ${({theme}) => theme.txt};
`;

export const LoadingWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export {FooterText, FooterTextBtn, LoginImg, ContentContainer, TextB};

// backgroundImage: "linear-gradient(to right, #1E90FF,#00BFFF)",
