import {Text, View, TouchableOpacity, Alert} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {BASE_URL, getToken, getUserId} from '../../utils';
import {selectConversation, setNotification} from '../../redux/conversationsSlice';
import {getContacts} from '../../redux/userSlice';
import {AddFriendImg1} from './styles';
import {RadioButton} from 'react-native-paper';
import {Image} from 'react-native-animatable';
import {newGroup, updateGroup} from '../../utils/socket';

export default function CardAddMembers(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.userReducer.contacts);
  const [selectContacts, setSelectContacts] = useState([]);
  const [listRender, setListRender] = useState([]);
  const selectedConversation = useSelector(
    state => state.conversationReducer.selectedConversation,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (contacts && props.members) {
          const filteredContacts = contacts.filter(
            item => !props.members.find(item2 => item._id === item2._id)
          );
          setListRender(filteredContacts);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [contacts, props.members]);

  useEffect(() => {
    getAllContacts();
  }, []);
  const getAllContacts = async () => {
    const userId = await getUserId();
    try {
      await dispatch(getContacts(userId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectContacts = item => {
    if (selectContacts.includes(item)) {
      const update = selectContacts.filter(i => i !== item);
      setSelectContacts(update);
    } else {
      setSelectContacts([...selectContacts, item]);
    }
  };
  // console.log(props.conversation);
  const handleAddMembers = async () => {
    const token = await getToken();
    const userId = await getUserId();

    const dt = {
      conversationId: props.conversationId,
      userIds: selectContacts,
    };
    try {
      const result = await axios.put(
        `${BASE_URL}/conversation/addMembers`,
        dt,
        {
          headers: {
            'auth-token': `${token}`,
          },
        },
      );
      if (result.status === 200) {
        await dispatch(selectConversation(result.data));
        Alert.alert('Success');
      }
        newGroup(
          result.data,
          selectContacts.map(user => user._id),
        );

        updateGroup(
          result.data,
          props.conversation.users
            .filter(user => user._id !== userId)
            .map(user => user._id),
            `${selectContacts.map(user=>user.name)} join group`
        );
      dispatch(setNotification(`${selectContacts.map(user=>user.name)} join group`))
      Alert.alert('Success');
    } catch (error) {
      console.log(1);
      console.log(error);
    }
  };

  return (
    <View {...props}>
      {listRender?.map((item, index) => (
        <View key={index}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center', margin: 10}}
            onPress={() => handleSelectContacts(item)}>
            <Image
              source={require('../../images/user.png')}
              style={{height: 60, width: 60, borderRadius: 50}}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginLeft: 10,
                width: 240,
              }}>
              {item.name}
            </Text>
            <View style={{width: 50}}>
              <RadioButton
                value={`checkbox-${item._id}`}
                status={selectContacts.includes(item) ? 'checked' : 'unchecked'}
                onPress={() => {
                  if (selectContacts.includes(item)) {
                    setSelectContacts(
                      selectContacts.filter(contact => contact !== item),
                    );
                  } else {
                    setSelectContacts([...selectContacts, item]);
                  }
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      ))}
      <View style={{margin: 10}}>
        {selectedConversation.isGroup ? (
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            disabled={selectContacts.length < 1}
            onPress={() => {
              handleAddMembers();
              navigation.goBack();
            }}>
            <AddFriendImg1
              source={require('../../images/icons8-group-24.png')}></AddFriendImg1>
            <Text style={{color: '#3399ff', fontSize: 20}}>Add</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
