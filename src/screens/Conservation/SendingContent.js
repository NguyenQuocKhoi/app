import moment from 'moment';
import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import Video from 'react-native-video';
import {BASE_URL, getToken, getUser, getUserId} from '../../utils';
import {useDispatch, useSelector} from 'react-redux';
import {getCurrentMessage} from '../../redux/messageSlice';
import {removeMessageSocket, sendMessageSocket} from '../../utils/socket';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import CardChat1 from './CardConversation';
export default function SendingContent({data}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const [modalVideoVisible, setModalVideoVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisibleForward, setModalVisibleForward] = useState(false);
  const [modalContent1, setModalContent1] = useState(null);

  const allConversations = useSelector(
    state => state.conversationReducer.allConversation,
  );
  const selectedConversation = useSelector(
    state => state.conversationReducer.selectedConversation,
  );

  const dispatch = useDispatch();
  const handlePress = () => {
    const url = data.file;
    Linking.openURL(url);
  };

  const showImage = imageUrl => {
    const imageContent = (
      <Image
        src={imageUrl}
        style={{width: 'auto', height: 500, resizeMode: 'contain'}}
      />
    );
    setModalContent(imageContent);
    setModalVisible(true);
  };

  const showVideo = videoUri => {
    setSelectedVideo(videoUri);
    setModalVideoVisible(true);
  };

  const showModalContent = data => {
    setModalContent1(data);
    setModalVisibleForward(true);
  };

  const handleRemoveMessage = async () => {
    const userId = await getUserId();
    const token = await getToken();
    try {
      const result = await axios.post(
        `${BASE_URL}/conversation/removeMessage/${data._id}`,
        {
          headers: {
            'auth-token': `${token}`,
          },
        },
      );
      if (result.status === 200) {
        dispatch(getCurrentMessage(selectedConversation._id));
        removeMessageSocket({
          ...data,
          receiverIds: selectedConversation.users
            .filter(user => user._id !== userId)
            .map(user => user._id),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleForwardMessage = async conversation => {
    const token = await getToken();
    const userId = await getUserId();
    const user = await getUser();
    // console.log(user);
    const dt = {
      message: data,
      conversationForwardId: conversation._id,
      userId: user,
    };

    try {
      const result = await axios.post(
        `${BASE_URL}/conversation/forwardMessage`,
        dt,
        {
          headers: {
            'auth-token': token,
          },
        },
      );
      if (result.status === 200) {
        sendMessageSocket({
          ...result.data,
          receiverIds: conversation.users
            .filter(user => user._id !== userId)
            .map(user => user._id),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View
      style={{
        backgroundColor: '#CCFFFF',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        maxWidth: '70%',
        alignSelf: 'flex-end',

        margin: 5,
      }}>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View
          style={{flex: 1, backgroundColor: '#C0C0C0'}}
          // onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={{position: 'absolute', top: 20, right: 20, zIndex: 999}}
            onPress={() => {
              setModalVisible(false);
            }}>
            <Text style={{fontSize: 30, color: 'black', marginTop: -5}}>x</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => setModalVisible(false)}>
            <View
              style={{
                height: 35,
                width: 35,
                position: 'absolute',
                borderRadius: 25,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 330,
                marginTop: 40,
              }}>
              <Text style={{fontSize: 30, color: 'black', marginTop: -5}}>
                x
              </Text>
            </View>
          </TouchableOpacity> */}
          <View style={{justifyContent: 'center', height: 200, marginTop: 250}}>
            {modalContent}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVideoVisible}
        onRequestClose={() => {
          setModalVideoVisible(false);
        }}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={{position: 'absolute', top: 20, right: 20, zIndex: 999}}
            onPress={() => {
              setModalVideoVisible(false);
            }}>
            <Text style={{fontSize: 30, color: 'black', marginTop: -5}}>x</Text>
          </TouchableOpacity>
          <Video
            source={{uri: selectedVideo}}
            style={{flex: 1, width: Dimensions.get('window').width}}
            resizeMode="contain"
            controls
          />
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={modalVisibleForward}
        onRequestClose={() => {
          setModalVisibleForward(false);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: '#C0C0C0',
              height: 500,
              width: 350,
              borderRadius: 10,
            }}
            // onPress={() => setModalVisibleForward(false)}
          >
            <View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                {allConversations?.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      handleForwardMessage(item);
                    }}>
                    <CardChat1 key={index} data={item} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <TouchableOpacity
              style={{position: 'absolute', top: 20, right: 20, zIndex: 999}}
              onPress={() => {
                setModalVisibleForward(false);
              }}>
              <Text style={{fontSize: 30, color: 'black', marginTop: -5}}>
                x
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => setModalVisibleForward(false)}>
              <View
                style={{
                  height: 35,
                  width: 35,
                  position: 'absolute',
                  borderRadius: 25,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 300,
                  marginTop: -500,
                }}>
                <Text style={{fontSize: 30, color: 'black', marginTop: -5}}>
                  x
                </Text>
              </View>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>

      <Text
        style={{
          color: 'black',
          alignSelf: 'flex-end',
          margin: 5,
          marginBottom: -5,
          fontSize: 18,
        }}>
        {data.text}
      </Text>
      {data.images
        ? data.images.map((item, index) => (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{height: 300, width: '100%'}}
                onPress={() => {
                  showImage(item);
                }}>
                <Image
                  style={{height: 300, width: '100%', resizeMode: 'contain'}}
                  src={item}
                  key={index}
                />
              </TouchableOpacity>
            </View>
          ))
        : null}
      {data.video ? (
        <TouchableOpacity onPress={() => showVideo(data.video)}>
          <Video
            source={{uri: data.video}}
            style={{width: 200, height: 200}}
            // controls={true}
          />
        </TouchableOpacity>
      ) : null}
      {data.file ? (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => handlePress()}>
            <Text
              style={{
                color: '#3399ff',
                textDecorationLine: 'underline',
                padding: 10,
              }}>
              {data.file}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {data.location ? (
        <View>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{width: 250, height: 300}}
            showsUserLocation
            region={{
              latitude: data.location.latitude,
              longitude: data.location.longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}>
            <Marker
              coordinate={{
                latitude: data.location.latitude,
                longitude: data.location.longitude,
              }}></Marker>
          </MapView>
        </View>
      ) : null}
      <Text style={{color: 'gray', alignSelf: 'flex-end', margin: 5}}>
        {moment(data.createdAt).format('HH:mm')}
      </Text>

      {/* <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}> */}
      <View>
        <TouchableOpacity onPress={() => handleRemoveMessage()}>
          <Text style={{color: 'red', alignSelf: 'center'}}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => showModalContent(data)}>
          <Text style={{color: 'blue', alignSelf: 'center'}}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* </View> */}
    </View>
  );
}
