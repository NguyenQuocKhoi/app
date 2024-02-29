import moment from 'moment';
import {View} from 'react-native';
import {Text} from 'react-native-animatable';

export default function ReceivingContent({data, sender}) {
  const senderName = sender.name;
  return (
    <View style={{flexDirection: 'row'}}>
      <View style={{backgroundColor: 'red', height: 30, width: 30, borderRadius: 30, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: 'white', fontSize: 20}}>{senderName.charAt(0).toUpperCase()}
        {senderName.charAt(6).toUpperCase()}</Text>
      </View>
      <View style={{marginLeft:10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'gray', borderRadius: 8, maxWidth: '70%', margin: 5}}>
        <Text style={{margin: 5, marginBottom: -5, color: 'black', fontSize: 18}}>{data.text}</Text>
        <Text style={{margin: 5, color: 'gray'}}>{moment(data.createdAt).format('HH:mm')}</Text>
      </View>
    </View>
  );
}
