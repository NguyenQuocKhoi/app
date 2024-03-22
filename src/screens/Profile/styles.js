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
  color: red;
  font-size: 15px;
`;

export const TextInput = styled.TextInput`
  font-size: 20px;
  color: black;
`;

export const TextUserInfor = styled.View`
  flex-direction: column;
  border-bottom-width: 1px;
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

export const IconCamera = styled.Image`
height: 30px; 
width: 30px;
margin-top: 80px;
margin-left: -30px;

position: absolute;
`;


export const IconPhone = styled.Image`
height: 30px; 
width: 30px;
margin-top: 30px;
tintColor: gray
`;

export const TextBtnUpdate = styled.Text`
  font-size: 20px;
  color: white;
  text-align: center;
`;

export const BtnUpdate = styled.View`
  margin: 10px;
  background-color: #3399ff;
  height: 40px;
  width: 285px;
  align-self: center;
  justify-content: center;
  border-radius: 10px;
  shadowcolor: #000000;
  shadowoffset: {
    width: 0px;
    height: 2px;
  }
  shadowopacity: 0.17;
  shadowradius: 2.54;

  margin-top:20px;
`;