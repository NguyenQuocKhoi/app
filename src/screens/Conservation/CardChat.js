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

export default function CardChat({data}) {
  const [userRecipient, setUserRecipient] = useState({});
  const usersOnline = useSelector(state => state.userReducer.usersOnline);
  const [lastTime, setLastTime] = useState('');
  const [isOnline, setIsOnline] = useState(null);
  const [lastMessage, setLastMessage] = useState('');

  // const isOnline = Object.keys(usersOnline).find(
  //   id => id === userRecipient._id
  // );

  const currentMessage = useSelector(
    state => state.messageReducer.currentMessage,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const getData = async () => {
      const userId = await getUserId();
      getLastMessage();
      const recipient = data.users.find(user => user._id !== userId);
      setIsOnline(Object.keys(usersOnline).includes(recipient._id));
      setUserRecipient(recipient);
    };
    getData();
  }, [data]);

  useEffect(() => {
    getLastMessage();
  }, [currentMessage]);

  //get tin nhan cuoi
  const getLastMessage = async () => {
    const userId = await getUserId();
    const result = await axios.get(
      `${BASE_URL}/conversation/getMessages/${data._id}`,
    );
    // if (result.status === 200) {
    //   const last = result.data[result.data?.length - 1];
    //   if (last.user._id === userId) {
    //     setLastMessage(`Bạn: ${last?.text}`);
    //   } else {
    //     setLastMessage(last.text);
    //   }
    //   setLastTime(last?.createdAt);
    // }
    if (result.status === 200) {
      const last = result.data[result.data?.length - 1];
      if (last.user._id === userId) {
        if (last?.text) {
          setLastMessage(`Bạn: ${last?.text}`);
        } else if (last?.images.length > 0) {
          setLastMessage(`Bạn: vừa gửi ${last.images.length} ảnh`);
        } else if (last?.video) {
          setLastMessage(`Bạn: vừa gửi video`);
        } else if (last?.file) {
          setLastMessage(`Bạn: vừa gửi file`);
        } else if (last?.location) setLastMessage(`Bạn: vừa gửi vị trí`);
      } else {
        if (last?.text) {
          setLastMessage(last?.text);
        } else if (last?.images.length > 0) {
          setLastMessage(`Vừa gửi ${last.images.length} ảnh`);
        } else if (last?.video) {
          setLastMessage(`Vừa gửi video`);
        } else if (last?.file) {
          setLastMessage(`Vừa gửi file`);
        } else if (last?.location) setLastMessage(`Vừa gửi vị trí`);
      }
      setLastTime(last?.createdAt);
    }
  };

  const handleSelectedConversation = async () => {
    await dispatch(selectConversation(data));
    await dispatch(getRecipient(`/users/${userRecipient._id}`));
    await dispatch(getCurrentMessage(data._id));
    navigation.navigate('Chat');
  };

  // console.log(usersOnline);
  return (
    <View>
      <TouchableOpacity onPress={() => handleSelectedConversation()}>
        <View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                alignItems: 'center',
              }}>
              <Image
                // source={require('../../images/user.png')}
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
                    ? data.image ||
                      'https://static.vecteezy.com/system/resources/previews/010/154/511/non_2x/people-icon-sign-symbol-design-free-png.png'
                    : userRecipient.avatar ||
                      'https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png'
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
                  <Text style={{marginLeft: 10, fontSize: 20, color: 'gray'}}>
                    {lastMessage}
                  </Text>
                  <Text
                    style={{
                      marginLeft: 150,
                      position: 'absolute',
                      marginTop: 5,
                    }}>
                    {moment(lastTime).calendar()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
