import styled from 'styled-components';

export const Container = styled.View`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #ffffff;
`;

export const LogoutBtn = styled.Text`
  margin-top: 30px;
  text-align: center;
  color: ${({theme}) => theme.danger};
`;

export const TextInput = styled.TextInput`
  font-size: 20px;
  color: black;
`;

export const TextUserInfor = styled.View`
  flex-direction: column;
  border-bottom-width: 1;
  border-bottom-color: black; 
  width: 280px;
`;

export const ViewUserInfor = styled.View`
margin-left: 15px;
margin-right: 15px;
`;

export const ViewRadioBtn = styled.View`
flex-direction: row;
justify-content: center;
margin: 10px;
margin-top: 20px;
`;

export const RadioBtn = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const IconInfor = styled.Image`
height: 30px; 
width: 30px;
margin-top: 30px;
`;