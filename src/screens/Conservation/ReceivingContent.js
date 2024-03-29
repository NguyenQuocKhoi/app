import moment from 'moment';
import {Image, Linking, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-animatable';

export default function ReceivingContent({data, sender}) {
  const senderName = sender.name;
  const handlePress = () => {
    const url = data.file;
    Linking.openURL(url);
  };
  return (
    <View style={{flexDirection: 'row'}}>
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
          <View style={{flexDirection:'row'}}>
            <Image
              style={{height: 300, width:'100%', resizeMode: 'contain'}}
              src={item}
              key={index}
            />
          </View>
        ))}
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
        <Text style={{margin: 5, color: 'gray'}}>
          {moment(data.createdAt).format('HH:mm')}
        </Text>
      </View>
    </View>
  );
}
