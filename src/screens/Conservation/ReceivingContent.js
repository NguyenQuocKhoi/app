import moment from 'moment';
import {useEffect, useState} from 'react';
import {Image, Linking, Modal, ScrollView, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-animatable';
import Video from 'react-native-video';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {BASE_URL, getToken, getUserId} from '../../utils';
import {getCurrentMessage} from '../../redux/messageSlice';
import {removeMessageSocket, sendMessageSocket} from '../../utils/socket';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {getAllConversations} from '../../redux/conversationsSlice';
import CardChat1 from './CardConversation';
export default function ReceivingContent({data, sender}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const [modalVisibleForward, setModalVisibleForward] = useState(false);
  const [modalContent1, setModalContent1] = useState(null);

  const allConversations = useSelector(
    state => state.conversationReducer.allConversation,
  );

  const dispatch = useDispatch();
  const senderName = sender.name;
  const handlePress = () => {
    const url = data.file;
    Linking.openURL(url);
  };

  const showModalContent = data => {
    setModalContent1(data);
    setModalVisibleForward(true);
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

  const handleForwardMessage = async conversation => {
    const token = await getToken();
    const userId = await getUserId();
    const dt = {
      message: data,
      conversationForwardId: conversation._id,
      // conversationForwardId: selectedConversation._id,
    };

    // console.log(dt);
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
    <View style={{flexDirection: 'row'}}>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View
          style={{flex: 1, backgroundColor: '#C0C0C0'}}
          onPress={() => setModalVisible(false)}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <View
                style={{
                  height: 35,
                  width: 35,
                  position: 'absolute',
                  borderRadius: 25,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 350,
                  marginTop: 40,
                }}>
                <Text style={{fontSize: 30, color: 'black', marginTop: -5}}>
                  x
                </Text>
              </View>
            </TouchableOpacity>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                position: 'absolute',
                marginTop: 45,
                marginLeft: 10,
              }}>
              {senderName}
            </Text>
          </View>
          <View style={{justifyContent: 'center', height: 200, marginTop: 250}}>
            {modalContent}
          </View>
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
            onPress={() => setModalVisibleForward(false)}>
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
            <TouchableOpacity onPress={() => setModalVisibleForward(false)}>
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
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View
        style={{
          backgroundColor: 'red',
          height: 30,
          width: 30,
          borderRadius: 30,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'white', fontSize: 20}}>
          {senderName.charAt(0).toUpperCase()}
          {senderName.charAt(6).toUpperCase()}
        </Text>
      </View>
      <View
        style={{
          marginLeft: 10,
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 8,
          maxWidth: '70%',
          margin: 5,
        }}>
        <Text
          style={{margin: 5, marginBottom: -5, color: 'black', fontSize: 18}}>
          {data.text}
        </Text>
        {data?.images.map((item, index) => (
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
        ))}
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
        {data.video ? (
          <Video
            source={{uri: data.video}}
            style={{width: 200, height: 200}}
            controls={true}
          />
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
        <Text style={{margin: 5, color: 'gray'}}>
          {moment(data.createdAt).format('HH:mm')}
        </Text>
        <View>
        <TouchableOpacity onPress={() => showModalContent(data)}>
          <Text style={{color: 'blue', alignSelf: 'center'}}>Forward</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
}
