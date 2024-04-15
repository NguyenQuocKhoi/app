import {useEffect, useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {View} from 'react-native-animatable';
import CardAddMembers from './CardAddMembers';
import {useSelector} from 'react-redux';
import {BackImg, HeaderAddMember, LeaveGroupImg} from '../Conservation/styles';
import {useNavigation} from '@react-navigation/native';

export default function AddMember(props) {
  const navigation = useNavigation();
  const [members, setMembers] = useState([]);
  const selectedConversation = useSelector(
    state => state.conversationReducer.selectedConversation,
  );
  useEffect(() => {
    if (selectedConversation.isGroup) {
      setMembers(selectedConversation.users);
    }
  }, [selectedConversation]);

  return (
    <View>
      <HeaderAddMember>
        <TouchableOpacity onPress={navigation.goBack}>
          <BackImg
            source={require('../../images/icons8-back-50.png')}></BackImg>
        </TouchableOpacity>
        <View>
          <Text style={{fontSize: 20, color: 'white', marginLeft: 10}}>
            Option
          </Text>
        </View>
      </HeaderAddMember>

      <View>
        <Text style={{fontSize: 20, color: 'black', marginLeft: 40}}>
          Add members
        </Text>
      </View>
      <View>
        <CardAddMembers
          members={members}
          conversationId={selectedConversation._id}
          conversation={selectedConversation}
          handleNotiAddMember={props.handleNotiAddMember}
        />
      </View>
    </View>
  );
}
