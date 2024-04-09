import moment from 'moment';
import React, {useState} from 'react';
import {
  Image,
  Linking,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video'

export default function SendingContent({data}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
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
          onPress={() => setModalVisible(false)}>
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
          <View style={{justifyContent: 'center', height: 200, marginTop: 250}}>
            {modalContent}
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
        // <View style={{alignItems:'center', justifyContent:'center', height: 200, width:600}}>
            <Video
              source={{uri: data.video}}
              style={{width: 200, height: 200, }}
              controls={true}
            />
            // </View>
      ): null}
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
      <Text style={{color: 'gray', alignSelf: 'flex-end', margin: 5}}>
        {moment(data.createdAt).format('HH:mm')}
      </Text>
    </View>
  
  );
}
