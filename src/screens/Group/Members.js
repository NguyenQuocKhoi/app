import {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity} from 'react-native';
import {Image, View} from 'react-native-animatable';
import CardAddMembers from './CardAddMembers';
import {useSelector} from 'react-redux';
import {
  AddFriendImg1,
  BackImg,
  HeaderAddMember,
  LeaveGroupImg,
} from '../Conservation/styles';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {BASE_URL, getUser, getUserId} from '../../utils';
import {
  getAllConversations,
  selectConversation,
} from '../../redux/conversationsSlice';
export default function Members(props) {
  const navigation = useNavigation();
  const [members, setMembers] = useState([]);
  const [openAddMembers, setOpenAddMembers] = useState(false);
  const selectedConversation = useSelector(
    state => state.conversationReducer.selectedConversation,
  );
  const [userId, setUserId] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    if (selectedConversation.isGroup) {
      setMembers(selectedConversation.users);
    }
    // setUserId(userId);
    getUserId1();
  }, [selectedConversation]);

  const getUserId1 = async () => {
    const userId = await getUserId();
    // if (userId) {
    setUserId(userId);
    // }
  };

  const handleDeleteConversation = async () => {
    const userId = await getUserId();

    try {
      const result = await axios.delete(
        `${BASE_URL}/conversation/deleteConversation/${selectedConversation._id}`,
      );
      Alert.alert('Success');
      navigation.navigate('HomeScreenNav');
      await dispatch(getAllConversations(userId));
      await dispatch(selectConversation(null));
      // if (result.status === 200) {
      //   await dispatch(getAllConversations(userId));
      //   await dispatch(selectConversation(null));

      //   Alert.alert('Success');
      //   navigation.navigate('Home')
      // }
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(userId);
  return (
    <View>
      <HeaderAddMember>
        <TouchableOpacity onPress={navigation.goBack}>
          <BackImg
            source={require('../../images/icons8-back-50.png')}></BackImg>
        </TouchableOpacity>
        <View>
          <Text style={{fontSize: 20, color: 'white', marginLeft: 10}}>
            Tùy chọn
          </Text>
        </View>
      </HeaderAddMember>

      {selectedConversation.isGroup ? (
        <View>
          <Text style={{fontSize: 20, color: 'black', margin: 10}}>
            Members
          </Text>
          {members?.map((item, index) => (
            <View
              key={index}
              style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
              <Image
                source={require('../../images/user.png')}
                style={{height: 60, width: 60, borderRadius: 50}}
              />
              <Text style={{fontSize: 20, fontWeight: 700, marginLeft: 10}}>
                {item.name}
              </Text>
              {item._id === selectedConversation?.admin ? (
                <Text style={{marginLeft: 5, fontSize: 15}}>(admin)</Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {selectedConversation.isGroup && selectedConversation.admin !== userId ? (
        <View>
          <TouchableOpacity style={{flexDirection: 'row'}}>
            <LeaveGroupImg
              source={require('../../images/icons8-export-24.png')}></LeaveGroupImg>
            <Text style={{color: 'red', fontSize: 20}}>Leave group</Text>
          </TouchableOpacity>
        </View>
      ) : selectedConversation.isGroup &&
        selectedConversation.admin === userId ? (
        <View>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => handleDeleteConversation()}>
            <LeaveGroupImg
              source={require('../../images/icons8-export-24.png')}></LeaveGroupImg>
            <Text style={{color: 'red', fontSize: 20}}>Delete group</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
