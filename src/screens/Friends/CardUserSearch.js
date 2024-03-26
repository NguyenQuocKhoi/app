import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  AppState,
  Text,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import {Header, SearchImg, AddFriendImg, TextI} from './styles';
import {Input} from '../../components';
import {checkPhoneValid} from '../../utils';
import {useSelector} from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
function CardUser({data}) {
  const [textButton, setTextButton] = useState('Invitation');
  const [currentFriends, setCurrentFriends] = useState([]); 
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    try {
      AsyncStorage.getItem('user').then(value => {
        if (value != null) {
          let user = JSON.parse(value);
          setToken(user.token);
          setUserId(user.user._id);
          setContact(user.user.contacts);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };  

  const handleInvitation = async (receiverId) => {
    const senderId = userId;
    if (senderId === receiverId) {
      Alert.alert("Error", "You cannot send a friend request to yourself.");
      return;
    }

    let data = {
      senderId: senderId,
      receiverId: receiverId,
    };
    console.log(data);
    await axios
      .post(`${BASE_URL}/users/addFriend`, data, {
        headers: {
          "auth-token": `${token}`,
        },
      })
      .then((result) => {
        if (result.status === 200) {
          Alert.alert('Success');
          setTextButton('Cancel');
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        Alert.alert('Request Fail');
        
      });
  };
  return (
    <View style={{height: 80, justifyContent: 'center', borderColor: 'gray', borderWidth: 1}}>
      <TouchableOpacity>
      <View style={{justifyContent:'space-around', alignItems:'center', flexDirection:'row'}}>
        {/* <Text>{data._id}</Text> */}
        <Image
              source={require('../../images/user.png')}
              style={{height: 60, width: 60, borderRadius: 50}}
            />
        <View style={{flexDirection: 'column'}}>
          <Text style={{fontSize: 20, color: 'black'}}>{data.name}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 15}}>Phone number: </Text>
            <Text style={{fontSize: 15, color: 'blue'}}>{data.phone}</Text>
          </View>
        </View>
        {!currentFriends.some(f => f._id === data._id) ? (
          <TouchableOpacity onPress={() => handleInvitation(data._id)}><Text style={{fontSize: 20}}>{textButton}</Text></TouchableOpacity>
        ) : null}
      </View>
      </TouchableOpacity>
    </View>
  );
}
export default CardUser;
