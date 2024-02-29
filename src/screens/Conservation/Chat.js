import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {BASE_URL, getUserId, getToken} from '../../utils';
import axios from 'axios';
import {
  getMessageSocket,
  sendMessageSocket,
  newConversationSocket,
} from '../../utils/socket';
import {
  getCurrentMessage,
  handleSetCurrentMessage,
} from '../../redux/messageSlice';
import {View, Text, TextInput, TouchableOpacity, PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SendingContent from './SendingContent';
import ReceivingContent from './ReceivingContent';
import {ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  BackImg,
  FaceImg,
  Header,
  ImageImg,
  ListImg,
  MicrophoneImg,
  MoreImg,
  PhoneImg,
  SearchImg,
  SendImg,
  TextNameUser,
  TextOnline,
  VideoCallImg,
} from './styles';
import { launchCamera } from 'react-native-image-picker';
import { Image } from 'react-native';
export default function Chat() {
  const [inputMessage, setInputMessage] = useState('');
  const scrollRef = useRef(null);
  const [userId, setId] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [notiAddMember, setNotiAddMember] = useState('');
  const usersOnline = useSelector(state => state.userReducer.usersOnline);
 
  //chọn ảnh
  const [img, setImg] = useState('');

  const selectedConversation = useSelector(
    state => state.conversationReducer.selectedConversation,
  );
  const recipient = useSelector(
    state => state.conversationReducer.userRecipient,
  );
  const currentMessage = useSelector(
    state => state.messageReducer.currentMessage,
  );
  const isOnline = Object.keys(usersOnline).find(id => id === recipient?._id);

  const handleNotiAddMember = noti => {
    setNotiAddMember(noti);
  };

  const handleSendMessage = async () => {
    const userId = await getUserId();
    const token = await getToken();
    const dt = {
      conversationId: selectedConversation._id,
      user: userId,
      text: inputMessage,
    };

    const result = await axios.post(
      `${BASE_URL}/conversation/sendMessage`,
      dt,
      {
        headers: {
          'auth-token': `${token}`,
        },
      },
    );
    if (result.status === 200) {
      setInputMessage('');
      const message = {
        conversationId: selectedConversation._id,
        user: userId,
        receiverIds: selectedConversation.users
          .filter(user => user._id !== userId)
          .map(user => user._id),
        text: inputMessage,
      };
      if (currentMessage.length <= 0) {
        newConversationSocket(selectedConversation, message);
      } else {
        sendMessageSocket(message);
      }
      await dispatch(getCurrentMessage(selectedConversation._id));
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({animated: true});
    }
  }, [currentMessage, selectedConversation]);

  useEffect(() => {
    getId();
  }, []);
  const getId = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        const user = JSON.parse(value);
        // console.log('token: ',user.user._id);
        setId(user.user._id);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // useEffect(() => {
  //   getMessageSocket()
  //     .then(result => {
  //       // console.log(result);
  //       dispatch(handleSetCurrentMessage(result));
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }, [userId]);

  // console.log(currentMessage);

  //chọn ảnh
  const requestCameraPermission = async ()=>{
    try{
      const checkPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      
      if(checkPermission === PermissionsAndroid.RESULTS.GRANTED){
        // console.log("ok")
        // mở camera
        const result = await launchCamera({mediaType:'photo', cameraType:'back'});
        //mở thư viện ảnh
        // const result = await launchImageLibrary({mediaType:'photo'});
        console.log(result.assets[0].uri);
        setImg(result.assets[0].uri);
      }else{
        console.log("Từ chối")
      }
    }catch(error){
      console.log(error);
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: '#F2FFFF'}}>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackImg
            source={require('../../images/icons8-back-50.png')}></BackImg>
        </TouchableOpacity>
        <View>
          <TextNameUser>
            {selectedConversation.isGroup
              ? selectedConversation.name
              : recipient?.name}
          </TextNameUser>
          <TextOnline>
            {(recipient && recipient.isOnline) || isOnline
              ? 'Online'
              : 'Offline'}
          </TextOnline>
        </View>
        <TouchableOpacity>
          <PhoneImg
            source={require('../../images/icons8-phone-50.png')}></PhoneImg>
        </TouchableOpacity>
        <TouchableOpacity>
          <VideoCallImg
            source={require('../../images/icons8-video-call-48.png')}></VideoCallImg>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {navigation.navigate('ChatInfo1'); handleNotiAddMember}}>
          <ListImg
            source={require('../../images/icons8-list-24.png')}></ListImg>
        </TouchableOpacity>
        {/* <Text>{userId}</Text> */}
      </Header>
      <View style={{marginTop: 20, marginLeft: 10, marginRight: 10, flex: 3}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ref={scrollRef}>
          {currentMessage?.map((item, index) => {
            if (item.user._id === userId) {
              return (
                <ScrollView key={index}>
                  <SendingContent data={item} />
                </ScrollView>
              );
            } else {
              return (
                <ScrollView key={index}>
                  <ReceivingContent data={item} sender={item.user} />
                </ScrollView>
              );
            }
          })}
          {/*  */}
          {selectedConversation.isGroup && notiAddMember ? (
            <Text>{notiAddMember}</Text>
          ) : null}
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: '#E0E0E0',
            marginLeft: -10,
            marginRight: -10,
            marginTop: 10,
            alignItems: 'center',
            backgroundColor: 'white',
          }}>
          <TouchableOpacity>
            <FaceImg
              source={require('../../images/icons8-face-id-48.png')}></FaceImg>
          </TouchableOpacity>
          <TextInput
            style={{
              // borderWidth: 1,
              flex: 1,
              marginRight: 5,
              backgroundColor: 'white',
              fontSize: 20,
            }}
            placeholderTextColor="gray"
            placeholder="Tin nhắn"
            onChangeText={setInputMessage}
            value={inputMessage}></TextInput>
          <TouchableOpacity>
            <MoreImg
              source={require('../../images/icons8-more-48.png')}></MoreImg>
          </TouchableOpacity>
          <TouchableOpacity>
            <MicrophoneImg
              source={require('../../images/icons8-microphone-48.png')}></MicrophoneImg>
          </TouchableOpacity>
          <TouchableOpacity
            //chọn ảnh
            onPress={()=>requestCameraPermission()}
          >
            <ImageImg
              source={require('../../images/icons8-image-48.png')}></ImageImg>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSendMessage()}>
            {/* <Text>gui</Text> */}
            <SendImg
              source={require('../../images/icons8-send-32.png')}></SendImg>
          </TouchableOpacity>
        </View>

        {/* chọn ảnh */}
        <View>
          {img!=''?<Image source={{uri:img}} style={{height: 250, width: 200}}/>:''}
          
        </View>
      </View>
    </View>
  );
}
