import axios from 'axios';
import React, {useState, useEffect, useId, useCallback} from 'react';
import {Alert, Image, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getPenddingRequests} from '../../redux/userSlice';
import {Text, View} from 'react-native-animatable';
import {refreshUser, resetUser} from '../../redux/apiRequest';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {BASE_URL} from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function ReceivedInvitation({data}) {
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  //   const [userID, setUserID] = useState('');
  //   const [token, setToken] = useState('');

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        const user = JSON.parse(value);
        // console.log('token: ',user.token);
        return user.token;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getUserId = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        const user = JSON.parse(value);
        // console.log('token: ',user.user._id);
        return user.user._id;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleAcceptFriend = async () => {
    const userId = await getUserId();
    const token = await getToken();
    const dataApi = {
      receiverId: userId,
      senderId: data,
    };
    try {
      const result = await axios.post(
        `${BASE_URL}/users/acceptFriend`,
        dataApi,
        {
          headers: {
            'auth-token': `${token}`,
          },
        },
      );
      if (result.status === 200) {
        Alert.alert('success');
        try {
          await dispatch(getPenddingRequests(`/users/${userId}`));
        } catch (error) {
          console.log('acc1');
          console.log(error);
        }
      }
    } catch (error) {
      console.log('acc2');
      console.log(error);
    }
  };

  const handleRejectFriend = async () => {
    const userId = await getUserId();
    const token = await getToken();
    const dataApi = {
      receiverId: userId,
      senderId: data,
    };
    try {
      const result = await axios.post(
        `${BASE_URL}/users/rejectFriend`,
        dataApi,
        {
          headers: {
            'auth-token': `${token}`,
          },
        },
      );
      if (result.status === 200) {
        Alert.alert('success');
        try {
          await dispatch(getPenddingRequests(`/users/${userId}`));
        } catch (error) {
        console.log('re1');
          console.log(error);
        }
      }
    } catch (error) {
      console.log('re2');
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const result = await axios.get(`${BASE_URL}/users/${data}`, {
          headers: {
            'auth-token': `${token}`,
          },
        });
        // console.log("userFormID",result.data)
        setUser(result.data);
      } catch (error) {
        console.log('fetch data');
        console.log(error);
      }
    };
    fetchData();
  }, []),);

  return (
    <View style={{height: 80, height: 80, alignItems: 'center', borderColor: 'gray', borderWidth: 1, flexDirection: 'row'}}>
      <Image
              source={require('../../images/user.png')}
              style={{height: 60, width: 60, borderRadius: 50, margin: 20}}
            />
      <View style={{width: 200}}>
        <Text style={{fontSize: 20, color: 'black'}}>{user.name}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              onPress={() => {
                handleAcceptFriend();
              }}>
              <Text style={{fontSize: 20}}>Agree</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleRejectFriend();
              }}>
              <Text style={{fontSize: 20}}>Reject</Text>
            </TouchableOpacity>
          </View>
      </View>
    </View>
  );
}
