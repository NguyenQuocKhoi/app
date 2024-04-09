import moment from 'moment';
import {useState} from 'react';
import {Image, Linking, Modal, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-animatable';
import Video from 'react-native-video';

export default function ReceivingContent({data, sender}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const senderName = sender.name;
  const handlePress = () => {
    const url = data.file;
    Linking.openURL(url);
  };

  const showImage = imageUrl => {
    const imageContent = (
      <Image src={imageUrl} style={{width: 'auto', height: 500, resizeMode:'contain'}} />
    );
    setModalContent(imageContent);
    setModalVisible(true);
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
          <View style={{flexDirection:'row'}}>
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
            <Text style={{color: 'black', fontSize: 20, position:'absolute', marginTop:45, marginLeft:10}}>{senderName}</Text>
          </View>
          <View style={{justifyContent: 'center', height: 200, marginTop: 250}}>
            {modalContent}
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
      ): null}
        <Text style={{margin: 5, color: 'gray'}}>
          {moment(data.createdAt).format('HH:mm')}
        </Text>
      </View>
    </View>
  );
}
