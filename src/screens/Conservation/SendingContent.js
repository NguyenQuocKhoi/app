import moment from 'moment';
import React from 'react';
import { Image, Text, View } from 'react-native';


export default function SendingContent({ data }) {
  return (
    <View style={{ backgroundColor: '#CCFFFF', borderWidth: 1, borderColor: 'gray', borderRadius: 8, maxWidth: '70%', alignSelf: 'flex-end', margin: 5 }}>
      <Text style={{ color: 'black', alignSelf: 'flex-end', margin: 5, marginBottom: -5, fontSize: 18 }}>{data.text}</Text>
      {data.images ? data.images.map((item, index) => (
        <Image style={{ height: 200, width: 100 }} src={item} key={index} />
      )) : null}
      <Text style={{ color: 'gray', alignSelf: 'flex-end', margin: 5 }}>{moment(data.createdAt).format('HH:mm')}</Text>
    </View>
  );
}
