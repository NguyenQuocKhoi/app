import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  AppState,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import {
  Header,
  SearchImg,
  AddFriendImg,
  TextI,
  BackImg,
  SearchImg1,
  QrImg,
  SettingImg,
} from './styles';
import {Button, Input} from '../../components';
import {BASE_URL, checkPhoneValid, getUserId} from '../../utils';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import CardUser from './CardUserSearch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ReceivedInvitation from './ReceivedInvitation';
import { getPenddingRequests } from '../../redux/userSlice';
function Friend_received(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const goBack = () => {
    navigation.goBack();
  };

  const pendingRequests = useSelector(
    state => state.userReducer.pendingRequests,
  );
  useFocusEffect(
    useCallback(() => {
    const getPendding = async () => {
      try {
        const userID = await getUserId();
        await dispatch(getPenddingRequests(`/users/${userID}`));
        // console.log('Friend-success');
      } catch (error) {
        console.log('Friend');
        console.log(error);
      }
    };
    getPendding();
  }, []));

  return (
    <View>
      <Header>
        <TouchableOpacity onPress={goBack}>
          <BackImg
            source={require('../../images/icons8-back-50.png')}></BackImg>
        </TouchableOpacity>
        <View style={{marginLeft: -180}}>
          <Text style={{fontSize: 20, color: 'white'}}>Invitation</Text>
        </View>
        <TouchableOpacity>
          <SettingImg
            source={require('../../images/icons8-setting-50.png')}></SettingImg>
        </TouchableOpacity>
      </Header>

      <View style={{height: 40, justifyContent: 'center'}}>
        <Text style={{fontSize: 20, marginLeft: 10, color: 'black'}}>
          Pending requests(
          {pendingRequests?.length > 0 ? pendingRequests.length : 0})
        </Text>
      </View>
      <View>
        {pendingRequests?.map((item, index) => (
          <ReceivedInvitation key={index} data={item} />
        ))}
      </View>
    </View>
  );
}
export default Friend_received;
