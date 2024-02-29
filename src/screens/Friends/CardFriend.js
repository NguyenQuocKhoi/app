import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native-animatable';
import {useDispatch, useSelector} from 'react-redux';
import {getAPiWithToken} from '../../config/Axios';
import {BASE_URL} from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken, getUserId} from '../../utils';
import {getAllConversations} from '../../redux/conversationsSlice';
import {useNavigation} from '@react-navigation/native';
import {Alert, Image, TouchableOpacity} from 'react-native';
import { PhoneImg, VideoCallImg } from '../Friends/styles';
import { getBlocks } from '../../redux/userSlice';

export default function CardFriend({data}) {
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const blocked = useSelector((state) => state.userReducer.blocked);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const token = await getToken();
  //       const result = await axios.get(`${BASE_URL}/users/${data}`, {
  //         headers: {
  //           'auth-token': `${token}`,
  //         },
  //       });
  //       setUser(result.data);
  //     } catch (error) {
  //       console.log(1);
  //       console.log(error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const haneleCreateConversation = async () => {
    const userId = await getUserId();
    const token = await getToken();
    const dt = {
      userId: userId,
      recipientId: data,
    };
    console.log(dt);
    try {
      const result = await axios.post(`${BASE_URL}/conversation/createConversation`, dt, {
        headers: {
          "auth-token": `${token}`,
        },
      })
      console.log('2',result.data);
      if (result.status === 200) {
        await dispatch(
          getAllConversations(userId),
        );
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert("Đã có trong danh sách chat")
    }
  };

  const handleblock = async () => {
    const userID = await getUserId();
    const token = await getToken();
    const dt = {
      senderId: userID,
      receiverId: data._id
    };
    console.log(dt);
    try {
      const result = await axios.post(`${BASE_URL}/users/block`, dt, {
        headers: {
          "auth-token": `${token}`,
        },
      })
      if (result.status === 200) {
        await dispatch(getBlocks(`/users/${userID}`),);
        Alert.alert("Chặn thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnblock = async () => {
    const userID = await getUserId();
    const token = await getToken();
    const dt = {
      senderId: userID,
      receiverId: data._id
    };
    console.log(dt);
    try {
      const result = await axios.post(`${BASE_URL}/users/unblock`, dt, {
        headers: {
          "auth-token": `${token}`,
        },
      })
      if (result.status === 200) {
        await dispatch(getBlocks(`/users/${userID}`),);
        Alert.alert("Hủy chặn thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(blocked);
  
  return (
    <View style={{height: 60, flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
      <TouchableOpacity onPress={() => haneleCreateConversation()}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../../images/user.png')}
              style={{height: 60, width: 60, borderRadius: 50}}
            />
          <Text style={{fontSize: 20, fontWeight: 700, marginLeft: 10}}>{data.name}</Text>
        </View>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <TouchableOpacity>
          <PhoneImg
              source={require('../../images/icons8-phone-50.png')}></PhoneImg>
        </TouchableOpacity>
        <TouchableOpacity>
          <VideoCallImg
              source={require('../../images/icons8-video-call-48.png')}></VideoCallImg>
        </TouchableOpacity>
        <View style={{width: 84, alignItems: 'center'}}>
          {!blocked?.includes(data._id) ? (
            <TouchableOpacity onPress={() => handleblock()}>
              <Text style={{fontSize: 20}}>Chặn</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => handleUnblock()}>
              <Text style={{fontSize: 20}}>Hủy chặn</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
