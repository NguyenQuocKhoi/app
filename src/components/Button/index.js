import React from 'react';
import {ActivityIndicator} from 'react-native';
import {BtnTxt, Btn} from "./styled";

const Button = ({title, onPress, style, loading}) => <Btn onPress={onPress} style={style} disabled={loading}>
  {loading ? <ActivityIndicator size="small" color="#fff"/> : <BtnTxt>{title}</BtnTxt>}
</Btn>;

export default Button;
