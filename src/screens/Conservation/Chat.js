import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {BASE_URL, getUserId, getToken} from '../../utils';
import axios from 'axios';
import {sendMessageSocket, newConversationSocket} from '../../utils/socket';
import {getCurrentMessage} from '../../redux/messageSlice';
import {
  View,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
} from 'react-native';
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
  SendImg,
  TextNameUser,
  TextOnline,
  VideoCallImg,
} from './styles';
import {launchCamera} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import Geolocation from '@react-native-community/geolocation';
import {
  getAllConversations,
  setNotification,
} from '../../redux/conversationsSlice';
import {Text} from 'react-native-animatable';
export default function Chat() {
  const [inputMessage, setInputMessage] = useState('');
  const [notiAddMember, setNotiAddMember] = useState('');
  const scrollRef = useRef(null);
  const [userId, setId] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const usersOnline = useSelector(state => state.userReducer.usersOnline);
  const selectedConversation = useSelector(
    state => state.conversationReducer.selectedConversation,
  );
  const recipient = useSelector(
    state => state.conversationReducer.userRecipient,
  );
  const currentMessage = useSelector(
    state => state.messageReducer.currentMessage,
  );
  const notification = useSelector(
    state => state.conversationReducer.notification,
  );
  const isOnline = Object.keys(usersOnline).find(id => id === recipient?._id);
  const [img, setImg] = useState([]);
  // console.log(img);

  useEffect(() => {
    getInit();
  }, []);

  const getInit = async () => {
    const userId = await getUserId();
    if (userId) {
      // initiateSocket(userId);
      setId(userId);
      // console.log(1);
    }
  };

  const getConversations = async () => {
    try {
      const userId = await getUserId();
      await dispatch(getAllConversations(userId));
    } catch (error) {
      console.log(error);
    }
  };

  const handlSendImages = async () => {
    try {
      const userId = await getUserId();
      const token = await getToken();
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const result = await launchCamera({
          mediaType: 'photo',
          cameraType: 'back',
        });
        console.log(result);
        if (!result.cancelled) {
          var list = [];
          for (let i = 0; i < result.assets.length; i++) {
            const url = result.assets[i].uri;
            list.push(url);
          }
          const formData = new FormData();
          for (let i = 0; i < result.assets.length; i++) {
            formData.append('files', {
              uri: result.assets[i].uri,
              type: 'image/jpeg',
              name: 'avatar.jpg',
            });
          }
          formData.append('conversationId', selectedConversation._id);
          formData.append('user', userId);
          try {
            const result = await axios.post(
              `${BASE_URL}/conversation/sendImages`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'auth-token': token,
                },
              },
            );

            if (result.status === 200) {
              sendMessageSocket({
                ...result.data,
                receiverIds: selectedConversation.users
                  .filter(user => user._id !== userId)
                  .map(user => user._id),
              });

              await dispatch(getCurrentMessage(selectedConversation._id));
            }
          } catch (error) {
            console.log(1);
            console.log(error);
          }
        } else {
          console.log('User cancelled the camera');
        }
      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.log('Error requesting camera permission:', error);
    }
  };

  //3
  const handlSendImagesLibrary = async () => {
    try {
      const userId = await getUserId();
      const token = await getToken();
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const images = await ImagePicker.openPicker({
          multiple: true,
          mediaType: 'photo',
          includeBase64: true, // Nếu bạn muốn gửi base64
        });

        if (images && images.length > 0) {
          const formData = new FormData();
          images.forEach((image, index) => {
            formData.append('files', {
              uri: image.path,
              type: image.mime,
              name: `image_${index}.jpg`,
            });
          });

          formData.append('conversationId', selectedConversation._id);
          formData.append('user', userId);

          try {
            const result = await axios.post(
              `${BASE_URL}/conversation/sendImages`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'auth-token': token,
                },
              },
            );

            if (result.status === 200) {
              sendMessageSocket({
                ...result.data,
                receiverIds: selectedConversation.users
                  .filter(user => user._id !== userId)
                  .map(user => user._id),
              });

              await dispatch(getCurrentMessage(selectedConversation._id));
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log('User cancelled the image picker');
        }
      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.log('Error requesting camera permission:', error);
    }
  };

  const handleLocation = async () => {
    try {
      const userID = await getUserId();
      const token = await getToken();
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const success = async pos => {
          var crd = pos.coords;
          const location = {
            latitude: crd.latitude,
            longitude: crd.longitude,
          };
          const data = {
            conversationId: selectedConversation._id,
            user: userID,
            location: location,
          };
          try {
            console.log(data);
            const result = await axios.post(
              `${BASE_URL}/conversation/sendLocation`,
              data,
              {
                headers: {
                  'auth-token': token,
                },
              },
            );
            if (result.status === 200) {
              sendMessageSocket({
                ...result.data,
                receiverIds: selectedConversation.users
                  .filter(user => user._id !== userId)
                  .map(user => user._id),
              });
              await dispatch(getCurrentMessage(selectedConversation._id));
            }
          } catch (error) {
            console.log(error);
          }
          console.log(location);
        };
        Geolocation.getCurrentPosition(success);
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        Alert.alert('You have denied to grant location permission');
      } else {
        console.log('Ứng dụng không hỗ trợ viêc cấp quyền');
      }
    } catch (error) {
      console.log(2);
      console.log(error);
    }
  };
  const uploadVideo = async () => {
    try {
      const userId = await getUserId();
      const token = await getToken();
      const videos = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
        allowMultiSelection: true,
      });
      console.log(videos);
      console.log(1);
      const formData = new FormData();
      for (let i = 0; i < videos.length; i++) {
        const file = {
          uri: videos[i].uri,
          type: videos[i].type,
          name: videos[i].name,
        };
        formData.append('file', file);
      }
      formData.append('conversationId', selectedConversation._id);
      formData.append('user', userId);

      try {
        const result = await axios.post(
          `${BASE_URL}/conversation/sendVideo`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'auth-token': token,
            },
          },
        );
        if (result.status === 200) {
          sendMessageSocket({
            ...result.data,
            receiverIds: selectedConversation.users
              .filter(user => user._id !== userId)
              .map(user => user._id),
          });
          await dispatch(getCurrentMessage(selectedConversation._id));
        }
      } catch (error) {
        console.log(2);
        console.log(error);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error))
        console.log('User cancelled the upload', error);
      else console.log(error);
    }
  };

  const uploadFile = async () => {
    try {
      const userId = await getUserId();
      const token = await getToken();
      const docs = await DocumentPicker.pick({
        // type: [DocumentPicker.types.pdf||DocumentPicker.types.docx||DocumentPicker.types.pptx],
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      const formData = new FormData();
      for (let i = 0; i < docs.length; i++) {
        const file = {
          uri: docs[i].uri,
          type: docs[i].type,
          name: docs[i].name,
        };
        formData.append('file', file);
      }
      formData.append('conversationId', selectedConversation._id);
      formData.append('user', userId);

      try {
        const result = await axios.post(
          `${BASE_URL}/conversation/sendFile`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'auth-token': token,
            },
          },
        );
        if (result.status === 200) {
          sendMessageSocket({
            ...result.data,
            receiverIds: selectedConversation.users
              .filter(user => user._id !== userId)
              .map(user => user._id),
          });
          await dispatch(getCurrentMessage(selectedConversation._id));
        }
      } catch (error) {
        console.log(1);
        console.log(error);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error))
        console.log('User cancelled the upload', error);
      else console.log(error);
    }
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
      if (currentMessage.length <= 0) {
        newConversationSocket(selectedConversation, {
          ...result.data,
          receiverIds: selectedConversation.users
            .filter(user => user._id !== userId)
            .map(user => user._id),
        });
      } else {
        sendMessageSocket({
          ...result.data,
          receiverIds: selectedConversation.users
            .filter(user => user._id !== userId)
            .map(user => user._id),
        });
      }
      setInputMessage('');
      await dispatch(getCurrentMessage(selectedConversation._id));
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current?.scrollToEnd({animated: true});
    }
  }, [currentMessage, selectedConversation]);

  return (
    <View style={{flex: 1, backgroundColor: '#F2FFFF'}}>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackImg
            source={require('../../images/icons8-back-50.png')}></BackImg>
        </TouchableOpacity>
        <View>
          <TextNameUser>
            {selectedConversation?.isGroup
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChatInfo1');
            // handleNotiAddMember;
          }}>
          <ListImg
            source={require('../../images/icons8-list-24.png')}></ListImg>
        </TouchableOpacity>
      </Header>
      <View style={{marginTop: 20, marginLeft: 10, marginRight: 10, flex: 3}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ref={scrollRef}>
          {currentMessage?.map((item, index) => {
            if (item.user._id === userId) {
              return (
                <ScrollView key={index._id}>
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
        </ScrollView>
        <View>
          {selectedConversation?.isGroup && notification ? (
            <View style={{flexDirection: 'row', borderWidth: 1, backgroundColor: '#E0E0E0', borderRadius: 10, justifyContent: 'space-around', alignItems: 'center', width: 380, alignSelf: 'center', height: 35}}>
              <Text style={{color: 'black'}}> Notification: {notification}</Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setNotification(null));
                }}>
                <Text style={{fontSize: 25, color:'red'}}>X</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

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
          <TouchableOpacity onPress={() => uploadVideo()}>
            <FaceImg
              source={require('../../images/icons8-video-50.png')}></FaceImg>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLocation()}>
            <FaceImg
              source={require('../../images/icons8-location-50.png')}></FaceImg>
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
          <TouchableOpacity onPress={() => uploadFile()}>
            <MoreImg
              source={require('../../images/icons8-more-48.png')}></MoreImg>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handlSendImagesLibrary();
            }}>
            <ImageImg
              source={require('../../images/icons8-image-48.png')}></ImageImg>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handlSendImages();
            }}>
            <MicrophoneImg
              source={require('../../images/icons8-camera-30.png')}></MicrophoneImg>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSendMessage()}>
            <SendImg
              source={require('../../images/icons8-send-32.png')}></SendImg>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
