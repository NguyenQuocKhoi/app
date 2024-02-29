import { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Image, View } from 'react-native-animatable';
import CardAddMembers from './CardAddMembers';
import { useSelector } from 'react-redux';
import { AddFriendImg1, BackImg, HeaderAddMember, LeaveGroupImg } from '../Conservation/styles';
import { useNavigation } from '@react-navigation/native';

export default function Members(props) {
  const navigation = useNavigation();
  const [members, setMembers] = useState([]);
  const [openAddMembers, setOpenAddMembers] = useState(false);
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
          <Text style={{ fontSize: 20, color: 'white', marginLeft: 10 }}>
            Tùy chọn
          </Text>
        </View>
      </HeaderAddMember>

      {selectedConversation.isGroup ? (
        <View>
          <Text style={{ fontSize: 20, color: 'black', margin: 10 }}>Members</Text>
          {members?.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
              <Image
                source={require('../../images/user.png')}
                style={{ height: 60, width: 60, borderRadius: 50 }}
              />
              <Text style={{ fontSize: 20, fontWeight: 700, marginLeft: 10 }}>{item.name}</Text>
              {item._id === selectedConversation?.admin ? (
                <Text style={{ marginLeft: 5, fontSize: 15 }}>(admin)</Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {selectedConversation.isGroup ? (
        <View>
          <TouchableOpacity style={{ flexDirection: 'row' }}>
            <LeaveGroupImg
              source={require('../../images/icons8-export-24.png')}></LeaveGroupImg>
            <Text style={{ color: 'red', fontSize: 20 }}>Leave group</Text>
          </TouchableOpacity>
        </View>
      ) : null}

     
    </View>
  );
}
