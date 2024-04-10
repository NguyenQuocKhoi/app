import {useDispatch, useSelector} from 'react-redux';
import {BASE_URL, getUserId} from '../../utils';
import {useEffect, useState} from 'react';
import {View} from 'react-native-animatable';
import {Text} from 'react-native-paper';
import moment from 'moment';
import {Image, TouchableOpacity} from 'react-native';
import {Header, SearchImg} from './styles';
import axios from 'axios';
import {selectConversation} from '../../redux/conversationsSlice';
import {getRecipient} from '../../redux/conversationsSlice';
import {getCurrentMessage} from '../../redux/messageSlice';
import {useNavigation} from '@react-navigation/native';
import {isSameDay} from 'react-native-gifted-chat';

export default function CardChat1({data}) {
  const [userRecipient, setUserRecipient] = useState({});
  const usersOnline = useSelector(state => state.userReducer.usersOnline);
  const [lastTime, setLastTime] = useState('');
  const [isOnline, setIsOnline] = useState(null);
  const [lastMessage, setLastMessage] = useState('');

  const currentMessage = useSelector(
    state => state.messageReducer.currentMessage,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const getData = async () => {
      const userId = await getUserId();
      const recipient = data.users.find(user => user._id !== userId);
      setIsOnline(Object.keys(usersOnline).includes(recipient._id));
      setUserRecipient(recipient);
    };
    getData();
  }, [data]);

  return (
    <View>
      <View>
        <View>
          <View
            style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
            <Image
              style={{
                height: 60,
                width: 60,
                borderRadius: 50,
                marginLeft: 15,
                marginBottom: 20,
                resizeMode: 'contain',
              }}
              src={
                data.isGroup
                  ? 'https://static.vecteezy.com/system/resources/previews/010/154/511/non_2x/people-icon-sign-symbol-design-free-png.png'
                  : 'https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png'
              }
            />
            {userRecipient.isOnline || isOnline ? (
              <View
                style={{
                  borderRadius: 10,
                  height: 15,
                  width: 15,
                  backgroundColor: 'rgb(9, 207, 68)',
                  position: 'absolute',
                  marginLeft: 55,
                  bottom: 30,
                }}></View>
            ) : null}
            <View
              style={{
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
                margin: 5,
                width: '100%',
                height: 80,
              }}>
              <View style={{margin: -5}}>
                <Text style={{fontSize: 22, marginTop: 10, marginLeft: 10}}>
                  {data.isGroup ? data.name : userRecipient.name}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
