import moment from 'moment';
import React from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';

export default function SendingContent({ data }) {

  const handlePress = () => {
    const url = data.file;
    Linking.openURL(url);
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
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{ height: 300, width: '100%', resizeMode: 'contain' }}
              src={item}
              key={index}
            />
          </View>
        ))
        : null}
      {data.file
        ? (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => handlePress()}
            >
              <Text style={{color: '#3399ff', textDecorationLine: 'underline', padding: 10}}>{data.file}</Text>
            </TouchableOpacity>
          </View>
        )
        : null}
      <Text style={{ color: 'gray', alignSelf: 'flex-end', margin: 5 }}>
        {moment(data.createdAt).format('HH:mm')}
      </Text>
    </View>
  );
}
